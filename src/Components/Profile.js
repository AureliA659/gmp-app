import React, { useEffect } from 'react';
import { useAuthValue } from './RegisterC/AuthContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import UserNavBar from './UserNavBar';
import './css/profile.css';
import { doc, getDoc, collection, query, getDocs, updateDoc, orderBy } from 'firebase/firestore';
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ImageProfile from '../assets/birds.jpg';
import { Row, Col } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';
import Button from 'react-bootstrap/Button';


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
      console.log(error);
    }
  };

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate('/sign-out');
    });
  };

  const [showA, setShowA] = useState(true);
  const [showB, setShowB] = useState(true);

  const toggleShowA = () => setShowA(!showA);
  const toggleShowB = () => setShowB(!showB);

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
        </Col>
        <Col className='profile_history'>
        <Row>
      {/* <Col md={6} className="mb-2"> */}
      <Col>
        <Button onClick={toggleShowA} className="mb-2" variant='secondary'>
          Your History of Search:
        </Button>
        <Toast show={showA} onClose={toggleShowA} style={{width:'650px'}}>
          
          <Toast.Body>
          {searches.length > 0 ? (
              <div>
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
          </Toast.Body>
        </Toast>
      </Col>
    </Row>
          
          </Col>
      </Row>
    </div>
  );
}

export default Profile;
