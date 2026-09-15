import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="footer footer-v4">
      <div className="container">
        <div className="footer-v4-grid">

          {/* BRAND */}
          <div className="footer-brand">
            <Link className="brand" to="/">
              <span className="brand-mark">
                <img
                  src="/assets/lily-logo.jpg"
                  alt="Lily Cafe & Restaurant"
                />
              </span>

              <span className="brand-copy">
                <span className="brand-name">Lily</span>
                <span className="brand-sub">
                  CAFE &amp; RESTAURANT
                </span>
              </span>
            </Link>

            <p>
              Good food, calm spaces and private moments
              worth remembering.
            </p>

            {/* SOCIAL LINKS */}
            <div className="social-links footer-socials">
              <a
                className="social-link"
                href="https://www.facebook.com/share/19VrffCrUX/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Lily Cafe on Facebook"
              >
                <FaFacebookF />
              </a>

              <a
                className="social-link"
                href="https://www.instagram.com/lilycafeandrestaurant?stkn=MXRpNXNnZWZ3eWY2dA=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Lily Cafe on Instagram"
              >
                <FaInstagram />
              </a>

              <a
                className="social-link"
                href="https://www.tiktok.com/@lilycafeandrestaurant?lang=en-GB&is_from_webapp=1&sender_device=mobile&sender_web_id=7685797483645830657"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Lily Cafe on TikTok"
              >
                <FaTiktok />
              </a>
            </div>
          </div>

          {/* EXPLORE */}
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

          {/* CONTACT */}
          <div className="footer-v4-col">
            <h4>Contact</h4>

            <div className="footer-contact-lines">
              <Link to="/contact">
                Chandragadhi, Jhapa, Nepal
              </Link>

              <a href="tel:+9779816046936">
                +977 981-6046936
              </a>

              <a href="mailto:hello@lilycafeandrestaurant.com.np">
                hello@lilycafeandrestaurant.com.np
              </a>

              <span>
                9:00 AM - 10:00 PM &middot; Open Monday-Sunday
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="footer-bottom">
          <span>
            &copy; 2026 Lily Cafe &amp; Restaurant.
            All rights reserved.
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