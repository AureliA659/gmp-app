import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {ReactComponent as Brand} from '../logoipsum-224.svg';
import './css/NavBarStyle.css';
import Button from 'react-bootstrap/Button';
//import {useAuthValue} from './AuthContext';
import { signOut } from 'firebase/auth'; 
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './css/UserNavStyle.css'
import { getDoc, doc } from "firebase/firestore";

function UserNavBar(){


    const navigate = useNavigate();
    const [userCollec,setUserCollec] = useState('');

    // ...

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
            const userRef = doc(db, 'users', auth.currentUser.uid);
            const providerRef = doc(db, 'providers', auth.currentUser.uid);
    
            getDoc(userRef)
            .then((userDoc) => {
                if (userDoc.exists()) {
                setUserCollec('users');
                } else {
                getDoc(providerRef)
                    .then((providerDoc) => {
                    if (providerDoc.exists()) {
                        setUserCollec('providers');
                        // Redirige-le vers la page correspondante
                        // Exemple : navigate('/provider-page');
                    } else {
                        console.log('User not found');
                    }
                    })
                    .catch((error) => {
                    console.log('Error getting provider document:', error);
                    });
                }
            })
            .catch((error) => {
                console.log('Error getting user document:', error);
            });
        } else {
            setUserCollec('');
            // L'utilisateur n'est pas connecté, gère cette situation en conséquence
        }
        });
    
        return () => {
        unsubscribe();
        };
    }, []);
  
  // ...
  

    const handleSignOut = ()=>{
        console.log('signed out');
        signOut(auth).then(()=>{
        navigate('/')
        })
        
    }

        return(
            
            <nav className="navbar_user">
                <div className="container">
                    <div className="logo">
                        <Link to="/"><Brand/></Link>
                        <span>The spot</span>
                    </div>
                    <div className="nav-elements">
                        <ul>
                            <li><Link to="/">Home</Link></li>

                            <li>
                                <Link to={userCollec === 'users' ? '/user-page' : '/provider-page'}>
                                    My Profile
                                </Link>
                            </li>
                            
                            <li><Link to="/services">Services</Link></li>

                            <li>
                            <Button variant="outline-light" className="login_but" onClick={handleSignOut}>
                                SignOut
                            </Button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )

        
}


export default UserNavBar;