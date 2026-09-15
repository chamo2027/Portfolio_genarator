import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="container" style={{ paddingTop: '7rem', paddingBottom: '7rem', textAlign: 'center' }}>
      <div className="glass-card" style={{ maxWidth: '520px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <AlertTriangle size={36} />
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-1px' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={16} />
            <span>Go to Home</span>
          </Link>
          <Link to="/explore" className="btn btn-secondary">
            <Compass size={16} />
            <span>Explore Portfolios</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
