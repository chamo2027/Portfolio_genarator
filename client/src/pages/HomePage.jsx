import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Code2,
  Share2,
  Palette,
  Eye,
  CheckCircle2,
  Zap,
  Globe2,
  Terminal,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { portfolioAPI } from '../services/api';
import PortfolioCard from '../components/PortfolioCard';

const HomePage = () => {
  const [featuredPortfolios, setFeaturedPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await portfolioAPI.getAllPortfolios({ limit: 6 });
        if (res.success) {
          setFeaturedPortfolios(res.data);
        }
      } catch (err) {
        console.error('Failed to load featured portfolios', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Ambient background decorative elements */}
      <div className="ambient-glow" />
      <div className="ambient-grid" />

      {/* Hero Section */}
      <section style={{ paddingTop: '5rem', paddingBottom: '5rem', textAlign: 'center', position: 'relative' }}>
        <div className="container">

          {/* Heading */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)',
              fontWeight: 900,
              maxWidth: '920px',
              margin: '0 auto 1.5rem',
              letterSpacing: '-1.5px',
              lineHeight: 1.15,
            }}
          >
            Create Your Dream Developer Portfolio in <span className="gradient-text">Minutes</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              maxWidth: '680px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
            }}
          >
            Fill out a simple form, choose a modern visual theme, and instantly publish a responsive,
            shareable portfolio website with a unique public URL.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/create" className="btn btn-primary btn-lg" id="hero-cta-create">
              <Zap size={20} />
              <span>Create Your Portfolio</span>
              <ArrowRight size={18} />
            </Link>

            <Link to="/explore" className="btn btn-secondary btn-lg" id="hero-cta-explore">
              <Globe2 size={20} />
              <span>Explore Portfolios</span>
            </Link>
          </div>

          {/* Key Metric / Feature Badges */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              marginTop: '3.5rem',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} color="#10b981" />
              <span>Unique Shareable URL</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} color="#10b981" />
              <span>5 Modern Themes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} color="#10b981" />
              <span>MongoDB Persistence</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} color="#10b981" />
              <span>Live Edit & Preview</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Mockup Preview Frame */}
      <section style={{ paddingBottom: '6rem' }}>
        <div className="container">
          <div className="device-preview-wrapper desktop">
            <div className="preview-bar">
              <div className="preview-dots">
                <span className="preview-dot red" />
                <span className="preview-dot yellow" />
                <span className="preview-dot green" />
              </div>
              <div className="preview-url-pill">
                <Globe2 size={13} color="var(--primary)" />
                <span>devfolio.live/portfolio/alexchen</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Live Output Preview
              </div>
            </div>

            {/* Mock Header Inside Preview */}
            <div style={{ padding: '3rem 2rem', background: '#090d16', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'inline-block', position: 'relative', marginBottom: '1rem' }}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Avatar"
                  style={{ width: '88px', height: '88px', borderRadius: '50%', border: '3px solid #6366f1' }}
                />
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.25rem' }}>Alex Chen</h2>
              <span style={{ display: 'inline-block', background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', padding: '0.25rem 0.85rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
                Senior Full Stack Engineer
              </span>
              <p style={{ color: '#94a3b8', maxWidth: '540px', margin: '0 auto 1.5rem', fontSize: '0.92rem' }}>
                Passionate software craftsman with 6+ years of experience engineering high-performance distributed systems and web applications.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['React', 'TypeScript', 'Node.js', 'MongoDB', 'Docker', 'GraphQL'].map((skill, i) => (
                  <span key={i} style={{ background: 'rgba(255,255,255,0.05)', color: '#c7d2fe', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '5rem 0', background: 'rgba(17, 24, 39, 0.4)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge badge-cyan" style={{ marginBottom: '0.75rem' }}>
              Simple 3-Step Process
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>How DevFolio Works</h2>
          </div>

          <div className="grid-3">
            <div className="glass-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem', marginBottom: '1.25rem' }}>
                1
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.6rem' }}>Fill in Your Details</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Input your bio, social links, technical skills, featured projects, and career experience in our streamlined form.
              </p>
            </div>

            <div className="glass-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', color: '#67e8f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem', marginBottom: '1.25rem' }}>
                2
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.6rem' }}>Select Theme & Preview</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Choose from 5 curated aesthetic themes (Dark, Glassmorphism, Cyberpunk, Light, Nordic) and test in real-time.
              </p>
            </div>

            <div className="glass-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem', marginBottom: '1.25rem' }}>
                3
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.6rem' }}>Publish & Share</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Save instantly to MongoDB and get your unique shareable public URL (<span style={{ fontFamily: 'var(--font-mono)', color: '#a5b4fc' }}>/portfolio/:username</span>) to send to recruiters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Portfolios Showcase */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
                Community Showcase
              </span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Explore Live Portfolios</h2>
            </div>
            <Link to="/explore" className="btn btn-outline btn-sm">
              <span>View All Portfolios</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              Loading portfolios...
            </div>
          ) : featuredPortfolios.length > 0 ? (
            <div className="grid-3">
              {featuredPortfolios.map((portfolio) => (
                <PortfolioCard key={portfolio._id || portfolio.username} portfolio={portfolio} />
              ))}
            </div>
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>No portfolios generated yet. Be the first one!</p>
              <Link to="/create" className="btn btn-primary">Create Your Portfolio</Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '5rem 0', position: 'relative' }}>
        <div className="container">
          <div
            className="glass-card"
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
              borderColor: 'rgba(99, 102, 241, 0.3)',
            }}
          >
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>
              Ready to Showcase Your Developer Journey?
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.1rem' }}>
              Build your custom developer portfolio in under 2 minutes. Free, open, and permanently shareable.
            </p>
            <Link to="/create" className="btn btn-primary btn-lg" id="bottom-cta-create">
              <Zap size={20} />
              <span>Get Started Now — It's Free</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
