import React from 'react';
import './SubscriptionPrompt.css';

export default function SubscriptionPrompt({ onClose }) {
  return (
    <div className="subscription-overlay">
      <div className="subscription-modal">
        <h2>Daily Photo Limit Reached</h2>
        <p>You've reached your daily limit of 5 photos. Upgrade to continue generating outfits!</p>
        
        <div className="subscription-plans">
          <div className="plan">
            <h3>Premium Plan</h3>
            <p className="price">$9.99/month</p>
            <ul>
              <li>Up to 20 photos per day</li>
              <li>10 outfit generations per day</li>
              <li>Priority support</li>
            </ul>
            <button className="subscribe-button">Subscribe to Premium</button>
          </div>
          
          <div className="plan featured">
            <h3>Pro Plan</h3>
            <p className="price">$19.99/month</p>
            <ul>
              <li>Unlimited photos</li>
              <li>Unlimited outfit generations</li>
              <li>Custom outfit criteria</li>
              <li>24/7 priority support</li>
            </ul>
            <button className="subscribe-button primary">Subscribe to Pro</button>
          </div>
        </div>
        
        <button className="close-button" onClick={onClose}>
          Maybe Later
        </button>
      </div>
    </div>
  );
} 