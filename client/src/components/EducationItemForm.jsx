import React from 'react';
import { Trash2, ArrowUp, ArrowDown, GraduationCap, BookOpen, Calendar, Award } from 'lucide-react';

const EducationItemForm = ({
  education,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}) => {
  const handleFieldChange = (field, value) => {
    onChange(index, { ...education, [field]: value });
  };

  return (
    <div className="dynamic-item-card" id={`edu-card-${index}`}>
      <div className="dynamic-item-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              background: 'rgba(168, 85, 247, 0.2)',
              color: '#d8b4fe',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            #{index + 1}
          </div>
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
            {education.degree
              ? `${education.degree} ${education.institution ? `@ ${education.institution}` : ''}`
              : education.institution || 'Education Entry'}
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
            title="Remove Education"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '1rem' }}>
        <div className="form-group">
          <label className="form-label">
            <GraduationCap size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            School / University / Institution <span className="req">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Stanford University / UC Berkeley"
            value={education.institution || ''}
            onChange={(e) => handleFieldChange('institution', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <Award size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Degree / Certificate
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Bachelor of Science / Full Stack Diploma"
            value={education.degree || ''}
            onChange={(e) => handleFieldChange('degree', e.target.value)}
          />
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '1rem' }}>
        <div className="form-group">
          <label className="form-label">
            <BookOpen size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Field of Study / Major
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Computer Science & Software Engineering"
            value={education.fieldOfStudy || ''}
            onChange={(e) => handleFieldChange('fieldOfStudy', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <Calendar size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Duration / Graduation Year
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. 2019 - 2023 or Class of 2024"
            value={education.duration || ''}
            onChange={(e) => handleFieldChange('duration', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Description / Honors & Key Coursework</label>
        <textarea
          className="form-control"
          placeholder="e.g. Graduated Magna Cum Laude. Relevant Coursework: Data Structures, Algorithms, Distributed Systems, Cloud Architecture."
          rows={2}
          value={education.description || ''}
          onChange={(e) => handleFieldChange('description', e.target.value)}
        />
      </div>
    </div>
  );
};

export default EducationItemForm;
