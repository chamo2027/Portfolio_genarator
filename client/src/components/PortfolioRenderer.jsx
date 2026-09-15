import React, { useState } from 'react';
import {
  Github,
  Linkedin,
  Globe,
  Mail,
  Twitter,
  MapPin,
  ExternalLink,
  Code2,
  Briefcase,
  Layers,
  FileText,
  Eye,
  Share2,
  Check,
  Palette,
  Sun,
  Moon,
} from 'lucide-react';
import '../styles/themes.css';

const PortfolioRenderer = ({
  portfolio,
  isPreview = false,
  customTheme = null,
  onThemeChange = null,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTheme, setActiveTheme] = useState(customTheme || portfolio?.theme || 'modern-dark');

  const themeClass = `theme-${customTheme || activeTheme}`;

  const {
    fullName = 'Developer Name',
    title = 'Full Stack Developer',
    bio = '',
    profileImage = '',
    contact = {},
    skills = [],
    projects = [],
    experience = [],
    views = 0,
    resumeUrl = '',
  } = portfolio || {};

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getInitials = (name) => {
    if (!name) return 'D';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const cycleTheme = () => {
    const themeList = ['modern-dark', 'minimal-light', 'glassmorphism', 'cyberpunk', 'nordic-forest'];
    const currentIndex = themeList.indexOf(activeTheme);
    const nextTheme = themeList[(currentIndex + 1) % themeList.length];
    setActiveTheme(nextTheme);
    if (onThemeChange) {
      onThemeChange(nextTheme);
    }
  };

  return (
    <div className={`portfolio-theme-root ${themeClass}`}>
      {/* Top Utility Bar for Public View */}
      <div
        style={{
          borderBottom: '1px solid var(--pf-border)',
          background: 'var(--pf-surface)',
          padding: '0.6rem 0',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="pf-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--pf-primary)' }}>
              {portfolio?.username ? `@${portfolio.username}` : 'Portfolio Preview'}
            </span>
            {views > 0 && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.78rem',
                  color: 'var(--pf-text-muted)',
                  background: 'var(--pf-surface-2)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}
              >
                <Eye size={12} /> {views} {views === 1 ? 'view' : 'views'}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {/* Live Theme Toggle */}
            <button
              type="button"
              onClick={cycleTheme}
              className="pf-btn pf-btn-outline"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
              title="Switch Theme"
            >
              <Palette size={13} />
              <span>Theme: {activeTheme.replace('-', ' ')}</span>
            </button>

            {/* Share / Copy URL button */}
            {!isPreview && (
              <button
                type="button"
                onClick={handleShare}
                className="pf-btn pf-btn-primary"
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
              >
                {copied ? <Check size={13} /> : <Share2 size={13} />}
                <span>{copied ? 'Link Copied!' : 'Share'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pf-hero">
        <div className="pf-hero-bg" />
        <div className="pf-container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="pf-avatar-wrapper">
            {profileImage ? (
              <img
                src={profileImage}
                alt={fullName}
                className="pf-avatar"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="pf-avatar-placeholder"
              style={{ display: profileImage ? 'none' : 'flex' }}
            >
              {getInitials(fullName)}
            </div>
          </div>

          <h1 className="pf-name">{fullName}</h1>

          {title && (
            <div>
              <span className="pf-title-badge">
                <Code2 size={16} />
                {title}
              </span>
            </div>
          )}

          {contact?.location && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--pf-text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              <MapPin size={15} />
              <span>{contact.location}</span>
            </div>
          )}

          {bio && <p className="pf-bio">{bio}</p>}

          {/* Social Links & Resume */}
          <div className="pf-socials">
            {contact?.email && (
              <a href={`mailto:${contact.email}`} className="pf-social-btn">
                <Mail size={16} />
                <span>Email</span>
              </a>
            )}

            {contact?.github && (
              <a
                href={contact.github.startsWith('http') ? contact.github : `https://${contact.github}`}
                target="_blank"
                rel="noreferrer"
                className="pf-social-btn"
              >
                <Github size={16} />
                <span>GitHub</span>
              </a>
            )}

            {contact?.linkedin && (
              <a
                href={contact.linkedin.startsWith('http') ? contact.linkedin : `https://${contact.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="pf-social-btn"
              >
                <Linkedin size={16} />
                <span>LinkedIn</span>
              </a>
            )}

            {contact?.website && (
              <a
                href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`}
                target="_blank"
                rel="noreferrer"
                className="pf-social-btn"
              >
                <Globe size={16} />
                <span>Website</span>
              </a>
            )}

            {contact?.twitter && (
              <a
                href={contact.twitter.startsWith('http') ? contact.twitter : `https://${contact.twitter}`}
                target="_blank"
                rel="noreferrer"
                className="pf-social-btn"
              >
                <Twitter size={16} />
                <span>Twitter</span>
              </a>
            )}

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="pf-social-btn"
                style={{
                  background: 'var(--pf-primary)',
                  color: '#ffffff',
                  borderColor: 'var(--pf-primary)',
                }}
              >
                <FileText size={16} />
                <span>View Resume</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <section className="pf-section">
          <div className="pf-container">
            <div className="pf-section-header">
              <span className="pf-section-tag">Expertise</span>
              <h2 className="pf-section-title">Skills & Technologies</h2>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', maxWidth: '850px', margin: '0 auto' }}>
              {skills.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    padding: '0.55rem 1.25rem',
                    borderRadius: '9999px',
                    background: 'var(--pf-tag-bg)',
                    color: 'var(--pf-tag-text)',
                    border: '1px solid var(--pf-border)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <section className="pf-section">
          <div className="pf-container">
            <div className="pf-section-header">
              <span className="pf-section-tag">Portfolio</span>
              <h2 className="pf-section-title">Featured Projects</h2>
            </div>

            <div className="grid-3">
              {projects.map((proj, idx) => (
                <div key={idx} className="pf-card pf-project-card">
                  {proj.image && (
                    <img
                      src={proj.image}
                      alt={proj.name}
                      className="pf-project-img"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}

                  <h3 className="pf-project-title">{proj.name}</h3>

                  {proj.description && (
                    <p className="pf-project-desc">{proj.description}</p>
                  )}

                  {proj.techStack && proj.techStack.length > 0 && (
                    <div className="pf-tech-tags">
                      {proj.techStack.map((tech, tIdx) => (
                        <span key={tIdx} className="pf-tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pf-project-links">
                    {proj.liveDemo && (
                      <a
                        href={proj.liveDemo.startsWith('http') ? proj.liveDemo : `https://${proj.liveDemo}`}
                        target="_blank"
                        rel="noreferrer"
                        className="pf-btn pf-btn-primary"
                      >
                        <ExternalLink size={14} />
                        <span>Live Demo</span>
                      </a>
                    )}

                    {proj.githubLink && (
                      <a
                        href={proj.githubLink.startsWith('http') ? proj.githubLink : `https://${proj.githubLink}`}
                        target="_blank"
                        rel="noreferrer"
                        className="pf-btn pf-btn-outline"
                      >
                        <Github size={14} />
                        <span>Code</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <section className="pf-section">
          <div className="pf-container">
            <div className="pf-section-header">
              <span className="pf-section-tag">Career</span>
              <h2 className="pf-section-title">Work Experience</h2>
            </div>

            <div className="pf-timeline">
              {experience.map((exp, idx) => (
                <div key={idx} className="pf-timeline-item">
                  <div className="pf-timeline-dot" />
                  <h3 className="pf-timeline-role">{exp.role}</h3>
                  <div className="pf-timeline-meta">
                    <span className="pf-timeline-company">{exp.company}</span>
                    {exp.duration && (
                      <>
                        <span style={{ color: 'var(--pf-text-muted)' }}>•</span>
                        <span className="pf-timeline-duration">{exp.duration}</span>
                      </>
                    )}
                  </div>
                  {exp.description && (
                    <p className="pf-timeline-desc">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {contact && (contact.email || contact.linkedin || contact.github) && (
        <section className="pf-section">
          <div className="pf-container" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
            <span className="pf-section-tag">Get in Touch</span>
            <h2 className="pf-section-title" style={{ marginBottom: '1rem' }}>
              Let's Work Together
            </h2>
            <p style={{ color: 'var(--pf-text-secondary)', marginBottom: '2rem' }}>
              Have a project in mind or looking for a developer to join your team? Feel free to reach out!
            </p>

            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="pf-btn pf-btn-primary"
                style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}
              >
                <Mail size={18} />
                <span>Send a Message</span>
              </a>
            )}
          </div>
        </section>
      )}

      {/* Footer / Powered By */}
      <div className="pf-container">
        <div className="pf-public-bar">
          <div>
            &copy; {new Date().getFullYear()} {fullName}. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Powered by</span>
            <a
              href="/"
              style={{
                fontWeight: 700,
                color: 'var(--pf-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Code2 size={15} /> DevFolio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioRenderer;
