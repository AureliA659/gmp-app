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
            <div>
                <Chatbot
                    config={config}
                    messageParser = {MessageParser}
                    actionProvider = {ActionProvider}
                />
            </div>
        )
    }
}



export default BotApp;