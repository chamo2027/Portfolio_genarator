import React, { useState, useRef } from 'react';
import {
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Github,
  Image as ImageIcon,
  Upload,
  Loader2,
  X,
  Sparkles,
} from 'lucide-react';
import { portfolioAPI } from '../services/api';
import { useToast } from './Toast';

const SAMPLE_PROJECT_IMAGES = [
  { label: 'Server / AI', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=700&q=80' },
  { label: 'Cloud / Data', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=700&q=80' },
  { label: 'Web Platform', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80' },
  { label: 'Mobile App', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=700&q=80' },
  { label: 'Code & IDE', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=700&q=80' },
];

const ProjectItemForm = ({
  project,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}) => {
  const { addToast } = useToast();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFieldChange = (field, value) => {
    onChange(index, { ...project, [field]: value });
  };

  const handleTechStackChange = (e) => {
    const raw = e.target.value;
    const array = raw.split(',').map((item) => item.trim()).filter(Boolean);
    onChange(index, { ...project, techStack: array, _techStackRaw: raw });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file (JPG, PNG, WebP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size exceeds 5MB limit', 'error');
      return;
    }

    setUploading(true);
    try {
      const res = await portfolioAPI.uploadFile(file);
      if (res.success && res.url) {
        handleFieldChange('image', res.url);
        addToast('Project screenshot uploaded successfully! 📸', 'success');
      }
    } catch (err) {
      addToast('Failed to upload image. Please try again or paste a URL.', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const techStackString = project._techStackRaw !== undefined
    ? project._techStackRaw
    : (Array.isArray(project.techStack) ? project.techStack.join(', ') : '');

  return (
    <div className="dynamic-item-card" id={`project-card-${index}`}>
      <div className="dynamic-item-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            background: 'rgba(99, 102, 241, 0.2)',
            color: '#a5b4fc',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 700
          }}>
            #{index + 1}
          </div>
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
            {project.name || 'Untitled Project'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {onMoveUp && (
            <button
              type="button"
              className="btn btn-secondary btn-icon"
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              title="Move Up"
            >
              <ArrowUp size={14} />
            </button>
          )}
          {onMoveDown && (
            <button
              type="button"
              className="btn btn-secondary btn-icon"
              onClick={() => onMoveDown(index)}
              disabled={index === total - 1}
              title="Move Down"
            >
              <ArrowDown size={14} />
            </button>
          )}
          <button
            type="button"
            className="btn btn-danger btn-icon"
            onClick={() => onRemove(index)}
            title="Remove Project"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Project Picture Upload & Preview Section */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <label className="form-label" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ImageIcon size={15} color="var(--primary)" /> Project Picture / Cover Image
          </label>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Displays at the top of the project card
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Image Thumbnail Preview */}
          {project.image && (
            <div
              style={{
                position: 'relative',
                width: '130px',
                height: '82px',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                flexShrink: 0,
                background: '#0a0e1a',
              }}
            >
              <img
                src={project.image}
                alt="Project preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=700&q=80';
                }}
              />
              <button
                type="button"
                onClick={() => handleFieldChange('image', '')}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: 'rgba(0, 0, 0, 0.75)',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                title="Remove image"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {/* Input & Upload Controls */}
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="url"
                className="form-control"
                placeholder="Paste Image URL (https://...)"
                value={project.image || ''}
                onChange={(e) => handleFieldChange('image', e.target.value)}
              />

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileUpload}
              />

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{ whiteSpace: 'nowrap', padding: '0 1rem' }}
                title="Upload image from device"
              >
                {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                <span>{uploading ? 'Uploading...' : 'Upload'}</span>
              </button>
            </div>

            {/* Quick Sample Presets */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Sparkles size={11} /> Quick Samples:
              </span>
              {SAMPLE_PROJECT_IMAGES.map((sample, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => handleFieldChange('image', sample.url)}
                  style={{
                    background: project.image === sample.url ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${project.image === sample.url ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)'}`,
                    color: project.image === sample.url ? '#a5b4fc' : '#94a3b8',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">
            Project Name <span className="req">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Nexus Vector Search Engine"
            value={project.name || ''}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Tech Stack <span className="optional">(comma separated)</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Go, Python, gRPC, Docker"
            value={techStackString}
            onChange={handleTechStackChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          placeholder="High-throughput semantic similarity search API powered by HNSW indexing handling 50k QPS under 8ms latency."
          rows={2}
          value={project.description || ''}
          onChange={(e) => handleFieldChange('description', e.target.value)}
        />
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">
            <ExternalLink size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Live Demo URL <span className="optional">(optional)</span>
          </label>
          <input
            type="url"
            className="form-control"
            placeholder="https://my-project-demo.com"
            value={project.liveDemo || ''}
            onChange={(e) => handleFieldChange('liveDemo', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <Github size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            GitHub / Code URL <span className="optional">(optional)</span>
          </label>
          <input
            type="url"
            className="form-control"
            placeholder="https://github.com/user/project"
            value={project.githubLink || ''}
            onChange={(e) => handleFieldChange('githubLink', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectItemForm;

