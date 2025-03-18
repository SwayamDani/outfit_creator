import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

// Import your components
import Navbar from './components/Navbar';
import Home from './components/Home';
import SignIn from './components/SignIn';
import OutfitGenerator from './components/OutfitGenerator';
import MysteryBox from './components/MysteryBox';
import SubscriptionPlans from './components/SubscriptionPlans';

// Provider for user context
import { UserProvider } from './contexts/UserContext';

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    // Loading state with Tailwind classes
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 border-4 border-t-indigo-500 border-gray-200 rounded-full animate-spin"></div>
          </div>
          <div>
            <div className="text-xl font-medium text-gray-900">Loading...</div>
            <p className="text-gray-500">Please wait while we set up your experience.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <UserProvider>
      <Router>
        {<Navbar />}
        <main className="min-h-screen bg-gray-50" style={{paddingTop:"64px"}}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={!user ? <SignIn /> : <Navigate to="/" />} />
            <Route 
              path="/generate" 
              element={user ? <OutfitGenerator /> : <Navigate to="/signin" />} 
            />
            <Route 
              path="/mystery-box" 
              element={user ? <MysteryBox /> : <Navigate to="/signin" />} 
            />
            <Route 
              path="/subscription" 
              element={user ? <SubscriptionPlans /> : <Navigate to="/signin" />} 
            />
          </Routes>
        </main>
      </Router>
    </UserProvider>
  );
}

export default App;