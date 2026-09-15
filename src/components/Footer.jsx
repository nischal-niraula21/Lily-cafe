import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer footer-v4">
      <div className="container">
        <div className="footer-v4-grid">
          <div className="footer-brand">
            <Link className="brand" to="/"><span className="brand-mark"><img src="/assets/lily-logo.jpg" alt="Lily" /></span><span className="brand-copy"><span className="brand-name">Lily</span><span className="brand-sub">CAFE &amp; RESTAURANT</span></span></Link>
            <p>Good food, calm spaces and private moments worth remembering.</p>
          </div>
          <div className="footer-v4-col">
            <h4>Explore</h4>
            <div className="footer-v4-links"><Link to="/">Home</Link><Link to="/menu">Menu</Link><Link to="/cabins">Cabins</Link><Link to="/gallery">Gallery</Link><Link to="/about">About</Link></div>
          </div>
          <div className="footer-v4-col">
            <h4>Contact</h4>
            <div className="footer-contact-lines"><Link to="/contact">Chandragadhi, Jhapa, Nepal</Link><a href="tel:+9779800000000">+977 98XXXXXXXX</a><a href="mailto:hello@lilycafe.com">hello@lilycafe.com</a><span>10:00 AM - 10:00 PM &middot; Open Daily</span></div>
          </div>
        </div>
        <div className="footer-bottom"><span>&copy; 2026 Lily Cafe &amp; Restaurant. All rights reserved.</span></div>
      </div>
    </footer>
  );
}
