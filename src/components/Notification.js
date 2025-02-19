import React from 'react';
import './Notification.css'; // Create a CSS file for styling

const Notification = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="notification">
      <span>{message}</span>
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default Notification; 