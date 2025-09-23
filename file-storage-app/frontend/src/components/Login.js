import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const responseGoogle = async (response) => {
    try {
      const res = await axios.post('/api/auth/google', {
        tokenId: response.credential,
      });
      if (res.data.token) {
        localStorage.setItem('user', JSON.stringify(res.data));
      }
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <p>Please sign in to continue.</p>
      <GoogleLogin
        onSuccess={responseGoogle}
        onError={() => {
          console.log('Login Failed');
        }}
        size="medium"
      />
    </div>
  );
};

export default Login;
