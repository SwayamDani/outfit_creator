// src/contexts/UserContext.js
import { createContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  useEffect(() => {
    console.log('Setting up auth listener');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser);
      
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (!userDoc.exists()) {
            // Create new user document with default subscription values
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
            setUser({ 
              ...firebaseUser, 
              ...newUserDoc.data(),
              // Add convenience getter for token
              getIdToken: () => firebaseUser.getIdToken()
            });
          } else {
            // Use existing user document
            setUser({ 
              ...firebaseUser, 
              ...userDoc.data(),
              // Add convenience getter for token
              getIdToken: () => firebaseUser.getIdToken()
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
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
    } catch (error) {
      console.error('Error updating image count:', error);
      throw error;
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
    } catch (error) {
      console.error('Error updating text count:', error);
      throw error;
    }
  };

  // Function to update subscription tier
  const updateSubscription = async (newTier) => {
    if (!user) return;
    
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
      throw error;
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // Function to reset daily limits
  const resetDailyLimits = async () => {
    if (!user) return;
    
    const limits = {
      lastReset: new Date().toISOString()
    };
    
    // Set tier-specific limits
    if (user.subscriptionTier === 'free') {
      limits.dailyTextGenerations = 5;
      limits.dailyImageGenerations = 2;
    } else if (user.subscriptionTier === 'premium') {
      limits.dailyTextGenerations = 999999; // Unlimited
      limits.dailyImageGenerations = 10;
    } else if (user.subscriptionTier === 'pro') {
      limits.dailyTextGenerations = 999999; // Unlimited
      limits.dailyImageGenerations = 999999; // Unlimited
    }
    
    try {
      await updateDoc(doc(db, 'users', user.uid), limits);
      setUser(prev => ({ ...prev, ...limits }));
    } catch (error) {
      console.error('Error resetting daily limits:', error);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
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