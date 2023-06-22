import React, { useState } from 'react';
import { PhoneNumberUtil } from 'google-libphonenumber';

// function PhoneNumberValidation() {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [isValid, setIsValid] = useState(false);


// const validatePhoneNumber = () => {
//     const phoneUtil = PhoneNumberUtil.getInstance();
//     try {
//       const parsedNumber = phoneUtil.parse(phoneNumber, 'INTERNATIONAL'); 
//       const isValidNumber = phoneUtil.isValidNumber(parsedNumber);
//       setIsValid(isValidNumber);
//     } catch (error) {
//       setIsValid(false);
//     }
//   };
  
//   return (
//     <div>
//       <input type="text" value={phoneNumber} onChange={(e) => {
//         setPhoneNumber(e.target.value);
//         validatePhoneNumber(); 
//       }} />
//       {!isValid && <p>Number is not valid.</p>}
//     </div>
//   );
  
// }

function PhoneNumberValidation({ phoneNumber, setPhoneNumber }) {
    const [isValid, setIsValid] = useState(false);
  
    const validatePhoneNumber = () => {
      const phoneUtil = PhoneNumberUtil.getInstance();
      try {
        const parsedNumber = phoneUtil.parse(phoneNumber, 'US'); // Remplacez 'US' par le code de pays souhaité
        const isValidNumber = phoneUtil.isValidNumber(parsedNumber);
        setIsValid(isValidNumber);
      } catch (error) {
        setIsValid(false);
      }
    };
  
    return (
      <div>
        <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value) } />
        <button onClick={validatePhoneNumber}>Vérifier</button>
        {!isValid && <p>Le numéro de téléphone est invalide.</p>}
      </div>
    );
  }
  

export default PhoneNumberValidation;
