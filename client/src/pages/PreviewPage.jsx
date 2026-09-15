import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Monitor,
  Tablet,
  Smartphone,
  Send,
  ArrowLeft,
  Sparkles,
  Loader2,
  Palette,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { portfolioAPI } from '../services/api';
import { useToast } from '../components/Toast';
import PortfolioRenderer from '../components/PortfolioRenderer';

const PreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [deviceView, setDeviceView] = useState('desktop'); // desktop, tablet, mobile
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Read data from route state or sessionStorage draft
  const [draftData, setDraftData] = useState(() => {
    if (location.state?.draftData) {
      return location.state.draftData;
    }
    const saved = sessionStorage.getItem('devfolio_draft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [selectedTheme, setSelectedTheme] = useState(draftData?.theme || 'modern-dark');

  useEffect(() => {
    if (draftData?.theme) {
      setSelectedTheme(draftData.theme);
    }
  }, [draftData]);

  if (!draftData) {
    return (
      <div className="container" style={{ paddingTop: '5rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>No Draft Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            You haven't filled in any portfolio details yet. Let's create one first!
          </p>
          <Link to="/create" className="btn btn-primary">
            Start Creating Portfolio
          </Link>
        </div>
      </div>
    );
  }

  const handlePublish = async () => {
    if (!draftData.username) {
      addToast('Please provide a unique username before publishing', 'error');
      navigate('/create');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { ...draftData, theme: selectedTheme };
      const res = await portfolioAPI.createPortfolio(payload);
      if (res.success) {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
        });
        addToast('Portfolio published live! 🚀', 'success');
        sessionStorage.removeItem('devfolio_draft');
        setTimeout(() => {
          navigate(`/portfolio/${res.data.username}`);
        }, 1200);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to publish portfolio';
      addToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* Top Preview Control Bar */}
      <div
        style={{
          position: 'sticky',
          top: '72px',
          zIndex: 80,
          background: 'rgba(11, 15, 25, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-color)',
          padding: '0.75rem 0',
          marginBottom: '2rem',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            {/* Back to Edit */}
            <Link to="/create" className="btn btn-outline btn-sm">
              <ArrowLeft size={16} />
              <span>Back to Form</span>
            </Link>

            {/* Device View Selectors */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-md)',
                padding: '3px',
                border: '1px solid var(--border-color)',
              }}
            >
              <button
                type="button"
                className={`btn btn-sm ${deviceView === 'desktop' ? 'btn-primary' : 'btn-outline'}`}
                style={{ border: 'none', padding: '0.4rem 0.8rem' }}
                onClick={() => setDeviceView('desktop')}
                title="Desktop View"
              >
                <Monitor size={15} />
                <span style={{ fontSize: '0.82rem' }}>Desktop</span>
              </button>

              <button
                type="button"
                className={`btn btn-sm ${deviceView === 'tablet' ? 'btn-primary' : 'btn-outline'}`}
                style={{ border: 'none', padding: '0.4rem 0.8rem' }}
                onClick={() => setDeviceView('tablet')}
                title="Tablet View"
              >
                <Tablet size={15} />
                <span style={{ fontSize: '0.82rem' }}>Tablet</span>
              </button>

              <button
                type="button"
                className={`btn btn-sm ${deviceView === 'mobile' ? 'btn-primary' : 'btn-outline'}`}
                style={{ border: 'none', padding: '0.4rem 0.8rem' }}
                onClick={() => setDeviceView('mobile')}
                title="Mobile View"
              >
                <Smartphone size={15} />
                <span style={{ fontSize: '0.82rem' }}>Mobile</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handlePublish}
                disabled={isSubmitting}
                id="preview-publish-btn"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                <span>{isSubmitting ? 'Publishing...' : 'Publish Portfolio'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Frame Container */}
      <div className="container">
        <div className={`device-preview-wrapper ${deviceView}`}>
          <div className="preview-bar">
            <div className="preview-dots">
              <span className="preview-dot red" />
              <span className="preview-dot yellow" />
              <span className="preview-dot green" />
            </div>
            <div className="preview-url-pill">
              <span>devfolio.live/portfolio/{draftData.username || 'your-username'}</span>
            </div>
            <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
              Live Preview
            </span>
          </div>

          <PortfolioRenderer
            portfolio={draftData}
            isPreview={true}
            customTheme={selectedTheme}
            onThemeChange={(t) => setSelectedTheme(t)}
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
