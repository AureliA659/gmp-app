import React, { useState } from 'react';
import { PhoneNumberUtil } from 'google-libphonenumber';
import NavBar from './NavBar';

function TestComp() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(false);

  const validatePhoneNumber = () => {
    const phoneUtil = PhoneNumberUtil.getInstance();
    try {
      const parsedNumber = phoneUtil.parse(phoneNumber, 'INTERNATIONAL'); // Remplacez 'US' par le code de pays souhaité
      const isValidNumber = phoneUtil.isValidNumber(parsedNumber);
      setIsValid(isValidNumber);
    } catch (error) {
      setIsValid(false);
    }
  };

  return (
    <div>
        <div>
            <NavBar/>
        </div>
        <div>
        <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <button onClick={validatePhoneNumber}>Vérifier</button>
        {isValid ? <p>Le numéro de téléphone est valide.</p> : <p>Le numéro de téléphone est invalide.</p>}
        </div>
    </div>
  );
}

export default TestComp;
