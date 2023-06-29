import React, { useRef } from "react";
import { StandaloneSearchBox, useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

const GoogleAutoComplete = ({ onSelectPlace }) => {
  const inputRef = useRef(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const handlePlaceChanged = () => {
    const place = inputRef.current.getPlaces()[0];
    onSelectPlace(place);
  };

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  return isLoaded ? (
    <StandaloneSearchBox
      onLoad={(ref) => (inputRef.current = ref)}
      onPlacesChanged={handlePlaceChanged}
    >
      <input type="text" placeholder="Enter Location" size='56'/>
    </StandaloneSearchBox>
  ) : (
    <div>Loading Google Maps...</div>
  );
};

export default GoogleAutoComplete;
