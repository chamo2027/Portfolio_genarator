import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Compass, Filter, Sparkles, Loader2, PlusCircle, X } from 'lucide-react';
import { portfolioAPI } from '../services/api';
import PortfolioCard from '../components/PortfolioCard';

const POPULAR_FILTERS = ['React', 'Node.js', 'TypeScript', 'Python', 'Full Stack', 'AI', 'UI/UX'];

const ExplorePage = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [total, setTotal] = useState(0);

  const fetchPortfolios = async (search = '', skill = '') => {
    setLoading(true);
    try {
      const res = await portfolioAPI.getAllPortfolios({
        search: search || undefined,
        skill: skill || undefined,
        limit: 30,
      });
      if (res.success) {
        setPortfolios(res.data);
        setTotal(res.total || res.data.length);
      }
    } catch (err) {
      console.error('Failed to load portfolios', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPortfolios(searchTerm, selectedSkill);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedSkill]);

  const handleFilterClick = (skill) => {
    if (selectedSkill === skill) {
      setSelectedSkill('');
    } else {
      setSelectedSkill(skill);
    }
  };

  return (
    <div style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '0.75rem' }}>
            <Compass size={14} /> Developer Directory
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Discover Inspiring Portfolios
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Browse live developer portfolios created on DevFolio. Filter by skill, search by name, and explore tech stacks.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flexGrow: 1, minWidth: '260px' }}>
              <Search
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, title, bio, or username..."
                style={{ paddingLeft: '2.75rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                id="explore-search-input"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <Link to="/create" className="btn btn-primary btn-sm" id="explore-create-btn">
              <PlusCircle size={16} />
              <span>Create Your Portfolio</span>
            </Link>
          </div>

          {/* Quick Filter Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={13} /> Filter:
            </span>
            {POPULAR_FILTERS.map((skill) => {
              const isActive = selectedSkill === skill;
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleFilterClick(skill)}
                  style={{
                    background: isActive ? 'var(--primary)' : 'rgba(255, 255, 255, 0.04)',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    border: `1px solid ${isActive ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: '9999px',
                    padding: '0.3rem 0.8rem',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {skill}
                </button>
              );
            })}
            {selectedSkill && (
              <button
                type="button"
                onClick={() => setSelectedSkill('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f87171',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  marginLeft: '0.5rem',
                }}
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        {/* Portfolio Results Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
            <Loader2 size={36} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
            <p>Discovering developer portfolios...</p>
          </div>
        ) : portfolios.length > 0 ? (
          <div>
            <div style={{ marginBottom: '1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Showing {portfolios.length} {portfolios.length === 1 ? 'portfolio' : 'portfolios'}
            </div>
            <div className="grid-3">
              {portfolios.map((portfolio) => (
                <PortfolioCard key={portfolio._id || portfolio.username} portfolio={portfolio} />
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Sparkles size={40} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Portfolios Found</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
              We couldn't find any portfolios matching your query. Try different keywords or create a new one!
            </p>
            <Link to="/create" className="btn btn-primary">
              Create a Portfolio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
