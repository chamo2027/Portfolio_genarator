import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Heart, Sparkles, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      padding: '3rem 0 2rem',
      background: 'rgba(7, 10, 18, 0.95)',
      marginTop: '5rem',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          paddingBottom: '2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div className="logo-badge" style={{ width: '28px', height: '28px' }}>
                <Code2 size={16} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                Dev<span className="gradient-text">Folio</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '360px' }}>
              The modern MERN developer portfolio generator. Turn your skills and projects into a stunning, shareable website.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link to="/" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Home</Link>
            <Link to="/explore" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Explore</Link>
            <Link to="/create" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Create Portfolio</Link>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '1.5rem',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div>
            &copy; {new Date().getFullYear()} DevFolio. Built for developers worldwide.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            Made with <Heart size={14} color="#ec4899" fill="#ec4899" /> using React, Node.js & MongoDB
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
