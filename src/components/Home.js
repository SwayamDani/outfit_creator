import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <div className="hero-section">
        <h1>Welcome to StyleAI</h1>
        <p>Your personal AI-powered fashion assistant</p>
      </div>
      
      <div className="features-section">
        <h2>What we offer</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>AI Outfit Generation</h3>
            <p>Get personalized outfit recommendations based on your style preferences and occasions.</p>
          </div>
          <div className="feature-card">
            <h3>Mystery Box</h3>
            <p>Discover exciting new styles with our AI-curated mystery box feature.</p>
          </div>
        </div>
      </div>
      
      <div className="about-section">
        <h2>About Us</h2>
        <p>StyleAI combines cutting-edge artificial intelligence with fashion expertise to help you look your best. 
           Our platform learns from your preferences and provides personalized fashion recommendations that match your style.</p>
      </div>
    </div>
  );
} 