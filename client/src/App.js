import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Notification from './components/Notification';

// Create a context for the notification
const NotificationContext = createContext(null);
export const useNotification = () => useContext(NotificationContext);

function App() {
  const [notification, setNotification] = useState('');

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, 5000);
  };

  const closeNotification = () => {
    setNotification('');
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <NotificationContext.Provider value={showNotification}>
        <Router>
          <Notification message={notification} onClose={closeNotification} />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={localStorage.getItem('token') ? <HomePage /> : <Navigate to="/login" />}
            />
          </Routes>
        </Router>
      </NotificationContext.Provider>
    </GoogleOAuthProvider>
  );
}

export default App;