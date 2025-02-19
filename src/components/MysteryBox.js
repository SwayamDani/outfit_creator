import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import './MysteryBox.css';
import SignIn from './SignIn';

export default function MysteryBox() {
  const [user] = useAuthState(auth);

  if (!user) {
    return <SignIn />;
  }
  return (
    <div className="mystery-box">
      <h1>Mystery Box</h1>
      <p>This feature is coming soon!</p>
    </div>
  );
} 