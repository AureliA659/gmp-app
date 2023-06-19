import React, { useEffect } from 'react';
import { useAuthValue } from './RegisterC/AuthContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import UserNavBar from './UserNavBar';
import './css/profile.css';
import { doc, getDoc, collection, query, getDocs, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ImageProfile from '../assets/birds.jpg';
import { Row, Col } from 'react-bootstrap';


function Profile() {
  const { currentUser } = useAuthValue();
  const navigate = useNavigate();
  const [userRef, setUserRef] = useState();
  const [searches, setSearches] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const promises = [
        getDoc(doc(db, 'users', currentUser.uid)),
        getDoc(doc(db, 'providers', currentUser.uid)),
      ];

      const results = await Promise.all(promises);
      const userData = results.find((result) => result.exists());
      setUserRef(userData?.data());

      fetchSearches();
    };
    fetchUser();
  }, [currentUser.uid]);

  const fetchSearches = async () => {
    const searchesRef = collection(db, 'users', currentUser.uid, 'history');
    const q = query(searchesRef);
    const querySnapshot = await getDocs(q);
    const searchesData = querySnapshot.docs.map((doc) => doc.data());
    setSearches(searchesData);
  };

  const test = () => {
    setEditMode(true);
    setFirstName(userRef?.firstName || '');
    setLastName(userRef?.lastName || '');
  };

  const handleSave = async () => {
    if (firstName.trim() === '' || lastName.trim() === '') {
      // Gère l'erreur ici (par exemple, affiche un message d'erreur)
      return;
    }

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        firstName: firstName,
        lastName: lastName
      });
      
      setUserRef(prevUserRef => ({
        ...prevUserRef,
        firstName: firstName,
        lastName: lastName
      }));

      setEditMode(false);
    } catch (error) {
      // Gère l'erreur ici (par exemple, affiche un message d'erreur)
      console.log(error);
    }
  };

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate('/');
    });
  };

  return (
    <div>
      <div className='header-user'>
        <UserNavBar />
      </div>
      <Row className='card_and_history'>
        <Col>
        <Card className='profile'>
          <Card.Img variant='top' src={ImageProfile} />
          <Card.Body>
            <Card.Title>{userRef ? userRef.pseudo : 'Loading...'}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {userRef ? userRef.mail : 'Loading...'}
            </Card.Subtitle>
            <Card.Text>
              {editMode ? (
                <>
                  <input
                    type='text'
                    value={firstName}
                    onChange={event => setFirstName(event.target.value)}
                  />
                  <input
                    type='text'
                    value={lastName}
                    onChange={event => setLastName(event.target.value)}
                  />
                </>
              ) : (
                <>
                  First name: {userRef ? userRef.firstName : 'Loading...'} <br/>
                  Last name: {userRef ? userRef.lastName : 'Loading...'}
                </>
              )}
            </Card.Text>
          </Card.Body>

          <Card.Body>
            <Card.Link onClick={editMode ? handleSave : test} href='#'>
              {editMode ? 'Save' : 'Edit Profile'}
            </Card.Link>
            <Card.Link className='hand-cursor' onClick={handleSignOut}>
              Sign out
            </Card.Link>
          </Card.Body>
        </Card>
        {/* </div> */}
        </Col>
        <Col className='profile_history'>
          {searches.length > 0 ? (
              <div>
                <h3 className='h3_profile'>Your history of Search</h3>
              <ListGroup as='ol' id='list_history' >
                {searches.map((search, index) => (
                  <ListGroup.Item as='li' key={index}>
                    {search.search}
                    </ListGroup.Item>
                ))}
              </ListGroup>
              </div>
          ) : (
            
              <span>You have no research done for the moment.</span>
            
          )}
          {/* </div> */}
          </Col>
      </Row>
    </div>
  );
}

export default Profile;
