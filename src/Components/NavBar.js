import React from "react";
import { NavLink } from "react-router-dom";
import {ReactComponent as Brand} from '../logoipsum-223.svg';
import './css/NavBarStyle.css';

class NavBar extends React.Component{
    render(){
        return(
            <nav className="navbar">
                <div className="container">
                    <div className="logo">
                        <NavLink to="/"><Brand/></NavLink>
                    </div>
                    <div className="nav-elements">
                        <ul>
                            <li><NavLink to="/">Home</NavLink></li>
                            <li><NavLink to="/login">Login</NavLink></li>
                            <li><NavLink to="/test">Services</NavLink></li>
                            <li><NavLink to="index.js">Contact</NavLink></li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}

export default NavBar;