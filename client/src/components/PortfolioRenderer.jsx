import React, { useState } from 'react';
import {
  Github,
  Linkedin,
  Globe,
  Mail,
  Phone,
  Twitter,
  MapPin,
  ExternalLink,
  Code2,
  Briefcase,
  GraduationCap,
  Layers,
  FileText,
  Eye,
  Share2,
  Check,
  Send,
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
  const [messageForm, setMessageForm] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });
  const [messageSent, setMessageSent] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

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
    education = [],
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

  const getCleanHandle = (url, fallback) => {
    if (!url) return fallback || '';
    if (!url.startsWith('http')) return url;
    try {
      const parts = url.replace(/\/+$/, '').split('/');
      return parts[parts.length - 1] || url;
    } catch {
      return url;
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageForm.name || !messageForm.email || !messageForm.message) return;
    setSendingMessage(true);
    setTimeout(() => {
      setSendingMessage(false);
      setMessageSent(true);
      if (contact?.email) {
        const mailtoSub = encodeURIComponent(messageForm.subject || `Portfolio Inquiry from ${messageForm.name}`);
        const mailtoBody = encodeURIComponent(
          `Hi ${fullName},\n\n${messageForm.message}\n\n---\nFrom: ${messageForm.name} (${messageForm.email})${messageForm.company ? `\nCompany: ${messageForm.company}` : ''}`
        );
        window.open(`mailto:${contact.email}?subject=${mailtoSub}&body=${mailtoBody}`, '_blank');
      }
    }, 500);
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

      {/* Education Section */}
      {education && education.length > 0 && (
        <section className="pf-section">
          <div className="pf-container">
            <div className="pf-section-header">
              <span className="pf-section-tag">Education</span>
              <h2 className="pf-section-title">Academic Background</h2>
            </div>

            <div className="pf-timeline">
              {education.map((edu, idx) => (
                <div key={idx} className="pf-timeline-item">
                  <div
                    className="pf-timeline-dot"
                    style={{
                      borderColor: 'var(--pf-bg)',
                      background: 'var(--pf-secondary)',
                      boxShadow: '0 0 10px var(--pf-secondary)',
                    }}
                  />
                  <h3 className="pf-timeline-role">
                    {edu.degree ? edu.degree : 'Degree / Certificate'}
                    {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                  </h3>
                  <div className="pf-timeline-meta">
                    <span className="pf-timeline-company" style={{ color: 'var(--pf-secondary)' }}>
                      {edu.institution}
                    </span>
                    {edu.duration && (
                      <>
                        <span style={{ color: 'var(--pf-text-muted)' }}>•</span>
                        <span className="pf-timeline-duration">{edu.duration}</span>
                      </>
                    )}
                  </div>
                  {edu.description && (
                    <p className="pf-timeline-desc">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Modern 2-Column Contact Section */}
      {Boolean(contact?.email || contact?.phone || contact?.linkedin || contact?.github || contact?.website || contact?.twitter || contact?.location) && (
        <section className="pf-section" id="contact-section">
          <div className="pf-container">
            <div className="pf-section-header" style={{ marginBottom: '1.5rem' }}>
              <span className="pf-section-tag">Get in Touch</span>
              <h2 className="pf-section-title">Let's Connect</h2>
            </div>

            <div className="pf-contact-grid">
              {/* Left Column: Contact Information Cards */}
              <div className="pf-contact-info-col">
                <h3 className="pf-contact-main-title">Contact Information</h3>
                <p className="pf-contact-main-desc">
                  I'm open to discussing new projects, creative ideas, or opportunities to be part of your vision. Feel free to reach out through any of the following channels:
                </p>

                <div className="pf-contact-cards-grid">
                  {/* Phone */}
                  {contact?.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="pf-contact-card-item"
                      title="Call Phone Number"
                    >
                      <div className="pf-contact-icon-bubble" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.15)' }}>
                        <Phone size={20} />
                      </div>
                      <div className="pf-contact-text-wrap">
                        <span className="pf-contact-text-label">Phone</span>
                        <span className="pf-contact-text-val">{contact.phone}</span>
                      </div>
                    </a>
                  )}

                  {/* Location */}
                  {contact?.location && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.location)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="pf-contact-card-item"
                      title="View Location on Google Maps"
                    >
                      <div className="pf-contact-icon-bubble" style={{ color: '#f43f5e', background: 'rgba(244, 63, 94, 0.15)' }}>
                        <MapPin size={20} />
                      </div>
                      <div className="pf-contact-text-wrap">
                        <span className="pf-contact-text-label">Location</span>
                        <span className="pf-contact-text-val">{contact.location}</span>
                      </div>
                    </a>
                  )}

                  {/* GitHub */}
                  {contact?.github && (
                    <a
                      href={contact.github.startsWith('http') ? contact.github : `https://${contact.github}`}
                      target="_blank"
                      rel="noreferrer"
                      className="pf-contact-card-item"
                      title="Visit GitHub Profile"
                    >
                      <div className="pf-contact-icon-bubble" style={{ color: '#e2e8f0', background: 'rgba(255, 255, 255, 0.1)' }}>
                        <Github size={20} />
                      </div>
                      <div className="pf-contact-text-wrap">
                        <span className="pf-contact-text-label">GitHub</span>
                        <span className="pf-contact-text-val">{getCleanHandle(contact.github, 'GitHub')}</span>
                      </div>
                    </a>
                  )}

                  {/* LinkedIn */}
                  {contact?.linkedin && (
                    <a
                      href={contact.linkedin.startsWith('http') ? contact.linkedin : `https://${contact.linkedin}`}
                      target="_blank"
                      rel="noreferrer"
                      className="pf-contact-card-item"
                      title="Connect on LinkedIn"
                    >
                      <div className="pf-contact-icon-bubble" style={{ color: '#0284c7', background: 'rgba(2, 132, 199, 0.15)' }}>
                        <Linkedin size={20} />
                      </div>
                      <div className="pf-contact-text-wrap">
                        <span className="pf-contact-text-label">LinkedIn</span>
                        <span className="pf-contact-text-val">{getCleanHandle(contact.linkedin, 'LinkedIn')}</span>
                      </div>
                    </a>
                  )}

                  {/* Email */}
                  {contact?.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="pf-contact-card-item full-width"
                      title="Send Direct Email"
                    >
                      <div className="pf-contact-icon-bubble" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)' }}>
                        <Mail size={20} />
                      </div>
                      <div className="pf-contact-text-wrap">
                        <span className="pf-contact-text-label">Email</span>
                        <span className="pf-contact-text-val">{contact.email}</span>
                      </div>
                    </a>
                  )}

                  {/* Website */}
                  {contact?.website && (
                    <a
                      href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="pf-contact-card-item"
                      title="Visit Personal Website"
                    >
                      <div className="pf-contact-icon-bubble" style={{ color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.15)' }}>
                        <Globe size={20} />
                      </div>
                      <div className="pf-contact-text-wrap">
                        <span className="pf-contact-text-label">Website</span>
                        <span className="pf-contact-text-val">{contact.website.replace(/^https?:\/\//, '')}</span>
                      </div>
                    </a>
                  )}

                  {/* Twitter */}
                  {contact?.twitter && (
                    <a
                      href={contact.twitter.startsWith('http') ? contact.twitter : `https://${contact.twitter}`}
                      target="_blank"
                      rel="noreferrer"
                      className="pf-contact-card-item"
                      title="Follow on Twitter / X"
                    >
                      <div className="pf-contact-icon-bubble" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)' }}>
                        <Twitter size={20} />
                      </div>
                      <div className="pf-contact-text-wrap">
                        <span className="pf-contact-text-label">Twitter / X</span>
                        <span className="pf-contact-text-val">{getCleanHandle(contact.twitter, '@Twitter')}</span>
                      </div>
                    </a>
                  )}
                </div>
              </div>

              {/* Right Column: Send Me a Message Form */}
              <div className="pf-contact-form-col">
                <div className="pf-message-box-card">
                  <div className="pf-message-header-row">
                    <div className="pf-message-header-icon">
                      <Mail size={22} />
                    </div>
                    <h3 className="pf-message-header-title">Send Me a Message</h3>
                  </div>

                  {messageSent ? (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '2.5rem 1rem',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '14px',
                      }}
                    >
                      <Check size={40} color="#10b981" style={{ margin: '0 auto 0.8rem' }} />
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--pf-text)', marginBottom: '0.4rem' }}>
                        Message Sent! 🎉
                      </h4>
                      <p style={{ color: 'var(--pf-text-secondary)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                        Thank you for reaching out! {fullName} will get back to you soon.
                      </p>
                      <button
                        type="button"
                        className="pf-btn pf-btn-outline"
                        onClick={() => {
                          setMessageSent(false);
                          setMessageForm({ name: '', email: '', company: '', subject: '', message: '' });
                        }}
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSendMessage}>
                      <div className="pf-form-double-row">
                        <div className="pf-form-field" style={{ marginBottom: 0 }}>
                          <label className="pf-form-label-txt">
                            Name <span className="req-dot">*</span>
                          </label>
                          <input
                            type="text"
                            className="pf-input-control"
                            placeholder="Your name"
                            required
                            value={messageForm.name}
                            onChange={(e) => setMessageForm((prev) => ({ ...prev, name: e.target.value }))}
                          />
                        </div>

                        <div className="pf-form-field" style={{ marginBottom: 0 }}>
                          <label className="pf-form-label-txt">
                            Email <span className="req-dot">*</span>
                          </label>
                          <input
                            type="email"
                            className="pf-input-control"
                            placeholder="your.email@example.com"
                            required
                            value={messageForm.email}
                            onChange={(e) => setMessageForm((prev) => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="pf-form-double-row">
                        <div className="pf-form-field" style={{ marginBottom: 0 }}>
                          <label className="pf-form-label-txt">Company Name (Optional)</label>
                          <input
                            type="text"
                            className="pf-input-control"
                            placeholder="Your company (optional)"
                            value={messageForm.company}
                            onChange={(e) => setMessageForm((prev) => ({ ...prev, company: e.target.value }))}
                          />
                        </div>

                        <div className="pf-form-field" style={{ marginBottom: 0 }}>
                          <label className="pf-form-label-txt">Subject (Optional)</label>
                          <input
                            type="text"
                            className="pf-input-control"
                            placeholder="What's this about?"
                            value={messageForm.subject}
                            onChange={(e) => setMessageForm((prev) => ({ ...prev, subject: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="pf-form-field">
                        <label className="pf-form-label-txt">
                          Message <span className="req-dot">*</span>
                        </label>
                        <textarea
                          className="pf-textarea-control"
                          rows={4}
                          placeholder="How can I help you?"
                          required
                          value={messageForm.message}
                          onChange={(e) => setMessageForm((prev) => ({ ...prev, message: e.target.value }))}
                        />
                      </div>

                      <div className="pf-form-bottom-row">
                        <button
                          type="submit"
                          className="pf-btn pf-btn-primary"
                          style={{ padding: '0.65rem 1.6rem', fontSize: '0.92rem' }}
                          disabled={sendingMessage}
                        >
                          <Mail size={16} />
                          <span>{sendingMessage ? 'Sending...' : 'Send Message'}</span>
                        </button>

                        <span className="pf-form-sla-text">
                          I'll get back to you within 24-48 hours
                        </span>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
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
