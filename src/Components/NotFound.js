import React from "react";
import './css/notFoundStyle.css';
import NavBar from "./NavBar";


class NotFound extends React.Component{
    render(){
        return(
            <div className="NotF">
                <NavBar/>
                <h2 className="text">404 not found</h2>
            </div>
        )
    }
} 



export default NotFound;