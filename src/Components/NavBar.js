import React, {useState} from "react";
import {Link} from "react-router-dom";
import {ReactComponent as Brand} from '../logoipsum-224.svg';
import './css/NavBarStyle.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Login from "./Login";


function NavBar(){

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

        return(
            
            <nav className="navbar">
                <div className="container">
                    <div className="logo">
                        <Link to="/"><Brand/></Link>
                        <span>The spot</span>
                    </div>
                    <div className="nav-elements">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            
                            <li id="serv_tab" className="serv_tab"><Link to="/services">Services</Link></li>
                            
                            <li><Link to="/provider">Provider</Link></li>

                            <li><Link to="/register">Register</Link> </li>

                            <li>
                            <Button variant="outline-light" className="login_but" onClick={handleShow}>
                                Login
                            </Button>

                            <Modal 
                                show={show} 
                                onHide={handleClose}
                                className='test'>
                                <Modal.Header>
                                <Modal.Title className="title_modal">Login</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Login/>
                                </Modal.Body>
                            </Modal>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )

        
}


export default NavBar;