import React from 'react';
import { Check, Palette } from 'lucide-react';

export const THEMES = [
  {
    id: 'modern-dark',
    name: 'Tech Dark',
    description: 'Sleek dark slate with vibrant indigo & cyan accents',
    colors: ['#090d16', '#6366f1', '#06b6d4'],
    isDark: true,
  },
  {
    id: 'minimal-light',
    name: 'Clean Light',
    description: 'Crisp white paper with modern slate & royal blue highlights',
    colors: ['#f8fafc', '#2563eb', '#059669'],
    isDark: false,
  },
  {
    id: 'glassmorphism',
    name: 'Aurora Glass',
    description: 'Translucent cards with vivid sky-blue ambient glow',
    colors: ['#050b14', '#38bdf8', '#818cf8'],
    isDark: true,
  },
  {
    id: 'cyberpunk',
    name: 'Cyber Neon',
    description: 'High-contrast dark purple with glowing neon pink & cyan',
    colors: ['#07040f', '#f43f5e', '#06b6d4'],
    isDark: true,
  },
  {
    id: 'nordic-forest',
    name: 'Nordic Forest',
    description: 'Deep teal and forest tones with mint & yellow accents',
    colors: ['#071514', '#2dd4bf', '#facc15'],
    isDark: true,
  },
];

const ThemeSelector = ({ selectedTheme = 'modern-dark', onChange }) => {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Palette size={18} color="var(--primary)" />
        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Select Portfolio Visual Theme</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {THEMES.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          return (
            <div
              key={theme.id}
              onClick={() => onChange(theme.id)}
              style={{
                background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                border: `2px solid ${isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'var(--primary)',
                    color: '#ffffff',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={12} strokeWidth={3} />
                </div>
              )}

              {/* Color Swatch Dots */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '0.75rem' }}>
                {theme.colors.map((c, i) => (
                  <span
                    key={i}
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: c,
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  />
                ))}
              </div>

              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem', color: isSelected ? '#ffffff' : 'var(--text-primary)' }}>
                {theme.name}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {theme.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSelector;
