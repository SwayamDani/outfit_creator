import { createContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth listener');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser);
      
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (!userDoc.exists()) {
            // Create new user document
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              email: firebaseUser.email,
              subscriptionTier: 'free',
              dailyTextGenerations: 5,
              dailyImageGenerations: 0,
              lastReset: new Date().toISOString(),
            });
          }
          setUser({ ...firebaseUser, ...userDoc.data() });
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

  return (
    <UserContext.Provider value={{ user, loading, updateImageCount }}>
      {!loading && children}
    </UserContext.Provider>
  );
} 