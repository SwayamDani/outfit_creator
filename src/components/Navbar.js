import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './Navbar.css';

export default function Navbar() {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">StyleAI</Link>
      </div>
      <div className="nav-links">
        <Link to="/generate" className="nav-link">Generate Outfit</Link>
        <Link to="/mystery-box" className="nav-link">Mystery Box</Link>
        <button onClick={handleSignOut} className="sign-out-btn">Sign Out</button>
      </div>
    </nav>
  );
} 