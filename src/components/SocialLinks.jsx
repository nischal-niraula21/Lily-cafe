import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa6';
import { SITE } from '../config/site';

const icons = {
  Facebook: FaFacebookF,
  Instagram: FaInstagram,
  TikTok: FaTiktok,
};

export default function SocialLinks({ className = '' }) {
  return (
    <div className={`social-links ${className}`.trim()}>
      {SITE.socials.map((social) => {
        const Icon = icons[social.name];
        return (
          <a
            key={social.name}
            className="social-link"
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Lily Cafe on ${social.name}`}
          >
            <Icon />
          </a>
        );
      })}
    </div>
  );
}
