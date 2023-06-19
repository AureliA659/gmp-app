import React from "react";
import './Options.css';

const Options = (props) => {
  const options = [
    {
      text: "Register",
      handler: props.actionProvider.handleRegistration,
      id: 1,
    },
    { text: "Become a provider",
     handler: () => {}, id: 2 },
    { text: "Find a service", handler: () => {}, id: 3 },
  ];

  const buttonsMarkup = options.map((option) => (
    <button key={option.id} onClick={option.handler} className="option-button">
      {option.text}
    </button>
  ));

  return <div className="options-container">{buttonsMarkup}</div>;
};

export default Options;
