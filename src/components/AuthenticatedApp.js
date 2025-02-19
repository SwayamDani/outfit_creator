import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import SignIn from './SignIn';

function AuthenticatedApp() {
  const { user, loading } = useContext(UserContext);

  console.log('Auth State:', { user, loading }); // Add this for debugging

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <SignIn />;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-8">AI Fashion Designer</h1>
      {/* Your existing outfit generation UI components */}
      {user.subscriptionTier === 'free' && user.dailyTextGenerations === 0 && (
        <SubscriptionPlans user={user} />
      )}
      {/* Add your existing image upload and outfit generation components here */}
    </div>
  );
}

export default AuthenticatedApp; 