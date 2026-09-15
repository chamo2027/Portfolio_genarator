import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';

const SUGGESTED_SKILLS = [
  'React', 'Node.js', 'TypeScript', 'JavaScript', 'Python',
  'MongoDB', 'PostgreSQL', 'Express', 'Next.js', 'TailwindCSS',
  'Docker', 'AWS', 'GraphQL', 'Git', 'Redux', 'Vue.js', 'Go'
];

const DynamicSkillInput = ({ skills = [], onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const addSkill = (skillToAdd) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (!skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
    }
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(inputValue);
    }
  };

  const removeSkill = (skillToRemove) => {
    onChange(skills.filter((s) => s !== skillToRemove));
  };

  const remainingSuggestions = SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).slice(0, 8);

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Type a skill (e.g. React, TypeScript) and press Enter"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          id="skill-input-field"
        />
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => addSkill(inputValue)}
          id="btn-add-skill"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {/* Current Skill Badges */}
      {skills.length > 0 && (
        <div className="skills-cloud" style={{ marginBottom: '1rem' }}>
          {skills.map((skill, index) => (
            <span key={index} className="skill-pill">
              {skill}
              <button
                type="button"
                className="skill-pill-remove"
                onClick={() => removeSkill(skill)}
                aria-label={`Remove ${skill}`}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Suggested Quick Add Chips */}
      {remainingSuggestions.length > 0 && (
        <div style={{ marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            <Sparkles size={13} color="var(--primary)" />
            <span>Popular suggestions (click to add):</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {remainingSuggestions.map((suggested) => (
              <button
                key={suggested}
                type="button"
                onClick={() => addSkill(suggested)}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-secondary)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.target.style.color = 'var(--text-secondary)';
                }}
              >
                + {suggested}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicSkillInput;
