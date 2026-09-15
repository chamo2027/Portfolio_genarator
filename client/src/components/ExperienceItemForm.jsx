import React from 'react';
import { Trash2, ArrowUp, ArrowDown, Building, Briefcase, Calendar } from 'lucide-react';

const ExperienceItemForm = ({
  exp,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}) => {
  const handleFieldChange = (field, value) => {
    onChange(index, { ...exp, [field]: value });
  };

  return (
    <div className="dynamic-item-card" id={`exp-card-${index}`}>
      <div className="dynamic-item-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            background: 'rgba(6, 182, 212, 0.2)',
            color: '#67e8f9',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 700
          }}>
            #{index + 1}
          </div>
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
            {exp.role ? `${exp.role} ${exp.company ? `@ ${exp.company}` : ''}` : 'Experience Entry'}
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
            title="Remove Experience"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="grid-3">
        <div className="form-group">
          <label className="form-label">
            <Building size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Company <span className="req">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Acme Corp / Google"
            value={exp.company || ''}
            onChange={(e) => handleFieldChange('company', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <Briefcase size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Role / Title <span className="req">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Frontend Engineer"
            value={exp.role || ''}
            onChange={(e) => handleFieldChange('role', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <Calendar size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Duration
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. 2022 - Present or 6 Months"
            value={exp.duration || ''}
            onChange={(e) => handleFieldChange('duration', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Description / Key Achievements</label>
        <textarea
          className="form-control"
          placeholder="Describe your responsibilities, technical contributions, and metrics of success."
          rows={2}
          value={exp.description || ''}
          onChange={(e) => handleFieldChange('description', e.target.value)}
        />
      </div>
    </div>
  );
};

export default ExperienceItemForm;
