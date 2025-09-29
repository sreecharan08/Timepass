import React from 'react';
import './Notification.css';

const Notification = ({ message, onClose }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="notification-container">
      <div className="notification error">
        <span className="icon">!</span>
        <span>{message}</span>
        <button onClick={onClose} className="close-button">&times;</button>
      </div>
    </div>
  );
};

export default Notification;