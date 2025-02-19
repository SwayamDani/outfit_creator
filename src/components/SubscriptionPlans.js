import React, { useState } from 'react';
import PaymentForm from './PaymentForm'; // Import the PaymentForm component
import Modal from './Modal'; // Import the Modal component
import Notification from './Notification'; // Import the Notification component
import './SubscriptionPlans.css';

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const handlePaymentSuccess = () => {
    setNotificationMessage('Payment successful!');
    setIsModalOpen(false); // Close the modal on success
  };

  const handlePaymentError = (message) => {
    setError(message);
    setNotificationMessage(message);
  };

  const openModal = (amount) => {
    setSelectedPlan(amount);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  const closeNotification = () => {
    setNotificationMessage('');
  };

  return (
    <div className="subscription-container">
      <div className="plan-card">
        <h3 className="plan-title">Free Plan</h3>
        <ul className="plan-features">
          <li>5 outfit text generations per day</li>
          <li>2 image generations per day</li>
          <li>Basic outfit recommendations</li>
        </ul>
        <button className="subscribe-button" disabled>
          Current Plan
        </button>
      </div>

      <div className="plan-card">
        <h3 className="plan-title">Premium Plan</h3>
        <ul className="plan-features">
          <li>Unlimited text generations</li>
          <li>10 image generations per day</li>
          <li>Basic outfit recommendations</li>
        </ul>
        <button onClick={() => openModal(999)}>Select Premium Plan</button>
      </div>

      <div className="plan-card">
        <h3 className="plan-title">Pro Plan</h3>
        <ul className="plan-features">
          <li>Unlimited text & image generations</li>
          <li>Custom outfit criteria</li>
          <li>Priority support</li>
        </ul>
        <button onClick={() => openModal(1999)}>Select Pro Plan</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <PaymentForm 
          amount={selectedPlan} // Pass the selected plan amount
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      </Modal>

      <Notification message={notificationMessage} onClose={closeNotification} />
    </div>
  );
};

export default SubscriptionPlans; 