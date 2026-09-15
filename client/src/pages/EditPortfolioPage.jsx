import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Wrench,
  FolderGit2,
  Briefcase,
  Palette,
  Save,
  Trash2,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Sparkles,
  Upload,
  Eye,
} from 'lucide-react';
import { portfolioAPI } from '../services/api';
import { useToast } from '../components/Toast';
import DynamicSkillInput from '../components/DynamicSkillInput';
import ProjectItemForm from '../components/ProjectItemForm';
import ExperienceItemForm from '../components/ExperienceItemForm';
import ThemeSelector from '../components/ThemeSelector';

const EditPortfolioPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
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
    theme: 'modern-dark',
    resumeUrl: '',
  });

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        // Fetch without incrementing view count
        const res = await portfolioAPI.getPortfolioByUsername(username, false);
        if (res.success) {
          const data = res.data;
          setFormData({
            fullName: data.fullName || '',
            title: data.title || '',
            bio: data.bio || '',
            profileImage: data.profileImage || '',
            contact: {
              email: data.contact?.email || '',
              linkedin: data.contact?.linkedin || '',
              github: data.contact?.github || '',
              website: data.contact?.website || '',
              twitter: data.contact?.twitter || '',
              location: data.contact?.location || '',
            },
            skills: Array.isArray(data.skills) ? data.skills : [],
            projects: Array.isArray(data.projects) ? data.projects : [],
            experience: Array.isArray(data.experience) ? data.experience : [],
            theme: data.theme || 'modern-dark',
            resumeUrl: data.resumeUrl || '',
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || `Failed to load portfolio for @${username}`);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchPortfolio();
    }
  }, [username]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const res = await portfolioAPI.uploadFile(file);
      if (res.success) {
        setFormData((prev) => ({ ...prev, profileImage: res.url }));
        addToast('Profile picture uploaded successfully!', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to upload image', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingResume(true);
    try {
      const res = await portfolioAPI.uploadFile(file);
      if (res.success) {
        setFormData((prev) => ({ ...prev, resumeUrl: res.url }));
        addToast('Resume uploaded successfully!', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to upload resume', 'error');
    } finally {
      setUploadingResume(false);
    }
  };

  // Projects Handlers
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
      const copy = [...prev.projects];
      copy[index] = updatedProject;
      return { ...prev, projects: copy };
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

  // Experience Handlers
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
      const copy = [...prev.experience];
      copy[index] = updatedExp;
      return { ...prev, experience: copy };
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

  // Save changes via PUT API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      addToast('Full name cannot be empty', 'error');
      setActiveTab('personal');
      return;
    }

    setIsSaving(true);
    try {
      const res = await portfolioAPI.updatePortfolio(username, formData);
      if (res.success) {
        addToast('Portfolio updated successfully! ✨', 'success');
        navigate(`/portfolio/${username}`);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update portfolio', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete portfolio
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete @${username}'s portfolio? This action cannot be undone.`)) {
      setIsDeleting(true);
      try {
        const res = await portfolioAPI.deletePortfolio(username);
        if (res.success) {
          addToast('Portfolio was deleted successfully.', 'info');
          navigate('/explore');
        }
      } catch (err) {
        addToast(err.response?.data?.message || 'Failed to delete portfolio', 'error');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
        <Loader2 size={36} className="animate-spin" color="var(--primary)" />
        <p>Loading @{username}'s portfolio data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '6rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
          <AlertCircle size={36} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ marginBottom: '0.75rem' }}>Error Loading Portfolio</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{error}</p>
          <Link to="/explore" className="btn btn-primary">Back to Explore</Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: '1. Personal Info', icon: User },
    { id: 'contact', label: '2. Contact & Socials', icon: Mail },
    { id: 'skills', label: '3. Skills', icon: Wrench },
    { id: 'projects', label: '4. Projects', icon: FolderGit2, count: formData.projects.length },
    { id: 'experience', label: '5. Experience', icon: Briefcase, count: formData.experience.length },
    { id: 'theme', label: '6. Theme & Resume', icon: Palette },
  ];

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '6rem' }}>
      <div className="container">
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
              <Link to={`/portfolio/${username}`} className="btn btn-secondary btn-sm" title="View Public Page">
                <Eye size={14} />
                <span>View Live</span>
              </Link>
              <span className="badge badge-primary">Editing: @{username}</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Update Portfolio</h1>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={handleDelete}
              disabled={isDeleting}
              id="btn-delete-portfolio"
            >
              <Trash2 size={16} />
              <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
            </button>
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
                  <div className="form-group">
                    <label className="form-label">Username (URL Identifier)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      disabled
                      style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    />
                    <div className="form-helper">Username cannot be changed after creation.</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Full Name <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.fullName}
                      onChange={(e) => handleFieldChange('fullName', e.target.value)}
                      required
                      id="edit-fullname"
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Professional Title / Headline</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      id="edit-title"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Profile Picture (URL or upload)</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="url"
                        className="form-control"
                        value={formData.profileImage}
                        onChange={(e) => handleFieldChange('profileImage', e.target.value)}
                        placeholder="https://example.com/photo.jpg"
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

                <div className="form-group">
                  <label className="form-label">Bio / Summary</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => handleFieldChange('bio', e.target.value)}
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
                      value={formData.contact.email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.contact.location}
                      onChange={(e) => handleContactChange('location', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">GitHub URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={formData.contact.github}
                      onChange={(e) => handleContactChange('github', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">LinkedIn URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={formData.contact.linkedin}
                      onChange={(e) => handleContactChange('linkedin', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Personal Website</label>
                    <input
                      type="url"
                      className="form-control"
                      value={formData.contact.website}
                      onChange={(e) => handleContactChange('website', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Twitter / X URL</label>
                    <input
                      type="url"
                      className="form-control"
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
                  Skills & Technologies
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  Add or remove skills displayed in your expertise pill matrix.
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
                      Projects ({formData.projects.length})
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      Reorder, edit, or add new projects.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleAddProject}
                  >
                    <span>+ Add Project</span>
                  </button>
                </div>

                {formData.projects.map((proj, idx) => (
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
                ))}
              </div>
            )}

            {/* TAB 5: Experience */}
            {activeTab === 'experience' && (
              <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Briefcase size={20} color="var(--primary)" />
                      Work Experience ({formData.experience.length})
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      Update your career timeline.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleAddExperience}
                  >
                    <span>+ Add Experience</span>
                  </button>
                </div>

                {formData.experience.map((exp, idx) => (
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
                ))}
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

          {/* Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to={`/portfolio/${username}`} className="btn btn-outline">
              <ArrowLeft size={16} />
              <span>Cancel & View Portfolio</span>
            </Link>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isSaving}
              id="btn-save-changes"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              <span>{isSaving ? 'Saving Changes...' : 'Save & Publish Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPortfolioPage;
