import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import logo from './Logo1.png';

const Register = ({ setIsAuthenticated }) => {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [yearOfBirth, setYearOfBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [image, setImage] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'image') {
      setImage(e.target.files[0]);
    } else {
      switch (name) {
        case 'userId':
          setUserId(value);
          break;
        case 'email':
          setEmail(value);
          break;
        case 'password':
          setPassword(value);
          break;
        case 'yearOfBirth':
          setYearOfBirth(value);
          break;
        case 'phoneNumber':
          setPhoneNumber(value);
          break;
        default:
          break;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert('You must accept the terms and conditions to register.');
      return;
    }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('yearOfBirth', yearOfBirth);
    formData.append('phoneNumber', phoneNumber);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post('http://localhost:3000/api/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setShowOtpInput(true);
    } catch (error) {
      console.error('Error registering user', error);
      setError(error.response.data);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/auth/verify-email', { email, verificationCode: otp });
      alert('Email verified successfully');
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error verifying OTP', error);
      setError(error.response.data);
    }
  };

  return (
    <div className="register-container">
      <img src={logo} alt="Logo" className="logo" />
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="register-userId">User ID:</label>
          <input
            id="register-userId"
            type="text"
            name="userId"
            placeholder="User ID"
            value={userId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="register-email">Email:</label>
          <input
            id="register-email"
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="register-password">Password:</label>
          <input
            id="register-password"
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="register-yearOfBirth">Year of Birth:</label>
          <input
            id="register-yearOfBirth"
            type="text"
            name="yearOfBirth"
            placeholder="Year of Birth"
            value={yearOfBirth}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="register-phoneNumber">Phone Number:</label>
          <input
            id="register-phoneNumber"
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="register-image">Upload Image:</label>
          <input
            id="register-image"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
          <small>Upload an image to compare if you want</small>
        </div>
        <div className="terms-container">
          <input
            type="checkbox"
            name="termsAccepted"
            id="termsAccepted"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          <label htmlFor="termsAccepted">
            I accept the <a href="http://localhost:3000/terms" target="_blank" rel="noopener noreferrer">terms and conditions</a>
          </label>
        </div>
        <button type="submit">Register</button>
      </form>

      {showOtpInput && (
        <form onSubmit={handleVerifyOtp}>
          <div>
            <label htmlFor="otp">Verification Code:</label>
            <input
              id="otp"
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button type="submit">Verify</button>
        </form>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Register;
