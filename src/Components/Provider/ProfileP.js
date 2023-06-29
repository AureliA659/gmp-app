import React from 'react'
import { useAuthValue } from '../RegisterC/AuthContext'
import { signOut } from 'firebase/auth' 
import { auth, db } from '../../firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import '../css/profileP.css'
import Card from 'react-bootstrap/Card'
import ImageProfile from '../../assets/birds.jpg'
import UserNavBar from '../UserNavBar'
import { Row, Col } from 'react-bootstrap'
import { useState, useEffect } from 'react'


function ProfileP() {
  const navigate = useNavigate()
  const {currentUser} = useAuthValue();
  const [userRef, setUserRef] = useState();
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sortPrice, setSortPrice] = useState('');
  const [sPrice, setSPrice] = useState('');
  

  useEffect(() => {
    const fetchUser = async () => {
      const promises = [
        getDoc(doc(db, 'users', currentUser.uid)),
        getDoc(doc(db, 'providers', currentUser.uid)),
      ];

      const results = await Promise.all(promises);
      const userData = results.find((result) => result.exists());
      setUserRef(userData?.data());
    };
    fetchUser();
  }, [currentUser.uid]);

  const test = () => {
    setEditMode(true);
    setFirstName(userRef?.first_name || '');
    setLastName(userRef?.last_name || '');
    setPhoneNumber(userRef?.phone || '');
    setSortPrice(userRef?.sort_price || '');
    setSPrice(userRef?.price || '');
  };

  const handleSave = async () => {
    if (firstName.trim() === '' || lastName.trim() === '' || phoneNumber.trim() === '') {
      return;
    }

    try {
      const userDocRef = doc(db, 'providers', currentUser.uid);
      await updateDoc(userDocRef, {
        first_name: firstName,
        last_name: lastName,
        phone: phoneNumber,
        sort_price: sortPrice,
        price: sPrice
      });
      
      setUserRef(prevUserRef => ({
        ...prevUserRef,
        first_name: firstName,
        last_name: lastName,
        phone: phoneNumber
      }));

      setEditMode(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = ()=>{
    signOut(auth).then(()=>{
      navigate('/')
    })
  }

    return (
      <div>
      <div className='header-user'>
        <UserNavBar/>
      </div>
      <Row className='main_pp'>
        <Col>
        <Card className='card-profile'>
          <Card.Img variant="top" src={ImageProfile} style={{width:'300px', height:'auto'}} />
          <Card.Body>
            <Card.Title>{userRef ? userRef.pseudo : 'Loading...'}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {userRef ? userRef.email : 'Loading...'}
            </Card.Subtitle>
            <Card.Text>
            {editMode ? (
                <>
                  <input
                    type='text'
                    value={firstName}
                    onChange={event => setFirstName(event.target.value)}
                  /><br/>
                  <input
                    type='text'
                    value={lastName}
                    onChange={event => setLastName(event.target.value)}
                  /><br/>
                  <input
                    type='text'
                    value={phoneNumber}
                    onChange={event => setPhoneNumber(event.target.value)}
                  /><br/>
                  <input
                    type='number'
                    value={sPrice}
                    onChange={event=>setSPrice(event.target.value)}
                    min='0'
                    step='0.01'
                  /><br/>
                  <input
                    type='radio'
                    name='sortPrice'
                    value='Per hour'
                    onChange={event=>setSortPrice(event.target.value)}
                  />Per hour
                  <input
                    type='radio'
                    name='sortPrice'
                    value='Per service'
                    onChange={event=>setSortPrice(event.target.value)}
                  />Per service
                </>
              ) : (
                <>
                  Activity name: {userRef ? userRef.activity_name : 'Loading...'} <br/>
                  First name: {userRef ? userRef.first_name : 'Loading...'} <br/>
                  Last name: {userRef ? userRef.last_name : 'Loading...'} <br/>
                  Phone: {userRef ? userRef.phone : 'Loading...'}<br/>
                  Service Price: {userRef ? userRef.price : 'Loading...'}<br/>
                  Sort of Service Price: {userRef ? userRef.sort_price : 'Loading...'}

                </>
              )}
            </Card.Text>
          </Card.Body>
          
          <Card.Body>
          <Card.Link onClick={editMode ? handleSave : test} href='#'>
              {editMode ? 'Save' : 'Edit Profile'}
            </Card.Link>
            <Card.Link className='hand-cursor' onClick={handleSignOut}>Sign out</Card.Link>
          </Card.Body>
        </Card>
        </Col>
        <Col>
          <h4>Coming Soon : Courier Service</h4>
        </Col>
      </Row>
    </div>
    )

  
}

export default ProfileP