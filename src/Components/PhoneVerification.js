import React, { useState } from 'react';
import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

const PhoneVerification = ({ onSubmit }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleVerify = () => {
    try {
      const parsedNumber = phoneUtil.parse(phoneNumber);
      const isValidNumber = phoneUtil.isValidNumber(parsedNumber);
      setIsValid(isValidNumber);
      
      if (isValidNumber) {
        const formattedNumber = phoneUtil.format(parsedNumber, PhoneNumberUtil.NATIONAL);
        onSubmit(formattedNumber);
      }
    } catch (error) {
      setIsValid(false);
    }
  };

  return (
    <div>
      <label>
        Numéro de téléphone :
        <input type="text" value={phoneNumber} onChange={handleChange} />
      </label>
      {!isValid && <div style={{ color: 'red' }}>Numéro de téléphone invalide</div>}
      <button onClick={handleVerify}>Vérifier</button>
    </div>
  );
};

export default PhoneVerification;
