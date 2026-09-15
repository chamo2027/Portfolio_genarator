import React from 'react';
import { Trash2, ArrowUp, ArrowDown, FolderGit2, ExternalLink, Github, Image as ImageIcon } from 'lucide-react';

const ProjectItemForm = ({
  project,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}) => {
  const handleFieldChange = (field, value) => {
    onChange(index, { ...project, [field]: value });
  };

  const handleTechStackChange = (e) => {
    const raw = e.target.value;
    const array = raw.split(',').map((item) => item.trim()).filter(Boolean);
    onChange(index, { ...project, techStack: array, _techStackRaw: raw });
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

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">
            Project Name <span className="req">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. AI Workflow Platform"
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
            placeholder="e.g. React, Node.js, MongoDB, Tailwind"
            value={techStackString}
            onChange={handleTechStackChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          placeholder="What does this project do, what challenges did you solve, and what impact did it make?"
          rows={2}
          value={project.description || ''}
          onChange={(e) => handleFieldChange('description', e.target.value)}
        />
      </div>

      <div className="grid-3">
        <div className="form-group">
          <label className="form-label">
            <Github size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            GitHub URL <span className="optional">(optional)</span>
          </label>
          <input
            type="url"
            className="form-control"
            placeholder="https://github.com/user/project"
            value={project.githubLink || ''}
            onChange={(e) => handleFieldChange('githubLink', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <ExternalLink size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Live Demo URL <span className="optional">(optional)</span>
          </label>
          <input
            type="url"
            className="form-control"
            placeholder="https://my-app.vercel.app"
            value={project.liveDemo || ''}
            onChange={(e) => handleFieldChange('liveDemo', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <ImageIcon size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Image / Screenshot URL <span className="optional">(optional)</span>
          </label>
          <input
            type="url"
            className="form-control"
            placeholder="https://example.com/screenshot.jpg"
            value={project.image || ''}
            onChange={(e) => handleFieldChange('image', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectItemForm;
