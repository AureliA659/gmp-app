import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import {ReactComponent as Brand} from '../../logoipsum-224.svg';
import '../css/NavBarStyle.css';
import Button from 'react-bootstrap/Button';

function AdminNavBar(){

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            setUser(user);
          } else {
            setUser(null);
          }
        });
    
        return () => unsubscribe();
      }, []);

      const handleSignOut = async () => {
        try {
          await signOut(auth).then(()=>{
            navigate('/sign-out')
            })
        } catch (error) {
          console.error('Error :', error);
        }
      };


        return(
            
            <nav className="navbar">
                <div className="container">
                    <div className="logo">
                      <Brand/>
                        <span>The spot</span>
                    </div>
                    <div className="nav-elements">
                        <ul>

                            <li><Link to='/admin-page'>Dashboard</Link></li>

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


export default AdminNavBar;