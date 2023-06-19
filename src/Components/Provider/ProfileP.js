import React from 'react'
import { useAuthValue } from '../RegisterC/AuthContext'
import { signOut } from 'firebase/auth' 
import { auth } from '../../firebase'
import { useNavigate } from 'react-router-dom'
import '../css/profileP.css'
import Card from 'react-bootstrap/Card'
import ImageProfile from '../../assets/birds.jpg'
import UserNavBar from '../UserNavBar'


function ProfileP() {
  const navigate = useNavigate()

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
      <div className='main_pp'>
        <Card className='card-profile'>
          <Card.Img variant="top" src={ImageProfile} />
          <Card.Body>
            <Card.Title>Your Profile</Card.Title>
            <Card.Text>
            </Card.Text>
          </Card.Body>
          
          <Card.Body>
            <Card.Link className='hand-cursor' onClick={handleSignOut}>Sign out</Card.Link>
          </Card.Body>
        </Card>
      </div>
      
    </div>
    )

  
}

export default ProfileP