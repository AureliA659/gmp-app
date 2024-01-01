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
                    src={`https://openchat.so/chat/<find_it_on_the_website>`}
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
