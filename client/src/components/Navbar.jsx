import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, Compass, PlusCircle, Sparkles } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Don't show header inside standalone public portfolio page if it's on /portfolio/:username
  const isPublicPortfolio = location.pathname.startsWith('/portfolio/') && !location.pathname.includes('/preview');

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <Link to="/" className="logo-link" id="nav-logo">
            <div className="logo-badge">
              <Code2 size={22} />
            </div>
            <span>
              Dev<span className="gradient-text">Folio</span>
            </span>
          </Link>

          <nav>
            <ul className="nav-links">
              <li>
                <Link
                  to="/"
                  className={`nav-link ${isActive('/') ? 'active' : ''}`}
                  id="nav-home"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/explore"
                  className={`nav-link ${isActive('/explore') ? 'active' : ''}`}
                  id="nav-explore"
                >
                  <Compass size={16} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} />
                  Explore
                </Link>
              </li>
              <li>
                <Link
                  to="/create"
                  className="btn btn-primary btn-sm"
                  id="nav-create"
                >
                  <PlusCircle size={16} />
                  <span>Create Portfolio</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
