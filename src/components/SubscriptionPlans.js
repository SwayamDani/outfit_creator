import React, { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Card, CardHeader, CardTitle, CardContent, CardFooter, Badge, Spinner, Alert, Container } from './ui-components';
import { Check, Star, Zap, CreditCard } from 'lucide-react';

// Load Stripe outside of component render
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Payment form component
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

    try {
      const response = await fetch('https://outfit-creator-6mmz.onrender.com/create-payment-intent', {
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
      onError(error.message || "Payment processing failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="card-element" className="text-sm font-medium text-gray-700">
          Card details
        </label>
        <div className="rounded-md border border-gray-300 p-4 bg-white shadow-sm">
          <CardElement 
            id="card-element"
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
      </div>
      
      {cardError && (
        <Alert 
          variant="destructive" 
          title="Payment Error" 
          description={cardError} 
        />
      )}
      
      <Button
        type="submit"
        disabled={loading || !stripe}
        fullWidth
        size="lg"
        variant={planDetails.recommended ? "upgrade" : "default"}
      >
        {loading ? (
          <span className="flex items-center">
            <Spinner className="mr-2" />
            Processing...
          </span>
        ) : (
          <span className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Pay ${(planDetails.price / 100).toFixed(2)}
          </span>
        )}
      </Button>

      <p className="text-xs text-center text-gray-500 mt-4">
        Your subscription will begin immediately after payment is processed.
        You can cancel anytime from your account settings.
      </p>
    </form>
  );
};

// Main Subscription Plans Component
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
      icon: <Zap />,
      description: 'Basic access to AI fashion tools',
      price: 0,
      features: [
        '5 outfit text generations per day',
        '2 image generations per day',
        'Basic outfit recommendations',
        'Email support'
      ],
      limitations: [
        'Limited daily generations',
        'No premium outfit styles',
        'Standard response times'
      ],
      isCurrent: user?.subscriptionTier === 'free',
      ctaText: 'Current Plan'
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      icon: <Star />,
      description: 'Perfect for fashion enthusiasts',
      price: 999, // $9.99
      features: [
        'Unlimited text generations',
        '10 image generations per day',
        'Advanced outfit recommendations',
        'Priority email support',
        'Custom color preferences'
      ],
      isCurrent: user?.subscriptionTier === 'premium',
      recommended: true,
      ctaText: 'Upgrade to Premium'
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      icon: <Zap />,
      description: 'Ultimate AI fashion experience',
      price: 1999, // $19.99
      features: [
        'Unlimited text & image generations',
        'Custom outfit criteria',
        'Seasonal trend analysis',
        'AI wardrobe analysis',
        '24/7 Priority support',
        'Early access to new features'
      ],
      isCurrent: user?.subscriptionTier === 'pro',
      ctaText: 'Upgrade to Pro'
    }
  ];

  const handleSelectPlan = (plan) => {
    if (plan.isCurrent) return;
    if (plan.id === 'free') {
      // Handle downgrade to free tier
      setLoading(true);
      setTimeout(() => {
        updateSubscription('free');
        setNotification({
          type: 'success',
          message: 'Changed to Free plan. Changes will take effect at the end of your billing cycle.'
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
    <Container className="py-12">
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4">
            <Spinner className="h-8 w-8 text-primary-600" />
            <p className="text-gray-700 font-medium">Processing your request...</p>
          </div>
        </div>
      )}
      
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-md animate-in slide-in-from-top-2">
          <Alert 
            variant={notification.type === 'success' ? 'success' : 'destructive'} 
            title={notification.type === 'success' ? 'Success' : 'Error'} 
            description={notification.message} 
            className="flex justify-between items-start"
          >
            <button 
              onClick={() => setNotification(null)}
              className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-md text-gray-500 transition-colors hover:text-gray-900"
            >
              ×
            </button>
          </Alert>
        </div>
      )}
      
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
          Choose Your Fashion Journey
        </h1>
        <p className="text-xl text-gray-500">
          Unlock the full potential of AI-powered fashion with our premium plans
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map(plan => (
          <Card 
            key={plan.id} 
            className={`relative border-2 transition-all ${
              plan.isCurrent 
                ? 'border-blue-500 ring-4 ring-blue-100' 
                : plan.recommended 
                  ? 'border-purple-500 ring-4 ring-purple-100 md:scale-105 shadow-xl' 
                  : 'border-transparent hover:border-gray-300'
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-4 inset-x-0 flex justify-center">
                <Badge variant="premium" className="shadow-md">
                  MOST POPULAR
                </Badge>
              </div>
            )}
            
            {plan.isCurrent && (
              <div className="absolute -top-4 inset-x-0 flex justify-center">
                <Badge variant="current" className="shadow-md">
                  CURRENT PLAN
                </Badge>
              </div>
            )}
            
            <CardHeader className={`pb-6 ${plan.recommended ? 'bg-gradient-to-br from-purple-50 to-indigo-50' : ''}`}>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    <span className={`inline-block p-2 mr-2 rounded-full ${
                      plan.recommended ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {plan.icon}
                    </span>
                    {plan.name}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    {plan.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="mb-6">
                <p className={`text-3xl font-bold ${plan.recommended ? 'text-purple-600' : 'text-gray-900'}`}>
                  ${(plan.price / 100).toFixed(2)}
                  <span className="text-base font-normal text-gray-500">
                    {plan.price > 0 ? '/month' : ''}
                  </span>
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">What's included:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.limitations && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Limitations:</h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-500">
                          <div className="h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">
                            ·
                          </div>
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="pt-6">
              <Button
                variant={plan.recommended ? "upgrade" : plan.isCurrent ? "outline" : "default"}
                fullWidth
                disabled={plan.isCurrent || loading}
                onClick={() => handleSelectPlan(plan)}
              >
                {plan.isCurrent ? "Current Plan" : plan.ctaText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-1">Subscribe to {selectedPlan.name}</h2>
              <p>Enter your payment details to continue</p>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 pb-6 border-b">
                <div>
                  <h3 className="font-medium text-gray-900">Plan Details</h3>
                  <p className="text-gray-500 text-sm">Billed monthly</p>
                </div>
                <p className="text-2xl font-bold">${(selectedPlan.price / 100).toFixed(2)}</p>
              </div>
              
              <Elements stripe={stripePromise}>
                <CheckoutForm 
                  planDetails={selectedPlan}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <Button
                variant="ghost"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-3xl mx-auto mt-16 text-center">
        <h3 className="text-xl font-semibold mb-4">100% Satisfaction Guarantee</h3>
        <p className="text-gray-600">
          Try any paid plan risk-free for 14 days. If you're not completely satisfied, 
          let us know and we'll refund your payment. No questions asked.
        </p>
      </div>
    </Container>
  );
};

export default SubscriptionPlans;