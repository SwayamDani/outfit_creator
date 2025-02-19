import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Navbar from './components/Navbar';
import Home from './components/Home';
import SignIn from './components/SignIn';
import OutfitGenerator from './components/OutfitGenerator';
import MysteryBox from './components/MysteryBox';
import SubscriptionPlans from './components/SubscriptionPlans';
import { UserProvider } from './contexts/UserContext';
import './App.css';

function App() {
  const [user] = useAuthState(auth);

  if (!user) {
    return <SignIn />;
  }

  return (
    <UserProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/generate" element={<OutfitGenerator />} />
              <Route path="/mystery-box" element={<MysteryBox />} />
              <Route path="/subscription" element={<SubscriptionPlans />} />
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
