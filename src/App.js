//import logo from './logo.svg';
import React, {useState, useEffect} from 'react';
import BotApp from './Components/BotApp';
import { ReactComponent as ButtonIcon } from './assets/robot.svg';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ConditionallyRender } from 'react-util-kit';
import './App.css';
import Services from './Components/Services';
import Provider from './Components/Provider';
import RegisterForm from './Components/RegisterForm';
import VerifyEmail from './Components/RegisterC/VerifyEmail';
import NotFound from './Components/NotFound';
import HomePage from './Components/HomePage';
import Profile from './Components/Profile';
import Login from './Components/Login';
import {AuthProvider} from './Components/RegisterC/AuthContext';
import {auth} from './firebase';
import {onAuthStateChanged} from 'firebase/auth';
import PrivateRoute from './Components/RegisterC/PrivateRoute';
import {Navigate} from 'react-router-dom';
import TestComp from './Components/Provider/PRegisterForm';
import PRegisterForm from './Components/Provider/PRegisterForm';
import ProfileP from './Components/Provider/ProfileP';
import Footer from './Components/Footer';


function App(){

  const [showChatbot, toggleChatbot] = useState(true);
  const [currentUser, setCurrentUser] = useState(null)
  const [timeActive, setTimeActive] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
  }, [])

  return(
    <div className='App'>
      <BrowserRouter>
      <AuthProvider value={{currentUser, timeActive, setTimeActive}}>
      <Routes>
        <Route exact path='/' element={<HomePage/>} />
        <Route path='/user-page' element={
          <PrivateRoute>
            <Profile/>
          </PrivateRoute>
        }/>
        <Route path='/provider-page' element={
          <PrivateRoute>
            <ProfileP/>
          </PrivateRoute>
        }/>
        <Route path='/login' element={
          !currentUser?.emailVerified
          ?<Login/>
          : <Navigate to='/user-page' replace/>
        }/>
        <Route path='/register' element={
        !currentUser?.emailVerified
        ?<RegisterForm/>
        :<Navigate to='/user-page' replace/>
      }/>
      <Route path='/provider-register' element={
        !currentUser?.emailVerified
        ?<PRegisterForm/>
        :<Navigate to='/user-page' replace/>
      }/>
        <Route path='/verify-email' element={<VerifyEmail/>}/>
        <Route path='/services' element={<Services/>}/>
        <Route path='/provider' element={<Provider/>}/>
        <Route path='/test' element={<TestComp/>} />
        <Route path='/notfound' element={<NotFound/>} />
        
      </Routes>
      </AuthProvider>
  </BrowserRouter>

      
      <div className='app-chatbot-container'>
        <ConditionallyRender
          ifTrue = {showChatbot}
          show = {<BotApp/>}
          />
      </div>
      <button className='app-chatbot-button' onClick={()=> toggleChatbot((prev)=> !prev)}>
        <ButtonIcon className='app-chatbot-button-icon'/>
      </button>
      <Footer/>
    </div>
  );
}

export default App;
