import {useState} from 'react';
import { Link } from 'react-router-dom';
//import './css/forms.css';
import './css/Login-style.css';
import {signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail} from 'firebase/auth';
import {auth} from '../firebase';
import {useNavigate} from 'react-router-dom';
import {useAuthValue} from './RegisterC/AuthContext';
import Button from 'react-bootstrap/Button';
import { db } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';


function Login(){

  const [email, setEmail] = useState('')
  const [femail, setFemail] = useState('')
  const [password, setPassword] = useState('') 
  const [error, setError] = useState('')
  const {setTimeActive} = useAuthValue()
  const navigate = useNavigate()

  const [show, setShow] = useState(false);

  const handleClose = () => { setShow(false);}
  const handleShow = () => {
    setShow(true);
    document.body.style.overflow = 'hidden';};

    
    const getUserData = async () => {
      try {
        var docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if(userData.pseudo === 'admin'){
            navigate('/admin-page');
          }
          else{
            updateDoc(docRef, {
            verified: true
          });
          navigate('/user-page');
          // in users
          console.log('User found in "users"');
          }
          
        }
        else {
          docRef = doc(db,'providers',auth.currentUser.uid);
          updateDoc(docRef,{
            verified: true
          });
          //in providers
          console.log('User found in "providers"');
          navigate('/provider-page')
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données de l\'utilisateur :', error);
      }
    };
      
    

  const login = e => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      if(!auth.currentUser.emailVerified) {
        sendEmailVerification(auth.currentUser)
        .then(() => {
          setTimeActive(true)
          navigate('/verify-email')
        })
      .catch(err => alert(err.message))
      
    }else{
      getUserData();
      //navigate('/user-page');
    }
    })
    .catch(err => {
      if(err.code === 'auth/wrong-password'){
        var errMsg = err.message;
        errMsg = 'You entered a wrong password, if you forgot it click on forgot password.';
        //setError(err.message)
        setError(errMsg);
        setPassword('');
      }
      
    })
  }


  const reset_p = e =>{
    e.preventDefault()
    sendPasswordResetEmail(auth,femail)
    .then(() =>{
      alert('Please check your email')
      setTimeActive(true)
      handleClose()
    })
    .catch(err => console.log(err))

  }

  if (show) {
    return (
      <div className='center1'>
        <div className='auth1'>
          <form onSubmit={reset_p}>
            <input
            type='email'
            value={femail}
            required
            placeholder='Enter your email'
            onChange={e => setFemail(e.target.value)}/>
            <br/>
            <br/>
            <button type='submit'>Submit</button>
          </form>
          </div>
      </div>
    )
  }

  return(
    <div>
      <div className='center1'>
        <div className='auth1'>
          {error && <div className='auth__error'>{error}</div>}
          <br/>
          <form onSubmit={login} name='login_form'>
            <input
              className='input-log' 
              type='email' 
              value={email}
              required
              placeholder="Enter your email"
              onChange={e => setEmail(e.target.value)}/>
            <br/>
            <input
              className='input-log'  
              type='password'
              value={password}
              required
              placeholder='Enter your password'
              onChange={e => setPassword(e.target.value)}/>
            <br/>
            <br/>
            <Button className='submit_but' type='submit' variant='success'>Login</Button>
            <p>
              <Button className='forgot' variant="link" onClick={handleShow}>Forgot Password?</Button>
            </p>
          </form>
          <p className='link_log'>
            Don't have and account? 
            <Link to='/register'>Create one here</Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login