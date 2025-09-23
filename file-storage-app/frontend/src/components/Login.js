import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Login = () => {
  const responseGoogle = async (response) => {
    try {
      const res = await axios.post('/api/auth/google', {
        tokenId: response.credential,
      });
      if (res.data.token) {
        localStorage.setItem('user', JSON.stringify(res.data));
      }
      window.location.href = '/';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <GoogleLogin
        onSuccess={responseGoogle}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </div>
  );
};

export default Login;
