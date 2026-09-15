import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ExternalLink, Edit3, ArrowRight, User } from 'lucide-react';

const PortfolioCard = ({ portfolio }) => {
  const {
    username,
    fullName,
    title,
    bio,
    profileImage,
    skills = [],
    projects = [],
    views = 0,
    theme = 'modern-dark',
  } = portfolio;

  const getInitials = (name) => {
    if (!name) return 'D';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="glass-card glass-card-interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {profileImage ? (
            <img
              src={profileImage}
              alt={fullName}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--primary)',
              }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                border: '2px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: '#a5b4fc',
                fontSize: '1rem',
              }}
            >
              {getInitials(fullName)}
            </div>
          )}

          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '2px' }}>{fullName}</h3>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{title || 'Developer'}</div>
          </div>
        </div>

        {views > 0 && (
          <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
            <Eye size={12} /> {views}
          </span>
        )}
      </div>

      {bio && (
        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {bio}
        </p>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
          {skills.slice(0, 4).map((skill, i) => (
            <span
              key={i}
              style={{
                fontSize: '0.75rem',
                padding: '0.15rem 0.5rem',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#94a3b8',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
              +{skills.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <Link
          to={`/portfolio/${username}`}
          className="btn btn-primary btn-sm"
          style={{ flexGrow: 1 }}
        >
          <span>View Site</span>
          <ArrowRight size={14} />
        </Link>

        <Link
          to={`/edit/${username}`}
          className="btn btn-secondary btn-sm"
          title="Edit this portfolio"
        >
          <Edit3 size={14} />
        </Link>
      </div>
    </div>
  );
};

export default PortfolioCard;
