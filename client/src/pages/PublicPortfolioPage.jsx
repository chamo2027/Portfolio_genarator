import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, AlertCircle, ArrowLeft, Home, Edit3 } from 'lucide-react';
import { portfolioAPI } from '../services/api';
import PortfolioRenderer from '../components/PortfolioRenderer';

const PublicPortfolioPage = () => {
  const { username } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await portfolioAPI.getPortfolioByUsername(username, true);
        if (res.success) {
          setPortfolio(res.data);
        } else {
          setError(res.message || 'Portfolio not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || `No portfolio found for username "${username}".`);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchPortfolio();
    }
  }, [username]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          color: 'var(--text-secondary)',
        }}
      >
        <Loader2 size={36} className="animate-spin" color="var(--primary)" />
        <p style={{ fontSize: '1.1rem' }}>Loading @{username}'s portfolio...</p>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="container" style={{ paddingTop: '6rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '540px', margin: '0 auto', padding: '3.5rem 2rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <AlertCircle size={32} />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>Portfolio Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
            {error || `The user @${username} has not created a portfolio yet.`}
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/" className="btn btn-secondary">
              <Home size={16} />
              <span>Back to Home</span>
            </Link>
            <Link to="/create" className="btn btn-primary">
              <span>Claim @{username} Now</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Floating Edit Button for owner */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 90,
        }}
      >
        <Link
          to={`/edit/${username}`}
          className="btn btn-secondary btn-sm"
          style={{
            boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
            background: 'rgba(17, 24, 39, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
          title="Edit this portfolio"
        >
          <Edit3 size={15} color="var(--primary)" />
          <span>Edit Portfolio</span>
        </Link>
      </div>

      <PortfolioRenderer portfolio={portfolio} />
    </div>
  );
};

export default PublicPortfolioPage;
