import { Link } from 'react-router-dom';
import { SITE } from '../config/site';

export default function Brand({ className = '' }) {
  return (
    <Link className={`brand ${className}`.trim()} to="/">
      <span className="brand-mark">
        <img src={SITE.logo} alt={SITE.fullName} />
      </span>
      <span className="brand-copy">
        <span className="brand-name">{SITE.name}</span>
        <span className="brand-sub">CAFE &amp; RESTAURANT</span>
      </span>
    </Link>
  );
}
