import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const StarRating = ({ count, color, onRating, connected, averageRating, userRating }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const getColor = (index) => {
    if (hoverRating >= index) {
      return color?.filled || "#f5eb3b";
    } else if (!hoverRating && userRating >= index) {
      return color?.filled || "#f5eb3b";
    } else if (!hoverRating && averageRating >= index) {
      return color?.filled || "#DCDCDC";
    }

    return color?.unfilled || "#DCDCDC";
  };

  const handleRating = (rating) => {
    if (connected) {
      onRating(rating);
    }
  };

  const starRating = useMemo(() => {
    if (!connected) {
      // Utilisateur non connecté, afficher uniquement la note moyenne
      return (
        <div>
          Average Rating: {averageRating.toFixed(1)}{" "}
          <FontAwesomeIcon icon={faStar} style={{ color: getColor(averageRating) }} />
        </div>
      );
    }

    return Array(count)
      .fill(0)
      .map((_, i) => i + 1)
      .map((index) => (
        <FontAwesomeIcon
          key={index}
          className="cursor-pointer"
          icon={faStar}
          onClick={() => handleRating(index)}
          style={{ color: getColor(index) }}
          onMouseEnter={() => setHoverRating(index)}
          onMouseLeave={() => setHoverRating(0)}
        />
      ));
  }, [count, averageRating, hoverRating, connected, color, onRating]);

  return (
  <div>
    {starRating}<br/>
    Average Rating: {averageRating.toFixed(1)}{" "}
    </div>);
};

StarRating.propTypes = {
  count: PropTypes.number,
  color: PropTypes.shape({
    filled: PropTypes.string,
    unfilled: PropTypes.string,
  }),
  onRating: PropTypes.func,
  connected: PropTypes.bool,
  averageRating: PropTypes.number,
  userRating: PropTypes.number,
};

StarRating.defaultProps = {
  count: 5,
  color: {
    filled: "#f5eb3b",
    unfilled: "#DCDCDC",
  },
  onRating: () => {},
  connected: false,
  averageRating: 0,
  userRating: 0,
};

export default StarRating;
