import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Wrench,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Palette,
  Eye,
  Send,
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Upload,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { portfolioAPI } from '../services/api';
import { useToast } from '../components/Toast';
import DynamicSkillInput from '../components/DynamicSkillInput';
import ProjectItemForm from '../components/ProjectItemForm';
import ExperienceItemForm from '../components/ExperienceItemForm';
import EducationItemForm from '../components/EducationItemForm';
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
  skills: [],
  projects: [],
  experience: [],
  education: [],
  theme: 'modern-dark',
  resumeUrl: '',
};

const EXAMPLE_PROJECT_TEMPLATE = {
  name: 'E-Commerce Cloud Platform',
  description: 'Full featured online store with Stripe payment integration, cart state management, and real-time inventory tracking.',
  techStack: ['React', 'Node.js', 'Express', 'MongoDB'],
  githubLink: 'https://github.com/developer/ecommerce-shop',
  liveDemo: 'https://demo-ecommerce.example.com',
  image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=600&q=80',
};

const EXAMPLE_EXPERIENCE_TEMPLATE = {
  company: 'Tech Solutions Inc.',
  role: 'Full Stack Developer',
  duration: '2022 - Present',
  description: 'Developed responsive frontend applications and designed REST APIs serving over 50,000 active users.',
};

const EXAMPLE_EDUCATION_TEMPLATE = {
  institution: 'University of California, Berkeley',
  degree: 'Bachelor of Science',
  fieldOfStudy: 'Computer Science',
  duration: '2019 - 2023',
  description: 'Graduated with Honors. Relevant Coursework: Data Structures, Algorithms, Distributed Systems, Cloud Architecture.',
};

const CreatePortfolioPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const lastCheckedUsernameRef = useRef('');

  const [formData, setFormData] = useState(() => {
    const savedDraft = sessionStorage.getItem('devfolio_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        // Ensure defaults if previous draft had obsolete structure
        return {
          ...INITIAL_FORM,
          ...parsed,
          skills: Array.isArray(parsed.skills) ? parsed.skills : [],
          projects: Array.isArray(parsed.projects) ? parsed.projects : [],
          experience: Array.isArray(parsed.experience) ? parsed.experience : [],
          education: Array.isArray(parsed.education) ? parsed.education : [],
        };
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

  // Debounced username availability check with popup notification
  useEffect(() => {
    const username = formData.username.trim().toLowerCase();
    if (!username || username.length < 3) {
      setUsernameStatus({ checking: false, available: null, message: '' });
      lastCheckedUsernameRef.current = '';
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

        // Trigger top-up toast message when username is verified
        if (lastCheckedUsernameRef.current !== username) {
          lastCheckedUsernameRef.current = username;
          if (res.available) {
            addToast(`Username "${username}" is available! 🎉`, 'success');
          } else {
            addToast(res.message || `Username "${username}" is taken.`, 'error');
          }
        }
      } catch (err) {
        setUsernameStatus({ checking: false, available: null, message: 'Error checking username' });
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [formData.username, addToast]);

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

  const handleUseExampleProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, { ...EXAMPLE_PROJECT_TEMPLATE }],
    }));
    addToast('Example project template added! You can now customize it.', 'info');
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

  const handleUseExampleExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [...prev.experience, { ...EXAMPLE_EXPERIENCE_TEMPLATE }],
    }));
    addToast('Example experience template added! You can now customize it.', 'info');
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

  // Dynamic Education Handlers
  const handleAddEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...(prev.education || []),
        { institution: '', degree: '', fieldOfStudy: '', duration: '', description: '' },
      ],
    }));
  };

  const handleUseExampleEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...(prev.education || []), { ...EXAMPLE_EDUCATION_TEMPLATE }],
    }));
    addToast('Example education template added! You can now customize it.', 'info');
  };

  const handleUpdateEducation = (index, updatedEdu) => {
    setFormData((prev) => {
      const newEdu = [...(prev.education || [])];
      newEdu[index] = updatedEdu;
      return { ...prev, education: newEdu };
    });
  };

  const handleRemoveEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: (prev.education || []).filter((_, i) => i !== index),
    }));
  };

  const handleMoveEduUp = (index) => {
    if (index === 0) return;
    setFormData((prev) => {
      const copy = [...(prev.education || [])];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return { ...prev, education: copy };
    });
  };

  const handleMoveEduDown = (index) => {
    setFormData((prev) => {
      if (index === (prev.education || []).length - 1) return prev;
      const copy = [...(prev.education || [])];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return { ...prev, education: copy };
    });
  };

  // Step Completion Visual Indicators
  const isPersonalComplete = Boolean(
    formData.username.trim().length >= 3 &&
    /^[a-z0-9-_]+$/.test(formData.username.trim().toLowerCase()) &&
    formData.fullName.trim()
  );

  const isContactComplete = Boolean(
    formData.contact.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email.trim())
  );

  const isSkillsComplete = formData.skills.length > 0;

  const isProjectsComplete =
    formData.projects.length > 0 &&
    formData.projects.some((p) => p.name && p.name.trim().length > 0);

  const isExperienceComplete =
    formData.experience.length > 0 &&
    formData.experience.some(
      (e) => e.company && e.company.trim().length > 0
    );

  const isEducationComplete =
    Array.isArray(formData.education) &&
    formData.education.length > 0 &&
    formData.education.some(
      (e) => e.institution && e.institution.trim().length > 0
    );

  const isThemeComplete = Boolean(formData.theme);

  // Validate form before submission
  const validateForm = () => {
    if (!formData.username.trim()) {
      addToast('Please provide a unique username for your portfolio URL', 'error');
      setActiveTab('personal');
      return false;
    }
    if (formData.username.trim().length < 3) {
      addToast('Username must be at least 3 characters', 'error');
      setActiveTab('personal');
      return false;
    }
    if (!/^[a-z0-9-_]+$/.test(formData.username.trim().toLowerCase())) {
      addToast('Username can only contain alphanumeric characters, hyphens, and underscores', 'error');
      setActiveTab('personal');
      return false;
    }
    if (usernameStatus.available === false) {
      addToast('This username is already taken. Please choose another one.', 'error');
      setActiveTab('personal');
      return false;
    }
    if (!formData.fullName.trim()) {
      addToast('Please provide your Full Name', 'error');
      setActiveTab('personal');
      return false;
    }
    if (formData.contact.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email.trim())) {
      addToast('Please provide a valid contact email address', 'error');
      setActiveTab('contact');
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
      const cleanedProjects = formData.projects.filter(
        (p) => p && (p.name?.trim() || p.description?.trim() || p.githubLink?.trim() || p.liveDemo?.trim())
      );
      const cleanedExperience = formData.experience.filter(
        (e) => e && (e.company?.trim() || e.role?.trim() || e.description?.trim())
      );
      const cleanedEducation = (formData.education || []).filter(
        (ed) => ed && (ed.institution?.trim() || ed.degree?.trim() || ed.fieldOfStudy?.trim() || ed.description?.trim())
      );

      const payload = {
        ...formData,
        projects: cleanedProjects,
        experience: cleanedExperience,
        education: cleanedEducation,
      };

      const res = await portfolioAPI.createPortfolio(payload);
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
    { id: 'personal', label: '1. Personal Info', icon: User, complete: isPersonalComplete },
    { id: 'contact', label: '2. Contact & Socials', icon: Mail, complete: isContactComplete },
    { id: 'skills', label: '3. Skills', icon: Wrench, count: formData.skills.length, complete: isSkillsComplete },
    { id: 'projects', label: '4. Projects', icon: FolderGit2, count: formData.projects.length, complete: isProjectsComplete },
    { id: 'experience', label: '5. Experience', icon: Briefcase, count: formData.experience.length, complete: isExperienceComplete },
    { id: 'education', label: '6. Education', icon: GraduationCap, count: (formData.education || []).length, complete: isEducationComplete },
    { id: 'theme', label: '7. Theme & Design', icon: Palette, complete: isThemeComplete },
  ];

  const completedStepsCount = [
    isPersonalComplete,
    isContactComplete,
    isSkillsComplete,
    isProjectsComplete,
    isExperienceComplete,
    isEducationComplete,
    isThemeComplete,
  ].filter(Boolean).length;

  const isAllStepsFulfilled = completedStepsCount === 7;

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
            Fill in your profile details below to publish your live portfolio.
          </p>

          {/* Progress Tracker */}
          <div
            style={{
              maxWidth: '420px',
              margin: '1.25rem auto 0 auto',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '0.75rem 1.25rem',
              borderRadius: '9999px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
              <span style={{ fontWeight: 700, color: completedStepsCount === 6 ? '#10b981' : 'var(--primary)' }}>
                {completedStepsCount} of 6 Steps Completed
              </span>
            </div>
            <div
              style={{
                flex: 1,
                height: '6px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '3px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${(completedStepsCount / 6) * 100}%`,
                  height: '100%',
                  background: completedStepsCount === 6 ? '#10b981' : 'var(--primary)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
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
                {tab.complete && (
                  <CheckCircle2
                    size={14}
                    style={{
                      color: isActive ? '#ffffff' : '#10b981',
                      marginLeft: '2px',
                    }}
                  />
                )}
                {tab.count !== undefined && !tab.complete && (
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
                  {/* Username with real-time status & popup */}
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
                    <label className="form-label">
                      Professional Title / Headline <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Senior Full Stack Engineer & Cloud Architect"
                      value={formData.title}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      required
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

                {/* Bio / Summary - REQUIRED */}
                <div className="form-group">
                  <label className="form-label">
                    Bio / Summary <span className="req">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    placeholder="Tell recruiters and visitors about your passion, core strengths, and what drives you."
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => handleFieldChange('bio', e.target.value)}
                    required
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
                    <label className="form-label">
                      Email Address <span className="req">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="alex.chen@example.com"
                      value={formData.contact.email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      required
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
                  Technical Skills & Tools <span className="req">*</span>
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  Add programming languages, frameworks, cloud services, and tools you excel at. Choose from popular suggestions below or type your own.
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FolderGit2 size={20} color="var(--primary)" />
                      Projects Showcase ({formData.projects.length}) <span className="req">*</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                      Showcase your best open-source and commercial work.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleUseExampleProject}
                      title="Add pre-filled template"
                    >
                      <Sparkles size={15} />
                      <span>Use Example Template</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleAddProject}
                      id="btn-add-project"
                    >
                      <Plus size={16} />
                      <span>Add Project</span>
                    </button>
                  </div>
                </div>

                {formData.projects.length === 0 ? (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '16px',
                      border: '1px dashed var(--border-color)',
                      padding: '2rem 1.5rem',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          background: 'rgba(99, 102, 241, 0.12)',
                          color: 'var(--primary)',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          marginBottom: '0.9rem',
                        }}
                      >
                        <Sparkles size={14} /> Example Project Template Preview
                      </div>

                      {/* Template Preview Card */}
                      <div
                        style={{
                          background: 'rgba(17, 24, 39, 0.75)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '12px',
                          padding: '1.25rem 1.5rem',
                          maxWidth: '540px',
                          margin: '0 auto 1.25rem auto',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                            {EXAMPLE_PROJECT_TEMPLATE.name}
                          </h4>
                          <span style={{ fontSize: '0.72rem', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', padding: '2px 8px', borderRadius: '4px' }}>
                            Example
                          </span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                          {EXAMPLE_PROJECT_TEMPLATE.description}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {EXAMPLE_PROJECT_TEMPLATE.techStack.map((tech, i) => (
                            <span key={i} style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.74rem', color: '#e2e8f0' }}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                      No projects added yet. Start fresh or click below to populate the example template.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleAddProject}
                      >
                        <Plus size={16} /> Add Blank Project
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={handleUseExampleProject}
                      >
                        <Sparkles size={16} /> Use Example Template
                      </button>
                    </div>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Briefcase size={20} color="var(--primary)" />
                      Work Experience & Roles ({formData.experience.length}) <span className="req">*</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                      Highlight your career journey and key accomplishments.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleUseExampleExperience}
                      title="Add pre-filled template"
                    >
                      <Sparkles size={15} />
                      <span>Use Example Template</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleAddExperience}
                      id="btn-add-exp"
                    >
                      <Plus size={16} />
                      <span>Add Experience</span>
                    </button>
                  </div>
                </div>

                {formData.experience.length === 0 ? (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '16px',
                      border: '1px dashed var(--border-color)',
                      padding: '2rem 1.5rem',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          background: 'rgba(6, 182, 212, 0.12)',
                          color: 'var(--secondary)',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          marginBottom: '0.9rem',
                        }}
                      >
                        <Sparkles size={14} /> Example Role Template Preview
                      </div>

                      {/* Template Preview Card */}
                      <div
                        style={{
                          background: 'rgba(17, 24, 39, 0.75)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '12px',
                          padding: '1.25rem 1.5rem',
                          maxWidth: '540px',
                          margin: '0 auto 1.25rem auto',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                            {EXAMPLE_EXPERIENCE_TEMPLATE.role} @ {EXAMPLE_EXPERIENCE_TEMPLATE.company}
                          </h4>
                          <span style={{ fontSize: '0.72rem', background: 'rgba(6, 182, 212, 0.2)', color: '#67e8f9', padding: '2px 8px', borderRadius: '4px' }}>
                            {EXAMPLE_EXPERIENCE_TEMPLATE.duration}
                          </span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                          {EXAMPLE_EXPERIENCE_TEMPLATE.description}
                        </p>
                      </div>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                      No work experience added yet. Add your professional roles or click below to populate the template.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleAddExperience}
                      >
                        <Plus size={16} /> Add Blank Experience
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={handleUseExampleExperience}
                      >
                        <Sparkles size={16} /> Use Example Template
                      </button>
                    </div>
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

            {/* TAB 6: Education */}
            {activeTab === 'education' && (
              <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <GraduationCap size={20} color="var(--primary)" />
                      Education & Degrees ({formData.education?.length || 0}) <span className="req">*</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                      Add your universities, colleges, degrees, bootcamps, and academic achievements.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleUseExampleEducation}
                      title="Add pre-filled education template"
                    >
                      <Sparkles size={15} />
                      <span>Use Example Template</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleAddEducation}
                      id="btn-add-edu"
                    >
                      <Plus size={16} />
                      <span>Add Education</span>
                    </button>
                  </div>
                </div>

                {!formData.education || formData.education.length === 0 ? (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '16px',
                      border: '1px dashed var(--border-color)',
                      padding: '2rem 1.5rem',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          background: 'rgba(168, 85, 247, 0.12)',
                          color: '#d8b4fe',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          marginBottom: '0.9rem',
                        }}
                      >
                        <Sparkles size={14} /> Example Education Template Preview
                      </div>

                      {/* Template Preview Card */}
                      <div
                        style={{
                          background: 'rgba(17, 24, 39, 0.75)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '12px',
                          padding: '1.25rem 1.5rem',
                          maxWidth: '540px',
                          margin: '0 auto 1.25rem auto',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                            {EXAMPLE_EDUCATION_TEMPLATE.degree} ({EXAMPLE_EDUCATION_TEMPLATE.fieldOfStudy})
                          </h4>
                          <span style={{ fontSize: '0.72rem', background: 'rgba(168, 85, 247, 0.2)', color: '#d8b4fe', padding: '2px 8px', borderRadius: '4px' }}>
                            {EXAMPLE_EDUCATION_TEMPLATE.duration}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.88rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.4rem' }}>
                          {EXAMPLE_EDUCATION_TEMPLATE.institution}
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                          {EXAMPLE_EDUCATION_TEMPLATE.description}
                        </p>
                      </div>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                      No education entries added yet. Add your university / college degree or click below to populate the template.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleAddEducation}
                      >
                        <Plus size={16} /> Add Blank Education
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={handleUseExampleEducation}
                      >
                        <Sparkles size={16} /> Use Example Template
                      </button>
                    </div>
                  </div>
                ) : (
                  formData.education.map((edu, idx) => (
                    <EducationItemForm
                      key={idx}
                      education={edu}
                      index={idx}
                      total={formData.education.length}
                      onChange={handleUpdateEducation}
                      onRemove={handleRemoveEducation}
                      onMoveUp={handleMoveEduUp}
                      onMoveDown={handleMoveEduDown}
                    />
                  ))
                )}
              </div>
            )}

            {/* TAB 7: Theme & Resume */}
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {!isAllStepsFulfilled && (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Complete {7 - completedStepsCount} more step{7 - completedStepsCount > 1 ? 's' : ''} to publish
                </span>
              )}
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={!isAllStepsFulfilled || isSubmitting}
                id="btn-publish-portfolio"
                title={
                  !isAllStepsFulfilled
                    ? `Complete all 7 steps to publish (${7 - completedStepsCount} remaining)`
                    : 'Publish your live portfolio'
                }
                style={{
                  opacity: !isAllStepsFulfilled ? 0.5 : 1,
                  cursor: !isAllStepsFulfilled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.25s ease',
                }}
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
