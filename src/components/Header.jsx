import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Brand from './Brand';

const navItems = [
  ['/', 'Home'], ['/menu', 'Menu'], ['/cabins', 'Cabins'], ['/gallery', 'Gallery'], ['/about', 'About'], ['/contact', 'Contact']
];

export default function Header({ forceDark = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className={`site-header ${forceDark ? 'force-dark' : ''} ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-shell">
        <Brand />
        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {navItems.map(([to,label]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({isActive}) => isActive ? 'active' : ''}>{label}</NavLink>
          ))}
        </nav>
        <div className="nav-end">
          <Link className="btn btn-gold" to="/cabins">Book Cabin</Link>
          <button className="menu-toggle" type="button" aria-label="Menu" onClick={() => setOpen(v => !v)}>☰</button>
        </div>
      </div>
    </header>
  );
}
