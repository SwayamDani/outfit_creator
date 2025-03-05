import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe outside of component render to avoid recreating it on each render
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Component to handle Stripe payments
const CheckoutForm = ({ planDetails, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    // Create payment intent on the server
    try {
      const response = await fetch('http://localhost:5000/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({
          amount: planDetails.price,
          userId: user.uid,
          planId: planDetails.id
        })
      });
      
      const data = await response.json();
      
      // Confirm the payment with Stripe.js
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email: user.email,
          },
        },
      });

      if (error) {
        setCardError(error.message);
        onError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess(planDetails);
      }
    } catch (error) {
      console.error("Error:", error);
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="card-element-container">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
          onChange={e => setCardError(e.error ? e.error.message : null)}
        />
      </div>
      
      {cardError && <div className="payment-error">{cardError}</div>}
      
      <button 
        type="submit" 
        className="payment-button"
        disabled={loading || !stripe}
      >
        {loading ? 'Processing...' : `Pay $${(planDetails.price / 100).toFixed(2)}`}
      </button>
    </form>
  );
};

// Main subscription plans component with improved UI
const SubscriptionPlans = () => {
  const { user, updateSubscription } = useContext(UserContext);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: 0,
      features: [
        '5 outfit text generations per day',
        '2 image generations per day',
        'Basic outfit recommendations'
      ],
      isCurrent: user?.subscriptionTier === 'free'
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 999, // $9.99
      features: [
        'Unlimited text generations',
        '10 image generations per day',
        'Advanced outfit recommendations',
        'Priority support'
      ],
      isCurrent: user?.subscriptionTier === 'premium',
      recommended: true
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: 1999, // $19.99
      features: [
        'Unlimited text & image generations',
        'Custom outfit criteria',
        'AI wardrobe analysis',
        '24/7 Priority support'
      ],
      isCurrent: user?.subscriptionTier === 'pro'
    }
  ];

  const handleSelectPlan = (plan) => {
    if (plan.isCurrent) return;
    if (plan.id === 'free') {
      // Handle downgrade to free tier
      setLoading(true);
      // Implementation needed to downgrade in backend
      setTimeout(() => {
        updateSubscription('free');
        setNotification({
          type: 'success',
          message: 'Downgraded to Free plan. Changes will take effect at the end of your billing cycle.'
        });
        setLoading(false);
      }, 1000);
    } else {
      setSelectedPlan(plan);
      setShowModal(true);
    }
  };

  const handlePaymentSuccess = async (plan) => {
    setLoading(true);
    try {
      // In a real implementation, the backend would handle this via a webhook
      // This is a simplified version just for demonstration
      await updateSubscription(plan.id);
      setNotification({
        type: 'success',
        message: `Successfully subscribed to ${plan.name}!`
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Error updating subscription. Please contact support.'
      });
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const handlePaymentError = (message) => {
    setNotification({
      type: 'error',
      message: `Payment failed: ${message}`
    });
  };

  return (
    <div className="subscription-container">
      {loading && <div className="loading-overlay">
        <div className="spinner"></div>
      </div>}
      
      {notification && (
        <div className={`notification ${notification.type}`}>
          <p>{notification.message}</p>
          <button onClick={() => setNotification(null)}>×</button>
        </div>
      )}
      
      <div className="subscription-header">
        <h1>Choose Your Plan</h1>
        <p>Unlock the full potential of AI-powered fashion with our premium plans</p>
      </div>
      
      <div className="plans-grid">
        {plans.map(plan => (
          <div 
            key={plan.id} 
            className={`plan-card ${plan.isCurrent ? 'current' : ''} ${plan.recommended ? 'recommended' : ''}`}
          >
            {plan.recommended && <div className="recommended-badge">MOST POPULAR</div>}
            <h2>{plan.name}</h2>
            <div className="plan-price">
              ${(plan.price / 100).toFixed(2)}
              {plan.price > 0 && <span>/month</span>}
            </div>
            <ul className="plan-features">
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button 
              className={`plan-button ${plan.isCurrent ? 'current' : ''} ${plan.recommended ? 'recommended' : ''}`}
              onClick={() => handleSelectPlan(plan)}
              disabled={plan.isCurrent}
            >
              {plan.isCurrent ? 'Current Plan' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
      
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            <h2>Subscribe to {selectedPlan.name}</h2>
            <p>You'll be charged ${(selectedPlan.price / 100).toFixed(2)} per month</p>
            
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                planDetails={selectedPlan}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;