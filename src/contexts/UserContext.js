// src/contexts/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export const UserContext = createContext({
  user: null,
  loading: true,
  subscriptionLoading: false,
  updateImageCount: () => {},
  updateTextCount: () => {},
  updateSubscription: () => {},
  resetDailyLimits: () => {}
});

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Setting up auth listener');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser);
      
      try {
        if (firebaseUser) {
          try {
            // Get user document from Firestore
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            
            if (!userDoc.exists()) {
              // Create new user document with default subscription values
              console.log('Creating new user document');
              await setDoc(doc(db, 'users', firebaseUser.uid), {
                email: firebaseUser.email,
                subscriptionTier: 'free',
                dailyTextGenerations: 5,
                dailyImageGenerations: 2,
                lastReset: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                customerDetails: null,
                subscriptionDetails: null
              });
              
              // Get the newly created document
              const newUserDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
              
              if (!newUserDoc.exists()) {
                throw new Error('Failed to create user document');
              }
              
              // Create a simplified user object
              const simplifiedUser = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                ...newUserDoc.data(),
                getIdToken: () => firebaseUser.getIdToken()
              };
              
              setUser(simplifiedUser);
            } else {
              // Create a simplified user object
              const simplifiedUser = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                ...userDoc.data(),
                getIdToken: () => firebaseUser.getIdToken()
              };
              
              // Use existing user document
              console.log('Using existing user document');
              setUser(simplifiedUser);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            // Still set the basic user data to avoid authentication issues
            const simplifiedUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              subscriptionTier: 'free',
              dailyTextGenerations: 5,
              dailyImageGenerations: 0,
              getIdToken: () => firebaseUser.getIdToken()
            };
            
            setUser(simplifiedUser);
            setError(error);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setUser(null);
        setError(error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to update image generation count
  const updateImageCount = async (newCount) => {
    if (!user) return;
    
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        dailyImageGenerations: newCount
      });
      setUser(prev => ({ ...prev, dailyImageGenerations: newCount }));
      return true;
    } catch (error) {
      console.error('Error updating image count:', error);
      setError(error);
      return false;
    }
  };

  // Function to update text generation count
  const updateTextCount = async (newCount) => {
    if (!user) return;
    
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        dailyTextGenerations: newCount
      });
      setUser(prev => ({ ...prev, dailyTextGenerations: newCount }));
      return true;
    } catch (error) {
      console.error('Error updating text count:', error);
      setError(error);
      return false;
    }
  };

  // Function to update subscription tier
  const updateSubscription = async (newTier) => {
    if (!user) return false;
    
    setSubscriptionLoading(true);
    
    try {
      let tierLimits = {
        dailyTextGenerations: 5,
        dailyImageGenerations: 2
      };
      
      // Set tier-specific limits
      if (newTier === 'premium') {
        tierLimits = {
          dailyTextGenerations: 999999, // Unlimited for practical purposes
          dailyImageGenerations: 10
        };
      } else if (newTier === 'pro') {
        tierLimits = {
          dailyTextGenerations: 999999, // Unlimited
          dailyImageGenerations: 999999 // Unlimited
        };
      }
      
      // Update user document with new tier and limits
      await updateDoc(doc(db, 'users', user.uid), {
        subscriptionTier: newTier,
        ...tierLimits,
        updatedAt: new Date().toISOString()
      });
      
      // Update local user state
      setUser(prev => ({ 
        ...prev, 
        subscriptionTier: newTier,
        ...tierLimits 
      }));
      
      return true;
    } catch (error) {
      console.error('Error updating subscription:', error);
      setError(error);
      return false;
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // Function to reset daily limits
  const resetDailyLimits = async () => {
    if (!user) return false;
    
    const subscriptionTier = user.subscriptionTier || 'free';
    const limits = {
      lastReset: new Date().toISOString()
    };
    
    // Set tier-specific limits
    if (subscriptionTier === 'free') {
      limits.dailyTextGenerations = 5;
      limits.dailyImageGenerations = 2;
    } else if (subscriptionTier === 'premium') {
      limits.dailyTextGenerations = 999999; // Unlimited
      limits.dailyImageGenerations = 10;
    } else if (subscriptionTier === 'pro') {
      limits.dailyTextGenerations = 999999; // Unlimited
      limits.dailyImageGenerations = 999999; // Unlimited
    }
    
    try {
      await updateDoc(doc(db, 'users', user.uid), limits);
      setUser(prev => ({ ...prev, ...limits }));
      return true;
    } catch (error) {
      console.error('Error resetting daily limits:', error);
      setError(error);
      return false;
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      error,
      subscriptionLoading,
      updateImageCount,
      updateTextCount,
      updateSubscription,
      resetDailyLimits
    }}>
      {children}
    </UserContext.Provider>
  );
}