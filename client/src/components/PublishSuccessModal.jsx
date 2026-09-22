import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  Copy,
  ExternalLink,
  Globe,
  Share2,
  Sparkles,
  X,
  Twitter,
  Linkedin,
  ArrowRight,
  Edit3,
} from 'lucide-react';
import { useToast } from './Toast';

const PublishSuccessModal = ({
  isOpen,
  onClose,
  username,
  fullName = '',
}) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !username) return null;

  // Construct dynamic full public URL using configured public domain or active origin
  const baseDomain = import.meta.env.VITE_PUBLIC_APP_URL?.replace(/\/+$/, '') || window.location.origin;
  const portfolioUrl = `${baseDomain}/portfolio/${username}`;
  const pathUrl = `/portfolio/${username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopied(true);
      addToast('Portfolio URL copied to clipboard! 📋', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      // Fallback for browsers with restricted clipboard
      const input = document.getElementById('published-portfolio-url-input');
      if (input) {
        input.select();
        document.execCommand('copy');
        setCopied(true);
        addToast('Portfolio URL copied to clipboard! 📋', 'success');
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  const handleViewPortfolio = () => {
    onClose?.();
    navigate(pathUrl);
  };

  const handleEditPortfolio = () => {
    onClose?.();
    navigate(`/edit/${username}`);
  };

  // Social Share helpers
  const shareText = encodeURIComponent(
    `Check out my developer portfolio built with DevFolio: ${portfolioUrl}`
  );
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${shareText}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioUrl)}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${shareText}`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        backgroundColor: 'rgba(5, 8, 16, 0.85)',
        backdropFilter: 'blur(12px)',
        animation: 'fadeIn 0.25s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '560px',
          background: 'linear-gradient(180deg, rgba(26, 34, 53, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          borderRadius: '24px',
          padding: '2.5rem 2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(99, 102, 241, 0.2)',
          color: '#f8fafc',
          textAlign: 'center',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#94a3b8';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          }}
          title="Close Modal"
        >
          <X size={18} />
        </button>

        {/* Success Icon */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(99, 102, 241, 0.25) 100%)',
            border: '2px solid rgba(16, 185, 129, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.35)',
          }}
        >
          <Sparkles size={34} color="#10b981" />
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem', color: '#ffffff' }}>
          Portfolio Published Live! 🎉
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
          {fullName ? `${fullName}, your` : 'Your'} developer portfolio is live and uniquely accessible to visitors worldwide.
        </p>

        {/* Shareable URL Container Box */}
        <div
          style={{
            background: 'rgba(11, 15, 25, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '1rem',
            marginBottom: '1.5rem',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Globe size={13} color="#6366f1" /> Public Portfolio URL
            </span>
            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#10b981',
                  display: 'inline-block',
                }}
              />
              Live
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '0.5rem 0.75rem',
            }}
          >
            <input
              id="published-portfolio-url-input"
              type="text"
              readOnly
              value={portfolioUrl}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#e2e8f0',
                fontSize: '0.92rem',
                fontWeight: 600,
                width: '100%',
                outline: 'none',
                fontFamily: 'monospace',
              }}
              onClick={(e) => e.target.select()}
            />
          </div>
        </div>

        {/* Primary Action Buttons: Copy URL and View Portfolio */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.15fr',
            gap: '0.85rem',
            marginBottom: '1.75rem',
          }}
        >
          {/* Copy URL Button */}
          <button
            type="button"
            onClick={handleCopy}
            id="modal-copy-url-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.8rem 1.25rem',
              borderRadius: '12px',
              background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.07)',
              border: `1px solid ${copied ? '#10b981' : 'rgba(255, 255, 255, 0.18)'}`,
              color: copied ? '#10b981' : '#ffffff',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            <span>{copied ? 'Copied! ✓' : 'Copy URL'}</span>
          </button>

          {/* View Portfolio Button */}
          <button
            type="button"
            onClick={handleViewPortfolio}
            id="modal-view-portfolio-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.8rem 1.25rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              border: 'none',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)',
              transition: 'all 0.2s ease',
            }}
          >
            <span>View Portfolio</span>
            <ExternalLink size={18} />
          </button>
        </div>

        {/* Quick Social Share Section */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.25rem' }}>
          <span style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '0.75rem' }}>
            Share your portfolio with your network:
          </span>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            {/* Twitter */}
            <a
              href={twitterShareUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                color: '#38bdf8',
                padding: '0.45rem 0.9rem',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              <Twitter size={14} /> Twitter / X
            </a>

            {/* LinkedIn */}
            <a
              href={linkedinShareUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(2, 132, 199, 0.12)',
                border: '1px solid rgba(2, 132, 199, 0.25)',
                color: '#38bdf8',
                padding: '0.45rem 0.9rem',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              <Linkedin size={14} /> LinkedIn
            </a>

            {/* WhatsApp */}
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: '#10b981',
                padding: '0.45rem 0.9rem',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              <Share2 size={14} /> WhatsApp
            </a>
          </div>
        </div>

        {/* Secondary Edit Action */}
        <div style={{ marginTop: '1.25rem' }}>
          <button
            type="button"
            onClick={handleEditPortfolio}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              fontSize: '0.84rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
              padding: '4px 8px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#94a3b8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
          >
            <Edit3 size={13} /> Need to make changes? Edit Portfolio
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishSuccessModal;
