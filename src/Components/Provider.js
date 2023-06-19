import React from "react";
import './css/Provider-style.css';
import NavBar from "./NavBar";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

function Provider(){

    const navigate = useNavigate();
    const handleClick = ()=> navigate('/provider-register');

    return(
        <div className="provider">
            <div className="header_p">
              <NavBar/>  
            </div>
            
            <div className="main-div">
                <div className="intro">
                    <br/>
                    <h2 id="title_pro">Let's exchange our talents to create a stronger and fairer community</h2>
                    <br/>
                    <Button variant="primary" id="but-provider" onClick={handleClick}>
                        Register
                    </Button>
                    <br/>
                </div>
            </div>

        </div>
    )
    
}

export default Provider;