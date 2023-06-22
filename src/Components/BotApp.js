import React from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import './css/BotApp.css';

import config from '../BotFile/config';
import MessageParser from '../BotFile/MessageParser';
import ActionProvider from '../BotFile/ActionProvider';


class BotApp extends React.Component{
    
    
    render(){
        //const [showBot,toggleBot] = useState(false);
        return(
            <div style={{ height: "500px", width: "auto" }}>
                <iframe
                    src={`https://ora.ai/embed/e6d09966-c80c-48a3-a27a-67b10d36c9d2`}
                    width="100%"
                    height="100%"
                    style={{ border: "0", borderRadius: "4px" }}
                />
            </div>


            // <div>
            //     <Chatbot
            //         config={config}
            //         messageParser = {MessageParser}
            //         actionProvider = {ActionProvider}
            //     />
            // </div>
        )
    }
}



export default BotApp;