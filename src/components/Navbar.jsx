import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

function getNavLinkClass({ isActive }) {
  return isActive ? 'nav-link active' : 'nav-link';
}

function getMobileNavLinkClass({ isActive }) {
  return isActive ? 'mobile-nav-link active' : 'mobile-nav-link';
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMenu() { setMenuOpen(prev => !prev); }
  function closeMenu()  { setMenuOpen(false); }

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="container">
          <div className="navbar-inner">
            <Link to="/" className="navbar-brand" onClick={closeMenu}>
              <span style={{
                fontFamily: "'Fraunces Variable', 'Fraunces', Georgia, serif",
                fontSize: '1.55rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1,
                color: '#fff',
              }}>
                Moncton<span style={{ color: '#16A34A' }}>Taxes</span>
              </span>
            </Link>

            <div className="navbar-nav" role="list">
              <NavLink to="/" className={getNavLinkClass} end role="listitem">
                Home
              </NavLink>
              <NavLink to="/methodology" className={getNavLinkClass} role="listitem">
                Methodology
              </NavLink>
              <NavLink to="/about" className={getNavLinkClass} role="listitem">
                About
              </NavLink>
            </div>

            <button
              className="navbar-hamburger"
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              <span className="hamburger-line" style={menuOpen ? { transform: 'translateY(7px) rotate(45deg)' } : {}} />
              <span className="hamburger-line" style={menuOpen ? { opacity: 0 } : {}} />
              <span className="hamburger-line" style={menuOpen ? { transform: 'translateY(-7px) rotate(-45deg)' } : {}} />
            </button>
          </div>
        </div>

        <div
          id="mobile-menu"
          className={`navbar-mobile-menu${menuOpen ? ' open' : ''}`}
          aria-hidden={!menuOpen}
        >
          <div className="container">
            <NavLink to="/" className={getMobileNavLinkClass} onClick={closeMenu} end>
              Home
            </NavLink>
            <NavLink to="/methodology" className={getMobileNavLinkClass} onClick={closeMenu}>
              Methodology
            </NavLink>
            <NavLink to="/about" className={getMobileNavLinkClass} onClick={closeMenu}>
              About
            </NavLink>
          </div>
        </div>
      </nav>
      <div className="navbar-accent" />
    </>
  );
}
