import React from "react";
import NavBar from "./NavBar";
import Card from 'react-bootstrap/Card';
import Goodbye from '../assets/junseong-lee-unsplash.jpg';


const signOutStyles = {
    width: '28rem',
    margin: 'auto',
    marginTop:'80px',
    marginBottom:'230px',

}

const mainStyle = {
    backgroundImage: `url(${Goodbye})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    //backgroundAttachment: 'fixed',
    minHeight: '100vh'
}



function SignOut(){

    return(
        <div style={mainStyle}>
            <div>
                <NavBar/>
            </div>
            <Card style={signOutStyles}>
                <Card.Body>
                    <Card.Title>You signed out</Card.Title>
                    <Card.Text>
                    Hope to see you soon!
                    </Card.Text>
                    <Card.Link href="/">Back to home</Card.Link>
                </Card.Body>
            </Card>
            
        </div>
    )

}


export default SignOut