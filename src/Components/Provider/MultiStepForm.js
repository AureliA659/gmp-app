import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function MultiStepForm() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    paymentMethod: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 3) {
      console.log(formData); // Do whatever you want with the data
    } else {
      setStep(step + 1);
    }
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
            <h2>Step 1</h2>
            <label>
              First Name:
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </label>
          </>
        );
      case 2:
        return (
          <>
            <h2>Step 2</h2>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </label>
            <label>
              City:
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </label>
            <label>
              State:
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </label>
            <label>
              Zip Code:
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
              />
            </label>
          </>
        );
      case 3:
        return (
          <>
            <h2>Step 3</h2>
            <label>
              Payment Method:
              <select name="paymentMethod" onChange={handleChange}>
                <option value="">Select Payment Method</option>
                <option value="credit-card">Credit Card</option>
                <option value="paypal">PayPal</option>
              </select>
            </label>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {renderStep(step)}
      <div>
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
  );
}

export default MultiStepForm