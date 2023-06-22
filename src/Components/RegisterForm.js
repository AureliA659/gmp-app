import {useState} from 'react'
import './css/Register_style.css'
import {auth} from '../firebase.js'
import {useNavigate} from 'react-router-dom'
import {createUserWithEmailAndPassword, sendEmailVerification} from 'firebase/auth'
import {useAuthValue} from './RegisterC/AuthContext'
import NavBar from './NavBar'
import { db } from '../firebase.js'
import { collection, doc, setDoc, getDoc } from 'firebase/firestore'
// import Button from 'react-bootstrap/Button'
// import Modal from 'react-bootstrap/Modal'


function RegisterForm() {


  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userPseudo, setUserPseudo] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const {setTimeActive} = useAuthValue()
  // const [show, setShow] = useState(false);

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  const userRef = collection(db,"users");
  const provRef = collection(db, "providers");

  const validatePassword = () => {
    let isValid = true
    if (password !== '' && confirmPassword !== ''){
      if (password !== confirmPassword) {
        isValid = false
        setError('Passwords does not match')
      }
      else if(!(/\d/.test(password)) || !(/[a-z]/.test(password))){
        isValid = false
        setError('Password has to have at least one number and one letter');
      }
    }
    return isValid
  }

  const validatePseudo = async () => {
    let isValid = true;
    if (userPseudo !== '') {
      if (userPseudo.length < 5) {
        isValid = false;
        setError('Pseudo has to be at least 5 characters long');
      } else {
        const userDocRef = doc(userRef, userPseudo);
        const provDocRef = doc(provRef, userPseudo);
  
        try {
          const [userDocSnapshot, provDocSnapshot] = await Promise.all([
            getDoc(userDocRef),
            getDoc(provDocRef),
          ]);
  
          if (userDocSnapshot.exists || provDocSnapshot.exists) {
            isValid = false;
            console.log('Le pseudo existe déjà.');
          } else {
            isValid = true;
            console.log('success');
          }
        } catch (error) {
          console.error('Error checking username existence:', error);
        }
      }
    }
    return isValid;
  };
  

  const register = e => {
    e.preventDefault()
    setError('')
    if(validatePassword() && validatePseudo()) {
      // Create a new user with email and password using firebase
        createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          sendEmailVerification(auth.currentUser)  
          .then(() => {
            setTimeActive(true)
            navigate('/verify-email')
            const docData = {
              user_id :  auth.currentUser.uid,
              pseudo : userPseudo,
              firstName: firstName,
              lastName: lastName,
              mail: email,
            }
            setDoc(doc(db,'users',auth.currentUser.uid),docData)
            
          }).catch((err) => alert(err.message))
        })
        .catch(err => setError(err.message))
    }
    setFirstName('')
    setLastName('')
    setUserPseudo('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className='register'>
      <div className='header'>
        <NavBar/>
      </div>
      <br/>
      <div className='center'>
        <div className='auth'>
          <h1>Register</h1>
          {error && <div className='auth__error'>{error}</div>}
          <form onSubmit={register} name='registration_form'>
            <input
             type='text'
             value={userPseudo}
             placeholder='Choose a pseudo (minimum 5 caracters)'
             required
             onChange={e=> setUserPseudo(e.target.value)}/>

            <input
              type='text'
              value={firstName}
              placeholder='Enter your first name'
              required
              onChange={e => setFirstName(e.target.value)}/>

            <input
              type='text'
              value={lastName}
              placeholder='Enter your last name'
              required
              onChange={e => setLastName(e.target.value)}/>

            <input 
              type='email' 
              value={email}
              placeholder="Enter your email"
              required
              onChange={e => setEmail(e.target.value)}/>

            <input 
              type='password'
              value={password} 
              required
              placeholder='Enter your password'
              onChange={e => setPassword(e.target.value)}/>

              <input 
              type='password'
              value={confirmPassword} 
              required
              placeholder='Confirm password'
              onChange={e => setConfirmPassword(e.target.value)}/>

            <button type='submit'>Register</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm