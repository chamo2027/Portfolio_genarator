import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Wrench,
  FolderGit2,
  Briefcase,
  Palette,
  Eye,
  Send,
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Upload,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { portfolioAPI } from '../services/api';
import { useToast } from '../components/Toast';
import DynamicSkillInput from '../components/DynamicSkillInput';
import ProjectItemForm from '../components/ProjectItemForm';
import ExperienceItemForm from '../components/ExperienceItemForm';
import ThemeSelector from '../components/ThemeSelector';

const INITIAL_FORM = {
  username: '',
  fullName: '',
  title: 'Full Stack Developer',
  bio: '',
  profileImage: '',
  contact: {
    email: '',
    linkedin: '',
    github: '',
    website: '',
    twitter: '',
    location: '',
  },
  skills: ['React', 'Node.js', 'JavaScript', 'MongoDB', 'Git'],
  projects: [
    {
      name: 'E-Commerce Platform',
      description: 'Full featured online store with Stripe payment integration, cart state management, and real-time inventory tracking.',
      techStack: ['React', 'Node.js', 'Express', 'MongoDB'],
      githubLink: 'https://github.com/developer/ecommerce-shop',
      liveDemo: 'https://demo-ecommerce.example.com',
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=600&q=80',
    },
  ],
  experience: [
    {
      company: 'Tech Solutions Inc.',
      role: 'Full Stack Developer',
      duration: '2022 - Present',
      description: 'Developed responsive frontend applications and designed REST APIs serving over 50,000 active users.',
    },
  ],
  theme: 'modern-dark',
  resumeUrl: '',
};

const CreatePortfolioPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState(() => {
    const savedDraft = sessionStorage.getItem('devfolio_draft');
    if (savedDraft) {
      try {
        return JSON.parse(savedDraft);
      } catch (e) {
        return INITIAL_FORM;
      }
    }
    return INITIAL_FORM;
  });

  const [activeTab, setActiveTab] = useState('personal');
  const [usernameStatus, setUsernameStatus] = useState({ checking: false, available: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  // Save draft to sessionStorage whenever formData changes
  useEffect(() => {
    sessionStorage.setItem('devfolio_draft', JSON.stringify(formData));
  }, [formData]);

  // Debounced username availability check
  useEffect(() => {
    const username = formData.username.trim().toLowerCase();
    if (!username || username.length < 3) {
      setUsernameStatus({ checking: false, available: null, message: '' });
      return;
    }

    if (!/^[a-z0-9-_]+$/.test(username)) {
      setUsernameStatus({
        checking: false,
        available: false,
        message: 'Only letters, numbers, hyphens & underscores allowed',
      });
      return;
    }

    setUsernameStatus({ checking: true, available: null, message: 'Checking availability...' });
    const timer = setTimeout(async () => {
      try {
        const res = await portfolioAPI.checkUsername(username);
        setUsernameStatus({
          checking: false,
          available: res.available,
          message: res.message,
        });
      } catch (err) {
        setUsernameStatus({ checking: false, available: null, message: 'Error checking username' });
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [formData.username]);

  // Handle simple top-level field update
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle nested contact field update
  const handleContactChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  };

  // Avatar file upload handler
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const res = await portfolioAPI.uploadFile(file);
      if (res.success) {
        setFormData((prev) => ({ ...prev, profileImage: res.url }));
        addToast('Profile image uploaded successfully!', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to upload image', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Resume file upload handler
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingResume(true);
    try {
      const res = await portfolioAPI.uploadFile(file);
      if (res.success) {
        setFormData((prev) => ({ ...prev, resumeUrl: res.url }));
        addToast('Resume PDF uploaded successfully!', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to upload resume', 'error');
    } finally {
      setUploadingResume(false);
    }
  };

  // Dynamic Projects Handlers
  const handleAddProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { name: '', description: '', techStack: [], githubLink: '', liveDemo: '', image: '' },
      ],
    }));
  };

  const handleUpdateProject = (index, updatedProject) => {
    setFormData((prev) => {
      const newProjects = [...prev.projects];
      newProjects[index] = updatedProject;
      return { ...prev, projects: newProjects };
    });
  };

  const handleRemoveProject = (index) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const handleMoveProjectUp = (index) => {
    if (index === 0) return;
    setFormData((prev) => {
      const copy = [...prev.projects];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return { ...prev, projects: copy };
    });
  };

  const handleMoveProjectDown = (index) => {
    setFormData((prev) => {
      if (index === prev.projects.length - 1) return prev;
      const copy = [...prev.projects];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return { ...prev, projects: copy };
    });
  };

  // Dynamic Experience Handlers
  const handleAddExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: '', role: '', duration: '', description: '' },
      ],
    }));
  };

  const handleUpdateExperience = (index, updatedExp) => {
    setFormData((prev) => {
      const newExp = [...prev.experience];
      newExp[index] = updatedExp;
      return { ...prev, experience: newExp };
    });
  };

  const handleRemoveExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleMoveExpUp = (index) => {
    if (index === 0) return;
    setFormData((prev) => {
      const copy = [...prev.experience];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return { ...prev, experience: copy };
    });
  };

  const handleMoveExpDown = (index) => {
    setFormData((prev) => {
      if (index === prev.experience.length - 1) return prev;
      const copy = [...prev.experience];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return { ...prev, experience: copy };
    });
  };

  // Validate form
  const validateForm = () => {
    if (!formData.username.trim()) {
      addToast('Please provide a unique username for your portfolio URL', 'error');
      setActiveTab('personal');
      return false;
    }
    if (usernameStatus.available === false) {
      addToast('Username is taken or invalid. Please choose another username.', 'error');
      setActiveTab('personal');
      return false;
    }
    if (!formData.fullName.trim()) {
      addToast('Please provide your Full Name', 'error');
      setActiveTab('personal');
      return false;
    }
    return true;
  };

  // Navigate to Preview Page
  const handleGoToPreview = () => {
    if (!formData.fullName.trim()) {
      addToast('Please enter at least your Full Name to preview', 'error');
      setActiveTab('personal');
      return;
    }
    sessionStorage.setItem('devfolio_draft', JSON.stringify(formData));
    navigate('/preview', { state: { draftData: formData } });
  };

  // Publish Directly to DB
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await portfolioAPI.createPortfolio(formData);
      if (res.success) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
        addToast('Portfolio published successfully! 🎉', 'success');
        sessionStorage.removeItem('devfolio_draft');
        setTimeout(() => {
          navigate(`/portfolio/${res.data.username}`);
        }, 1200);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create portfolio. Please check your inputs.';
      addToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'personal', label: '1. Personal Info', icon: User },
    { id: 'contact', label: '2. Contact & Socials', icon: Mail },
    { id: 'skills', label: '3. Skills', icon: Wrench },
    { id: 'projects', label: '4. Projects', icon: FolderGit2, count: formData.projects.length },
    { id: 'experience', label: '5. Experience', icon: Briefcase, count: formData.experience.length },
    { id: 'theme', label: '6. Theme & Design', icon: Palette },
  ];

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '6rem' }}>
      <div className="container">
        {/* Header Title */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.6rem' }}>
            <Sparkles size={14} /> Portfolio Builder
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Create Your Developer Portfolio</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem', fontSize: '1rem' }}>
            Fill in your details below. Preview anytime and publish when you're ready.
          </p>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            marginBottom: '2rem',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--primary)' : 'rgba(255, 255, 255, 0.03)',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border-color)'}`,
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                      padding: '2px 7px',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            {/* TAB 1: Personal Info */}
            {activeTab === 'personal' && (
              <div className="animate-fade-in">
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={20} color="var(--primary)" />
                  Personal Information
                </h2>

                <div className="grid-2">
                  {/* Username with real-time status */}
                  <div className="form-group">
                    <label className="form-label">
                      Unique Portfolio URL Username <span className="req">*</span>
                    </label>
                    <div className="input-prefix-wrapper">
                      <span className="input-prefix">/portfolio/</span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="john-doe"
                        value={formData.username}
                        onChange={(e) => handleFieldChange('username', e.target.value.toLowerCase())}
                        required
                        id="input-username"
                      />
                    </div>
                    {usernameStatus.checking && (
                      <div className="form-helper" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Loader2 size={13} className="animate-spin" /> Checking username availability...
                      </div>
                    )}
                    {!usernameStatus.checking && usernameStatus.available === true && (
                      <div className="form-helper" style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={13} /> {usernameStatus.message}
                      </div>
                    )}
                    {!usernameStatus.checking && usernameStatus.available === false && (
                      <div className="form-error">
                        <AlertCircle size={13} /> {usernameStatus.message}
                      </div>
                    )}
                  </div>

                  {/* Full Name */}
                  <div className="form-group">
                    <label className="form-label">
                      Full Name <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Alex Chen"
                      value={formData.fullName}
                      onChange={(e) => handleFieldChange('fullName', e.target.value)}
                      required
                      id="input-fullname"
                    />
                  </div>
                </div>

                <div className="grid-2">
                  {/* Title / Role */}
                  <div className="form-group">
                    <label className="form-label">Professional Title / Headline</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Senior Full Stack Engineer & Cloud Architect"
                      value={formData.title}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      id="input-title"
                    />
                  </div>

                  {/* Profile Image URL or Upload */}
                  <div className="form-group">
                    <label className="form-label">
                      Profile Picture <span className="optional">(URL or upload file)</span>
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://example.com/avatar.jpg"
                        value={formData.profileImage}
                        onChange={(e) => handleFieldChange('profileImage', e.target.value)}
                        id="input-profile-image"
                      />
                      <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', margin: 0 }}>
                        <Upload size={14} />
                        <span>{uploadingAvatar ? 'Uploading...' : 'Upload'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleAvatarUpload}
                          disabled={uploadingAvatar}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="form-group">
                  <label className="form-label">Bio / Summary</label>
                  <textarea
                    className="form-control"
                    placeholder="Tell recruiters and visitors about your passion, core strengths, and what drives you."
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => handleFieldChange('bio', e.target.value)}
                    id="input-bio"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Contact & Socials */}
            {activeTab === 'contact' && (
              <div className="animate-fade-in">
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={20} color="var(--primary)" />
                  Contact & Social Profiles
                </h2>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="alex.chen@example.com"
                      value={formData.contact.email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      id="input-email"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. San Francisco, CA / Remote"
                      value={formData.contact.location}
                      onChange={(e) => handleContactChange('location', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">GitHub Profile URL</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://github.com/alexchen"
                      value={formData.contact.github}
                      onChange={(e) => handleContactChange('github', e.target.value)}
                      id="input-github"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://linkedin.com/in/alexchen"
                      value={formData.contact.linkedin}
                      onChange={(e) => handleContactChange('linkedin', e.target.value)}
                      id="input-linkedin"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Personal Website / Blog</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://alexchen.dev"
                      value={formData.contact.website}
                      onChange={(e) => handleContactChange('website', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Twitter / X Profile</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://twitter.com/alexchen"
                      value={formData.contact.twitter}
                      onChange={(e) => handleContactChange('twitter', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Skills */}
            {activeTab === 'skills' && (
              <div className="animate-fade-in">
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Wrench size={20} color="var(--primary)" />
                  Technical Skills & Tools
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  Add programming languages, frameworks, cloud services, and tools you excel at.
                </p>

                <DynamicSkillInput
                  skills={formData.skills}
                  onChange={(newSkills) => setFormData((prev) => ({ ...prev, skills: newSkills }))}
                />
              </div>
            )}

            {/* TAB 4: Projects */}
            {activeTab === 'projects' && (
              <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FolderGit2 size={20} color="var(--primary)" />
                      Projects Showcase ({formData.projects.length})
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                      Showcase your best open-source and commercial work.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleAddProject}
                    id="btn-add-project"
                  >
                    <Plus size={16} />
                    <span>Add Project</span>
                  </button>
                </div>

                {formData.projects.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No projects added yet.</p>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleAddProject}>
                      <Plus size={16} /> Add Your First Project
                    </button>
                  </div>
                ) : (
                  formData.projects.map((proj, idx) => (
                    <ProjectItemForm
                      key={idx}
                      project={proj}
                      index={idx}
                      total={formData.projects.length}
                      onChange={handleUpdateProject}
                      onRemove={handleRemoveProject}
                      onMoveUp={handleMoveProjectUp}
                      onMoveDown={handleMoveProjectDown}
                    />
                  ))
                )}
              </div>
            )}

            {/* TAB 5: Experience */}
            {activeTab === 'experience' && (
              <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Briefcase size={20} color="var(--primary)" />
                      Work Experience & Roles ({formData.experience.length})
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                      Highlight your career journey and key accomplishments.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleAddExperience}
                    id="btn-add-exp"
                  >
                    <Plus size={16} />
                    <span>Add Experience</span>
                  </button>
                </div>

                {formData.experience.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No work experience added yet.</p>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleAddExperience}>
                      <Plus size={16} /> Add Experience
                    </button>
                  </div>
                ) : (
                  formData.experience.map((exp, idx) => (
                    <ExperienceItemForm
                      key={idx}
                      exp={exp}
                      index={idx}
                      total={formData.experience.length}
                      onChange={handleUpdateExperience}
                      onRemove={handleRemoveExperience}
                      onMoveUp={handleMoveExpUp}
                      onMoveDown={handleMoveExpDown}
                    />
                  ))
                )}
              </div>
            )}

            {/* TAB 6: Theme & Resume */}
            {activeTab === 'theme' && (
              <div className="animate-fade-in">
                <ThemeSelector
                  selectedTheme={formData.theme}
                  onChange={(newTheme) => setFormData((prev) => ({ ...prev, theme: newTheme }))}
                />

                <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Resume PDF Upload / Link</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1rem' }}>
                    Provide a direct link or upload your PDF resume so recruiters can view and download it directly from your portfolio.
                  </p>

                  <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '600px' }}>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://example.com/resume.pdf"
                      value={formData.resumeUrl}
                      onChange={(e) => handleFieldChange('resumeUrl', e.target.value)}
                    />
                    <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', margin: 0 }}>
                      <Upload size={14} />
                      <span>{uploadingResume ? 'Uploading...' : 'Upload PDF'}</span>
                      <input
                        type="file"
                        accept="application/pdf"
                        style={{ display: 'none' }}
                        onChange={handleResumeUpload}
                        disabled={uploadingResume}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Toolbar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleGoToPreview}
              id="btn-preview-portfolio"
            >
              <Eye size={18} />
              <span>Full Preview Mode</span>
            </button>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={isSubmitting || usernameStatus.available === false}
                id="btn-publish-portfolio"
              >
                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                <span>{isSubmitting ? 'Publishing...' : 'Publish Portfolio'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePortfolioPage;
