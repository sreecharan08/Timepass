import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../App';
import './LoginPage.css';
import Logo from '../components/Logo';

const LoginPage = () => {
  const navigate = useNavigate();
  const showNotification = useNotification();

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:5000/auth/google', {
        token: credentialResponse.credential,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (error) {
      console.error('Login Failed:', error);
      showNotification('Network Error');
    }
  };

  const handleLoginError = () => {
    console.log('Login Failed');
    showNotification('Network Error');
  };

  return (
    <div className="login-page-container">
      <header className="login-header">
        <Logo />
      </header>
      <div className="login-box">
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
          useOneTap
        />
      </div>
    </div>
  );
};

export default LoginPage;