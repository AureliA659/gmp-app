import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";  
import { useAuthValue } from "../RegisterC/AuthContext";
import { db } from "../../firebase";
import { doc, setDoc, collection, query, orderBy, limit, getDocs, where } from "firebase/firestore";
import NavBar from "../NavBar";
import '../css/PRegister_style.css';
import { ProgressBar} from "react-bootstrap";
import GoogleAutocomplete from "../RegisterC/GoogleAutoComplete";
//import axios from "axios";

function PRegisterForm() {
  const [step, setStep] = useState(1);
  const [lastProviderId, setLastProviderId] = useState(0);
  const [usernameErr, setUsernameErr] = useState(''); 

  useEffect(() => {
    fetchLastProviderId();
  }, []);

  const fetchLastProviderId = async () => {
    try {
      const providersCollection = collection(db, 'providers');
      const providersQuery = query(providersCollection, orderBy('user_idx ', 'desc'), limit(1));
      const providersSnapshot = await getDocs(providersQuery);
      
      if (!providersSnapshot.empty) {
        providersSnapshot.forEach((doc) => {
          setLastProviderId(doc.data().user_idx); 
        });
      }
    } catch (error) {
      console.log("Error getting last provider ID:", error);
    }
  };

  const [formData, setFormData] = useState({
    username:"",
    firstName: "",
    lastName: "",
    phone: "",
    activity: "",
    activity_name: "",
    selectedSortPrice:'',
    price:'',
    //currency:'',
  });

  const [email, setEmail] = useState('');
  const [password,setPassword] = useState('');
  //const [currenciesList,setCurrenciesList] = useState([]);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error,setError] = useState('');
  const {setTimeActive} = useAuthValue();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchCurrencies = async () => {
  //     try {
  //       const response = await axios.get(
  //         `https://v6.exchangeratesapi.io/latest?access_key=d15071c983cc07104490ad7f`
  //       );
  //       const { data } = response;
  //       const currencies = Object.keys(data.rates);
  //       console.log(currencies);
  //       setCurrenciesList(currencies);
  //     } catch (error) {
  //       console.error("Erreur lors de la récupération des devises :", error);
  //     }
  //   };
  
  //   fetchCurrencies();
  // }, []);


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

  const validateUser = async () => {
    const providersQ = query(
      collection(db,'providers'),where('username','==',formData.username)
    );
    const usersQ = query(collection(db,'users'),where('pseudo','==',formData.username));
    const [pSnapShot, uSnapShot] = await Promise.all([
      getDocs(providersQ),
      getDocs(usersQ)
    ]);
    let usernameExist = false;
    pSnapShot.forEach((doc) => {
      let docData = doc.data();
      if(docData.username == formData.username){
        setUsernameErr('Username already exists, please choose another one');
        usernameExist = true;
      }
    })
    uSnapShot.forEach((doc) => {
      let docData = doc.data();
      if(docData.pseudo == formData.username){
        setUsernameErr('Username already exists, please choose another one');
        usernameExist = true;
      }
    })
    return !usernameExist;
  }

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setFormData((prevData) => ({ ...prevData, username: value }));
    console.log(value);
    validateUser();
  };

  const register = e => {
    e.preventDefault()
    console.log(selectedAddress)
    setError('')
    if(step===1 && !validateUser()){
      setError('Username already exists');
      return;
    }
    if(step===3){
      if(validatePassword()) {
        // Create a new user with email and password using firebase
          createUserWithEmailAndPassword(auth, email, password)
          .then(() => {
            sendEmailVerification(auth.currentUser)  
            .then(() => {
              setTimeActive(true)
              navigate('/verify-email')
              const newProviderId = lastProviderId + 1;
              const docData = {
                user_id :  auth.currentUser.uid,
                user_idx : newProviderId,
                type:'providers',
                username: formData.username,
                first_name: formData.firstName,
                last_name: formData.lastName,
                phone: formData.phone,
                address: selectedAddress,
                activity_category: formData.activity,
                activity_name: formData.activity_name.toUpperCase(),
                sort_price: formData.selectedSortPrice,
                price: formData.price,
                email: email,
              }
              console.log(docData)
              setDoc(doc(db,'providers',auth.currentUser.uid),docData)
              
            }).catch((err) => alert(err.message))
          })
          .catch(err => setError(err.message))
      }
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    }
    else{
      setStep(step+1);
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep = (step) => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="header_pr">
              <NavBar/>
            </div>
            
            <div className='nav_form'>
              <ProgressBar className="nav-form">
                <ProgressBar animated variant='info' now={33} label='Personal Information' />
                <ProgressBar className='stripe' now={33} label='Professional Information' />
                <ProgressBar className='stripe' now={34} label='Access Information'/>
              </ProgressBar>
            </div>
            
            <div className="center_p">
              <h2>Personal Information</h2>
              <div className="auth_p">
                <label>
                Username: <br/>
                <input
                  className="input_p"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleUsernameChange}
                  required
                />
                {usernameErr && (
                  <div className="error_bubble">
                    <span>{usernameErr}</span>
                  </div>
                )}
              </label>
              <br/>
              <label>
                First Name: <br/>
                <input
                  className="input_p"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </label>
              <br/>
              <label>
                Last Name: <br/>
                <input
                  className="input_p"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </label>
              <br/>
              <label>
                Phone: <br/>
                <input
                  className="input_p"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </label>
              <br/>
              <label htmlFor="selectedAddress">Address:
                <GoogleAutocomplete
                  onSelectPlace={(place)=> {setSelectedAddress(place.formatted_address)}}
                  required/>
              </label>
              <br/>
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="header_pr">
              <NavBar/>
            </div>
            
            <div className='nav_form'>
              <ProgressBar className="nav-form">
                <ProgressBar animated variant='info' now={33} label='Personal Information' />
                <ProgressBar animated variant="info" now={33} label='Professional Information' />
                <ProgressBar className='stripe' now={34} label='Access Information'/>
              </ProgressBar>
            </div>
            <div className="center_p">
              <h2>Professional Information</h2>
              <div className="auth_p">

                <label>
                  Your Principal Activity: <br/>
                    <select name="activity" onChange={handleChange} required>
                        <option value=''>Select your sector of activity</option>
                        <option value='Agriculture'>Agriculture</option>
                        <option value='Education'>Education</option>
                        <option value='Health Care'>Health Care</option>
                        <option value='Domestic Services'>Domestic Services</option>
                        <option value='Craft'>Crafts</option>
                        <option value='Creative Services'>Creative Services</option>
                        <option value='Transport'>Transport</option>
                        <option value='Support Services'>Support Services</option>
                        <option value='Informatic Technology'>Information Technology</option>
                    </select>
                </label>
                <br/>
                <label>
                  Activity Name:<br/>
                  <input
                    className="input_p"
                    type="text"
                    name="activity_name"
                    value={formData.activity_name}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Price: <br/>
                  <label>
                    <input
                      type='radio'
                      name="selectedSortPrice"
                      value='perHour'
                      onChange={handleChange}/>
                    Per Hour&nbsp;
                  </label>
                  <label>
                    <input
                      type='radio'
                      name="selectedSortPrice"
                      value='perService'
                      onChange={handleChange}/>
                    Per Service
                  </label><br/>
                  
                  <input
                    className="input_p"
                    type='number'
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min='0'
                    step='0.01'/>
                </label>
            
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
             <div className="header_pr">
              <NavBar/>
            </div>
            
            <div className='nav_form'>
              <ProgressBar className="nav-form">
                <ProgressBar animated variant='info' now={33} label='Personal Information' />
                <ProgressBar animated variant="info" now={33} label='Professional Information' />
                <ProgressBar animated variant="info" now={34} label='Access Information'/>
              </ProgressBar>
            </div>
            <div className="center_p">
              <div className="auth_p">
                <label>
                  <input
                    className="input_p"
                    type='email'
                    value={email}
                    placeholder='Enter your email'
                    required
                    onChange={e => setEmail(e.target.value)}/>
                </label>
                <br/>
                <label>
                  <input
                    className="input_p"
                    type='password'
                    value={password}
                    placeholder='Enter a password'
                    required
                    onChange={e=>setPassword(e.target.value)}
                  />
                </label>
                <br/>
                <label>
                  <input
                    className="input_p"
                    type='password'
                    value={confirmPassword}
                    placeholder='Confirm your password'
                    onChange={e=>setConfirmPassword(e.target.value)}
                    required
                    />
                </label>
                </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
    {error && <div className="auth_error">{error}</div>}
    <form onSubmit={register}>
      {renderStep(step)}
      <div>
        <br/>
        {step > 1 && (
          <button type="button" onClick={handlePrevious}>
            Previous
          </button>
        )}
        
        {step < 3 ? (
          <button type="submit">Next</button>
        ) : (
          <button type="submit">Submit</button>
        )}
      </div>
    </form>
    </>
  );
}


export default PRegisterForm