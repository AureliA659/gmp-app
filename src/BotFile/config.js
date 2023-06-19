import { createChatBotMessage } from "react-chatbot-kit";
import DogPicture from "./DogPicture";
import Options from "./Options/Options";

const botName = 'The Bot';

const config = {
    initialMessages: [
        createChatBotMessage(`Hello! I'm ${botName}`),
        createChatBotMessage(`How can I help you?`, {
            widget: "options",
          }),
    
    ],
    botName: botName,
    widgets: [
        {
            widgetName:'dogPicture',
            widgetFunc: (props)=> <DogPicture {...props}/>
        },
        {
            widgetName: "options",
            widgetFunc: (props) => <Options {...props} />,
          },
    ],
};

export default config;