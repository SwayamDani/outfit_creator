import React from 'react';

const PaymentForm = ({ amount, onPaymentSuccess, onPaymentError }) => {
  const handlePayment = async (event) => {
    event.preventDefault();

    const options = {
      key: 'YOUR_RAZORPAY_KEY', // Replace with your Razorpay key
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      name: 'Your Company Name',
      description: 'Payment for subscription',
      handler: function (response) {
        // Handle successful payment
        onPaymentSuccess();
        console.log(response);
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#F37254',
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <form onSubmit={handlePayment}>
      <button type="submit">Pay</button>
    </form>
  );
};

export default PaymentForm; 