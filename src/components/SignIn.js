import { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup} from 'firebase/auth';
import './SignIn.css';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setError(error.message.replace('Firebase:', '').trim());
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        console.log("Successfully signed in with Google");
      }

    } catch (error) {
      setError(error.message.replace('Firebase:', '').trim());
      // Handle specific error codes if needed
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled');
      }
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="signin-header">
          <h2>{isSignUp ? 'Join Us' : 'Welcome Back'}</h2>
          <p>{isSignUp ? 'Start your journey with us' : 'We are glad to see you again'}</p>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="submit-button">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button onClick={handleGoogleSignIn} className="google-button">
          <img src="/google-icon.svg" alt="Google" className="google-icon" />
          Sign in with Google
        </button>

        <button 
          onClick={() => setIsSignUp(!isSignUp)} 
          className="toggle-button"
        >
          {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Create one'}
        </button>
      </div>
    </div>
  );
} 