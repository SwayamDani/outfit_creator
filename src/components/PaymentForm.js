import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserContext } from '../contexts/UserContext';
import axios from 'axios';

// Replace with your Stripe publishable key from environment variable
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ amount, plan, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get client secret from your backend
      const { data } = await axios.post('http://18.117.8.173:5000/create-payment-intent', {
        amount: amount * 100, // Convert to cents
        metadata: {
          userId: user.uid,
          plan: plan
        }
      }, {
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`
        }
      });

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              email: user.email,
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        onPaymentError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Update user's subscription in Firestore
        await updateDoc(doc(db, 'users', user.uid), {
          subscriptionTier: plan,
          dailyTextGenerations: plan === 'premium' ? 999999 : plan === 'pro' ? 999999 : 5,
          dailyImageGenerations: plan === 'premium' ? 10 : plan === 'pro' ? 999999 : 2,
          subscriptionDate: new Date().toISOString()
        });

        // Update local user context
        setUser(prev => ({
          ...prev,
          subscriptionTier: plan,
          dailyTextGenerations: plan === 'premium' ? 999999 : plan === 'pro' ? 999999 : 5,
          dailyImageGenerations: plan === 'premium' ? 10 : plan === 'pro' ? 999999 : 2
        }));

        onPaymentSuccess();
        navigate('/generate'); // Redirect to the generator page
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment processing failed. Please try again.');
      onPaymentError('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h3>Complete Your Payment</h3>
      <div className="form-row">
        <label htmlFor="card-element">Credit or debit card</label>
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
          />
        </div>
      </div>
      
      {error && <div className="payment-error">{error}</div>}
      
      <button 
        type="submit" 
        disabled={!stripe || loading} 
        className={`payment-button ${loading ? 'loading' : ''}`}
      >
        {loading ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
    </form>
  );
};

const PaymentForm = ({ amount, plan, onPaymentSuccess, onPaymentError }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm 
        amount={amount} 
        plan={plan}
        onPaymentSuccess={onPaymentSuccess} 
        onPaymentError={onPaymentError} 
      />
    </Elements>
  );
};

export default PaymentForm;