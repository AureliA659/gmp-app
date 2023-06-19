import React from 'react';
//import NavBar from '../Components/NavBar';


const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleHello = ()=>{
    const botMessage = createChatBotMessage('Hello, nice to meet you!');
    setState((prev)=>({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleDog = () => {
    const botMessage = createChatBotMessage(
      'Here a dog picture for testing the widget',
      {
        widget: 'dogPicture',
      }
    );

    setState((prev)=>({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  const handleRegistration = () =>{
    
    const botMessage = createChatBotMessage(
      'As being a registred user you can save your research history, save providers whom interesting you',
      {
      }
      );
    // setState((prev)=>({
    //   ...prev,
    //   messages:[...prev.messages,botMessage]
    // }));
    addMessageToState(botMessage);
  };

  const addMessageToState = (message) => {
    setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  };

  

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleHello,
            handleDog,
            handleRegistration,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;