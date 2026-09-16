import { Link } from "react-router-dom";
import Brand from "./Brand";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="footer footer-v4">
      <div className="container">
        <div className="footer-v4-grid">
          <div className="footer-brand">
            <Brand />
            <p>
              Good food, calm spaces and private moments
              worth remembering.
            </p>
            <SocialLinks className="footer-socials" />
          </div>

          <div className="footer-v4-col">
            <h4>Explore</h4>
            <div className="footer-v4-links">
              <Link to="/">Home</Link>
              <Link to="/menu">Menu</Link>
              <Link to="/cabins">Cabins</Link>
              <Link to="/gallery">Gallery</Link>
              <Link to="/about">About</Link>
            </div>
          </div>

          <div className="footer-v4-col">
            <h4>Contact</h4>
            <div className="footer-contact-lines">
              <Link to="/contact">Chandragadhi, Jhapa, Nepal</Link>
              <a href="tel:+9779816046936">+977 981-6046936</a>
              <a href="mailto:hello@lilycafeandrestaurant.com.np">
                hello@lilycafeandrestaurant.com.np
              </a>
              <span>9:00 AM - 10:00 PM &middot; Open Monday-Sunday</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            &copy; 2026 Lily Cafe &amp; Restaurant. All rights reserved.
          </span>
          <span>
            <a
              href="https://nischal-niraula.com.np"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by NISCHAL.
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
