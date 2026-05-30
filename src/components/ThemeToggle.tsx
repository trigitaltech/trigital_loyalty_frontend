import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useAuth();

  return (
    <button
      onClick={toggleTheme}
      style={buttonStyle}
      className="theme-toggle-btn glass-panel"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun size={16} color="#fbbf24" style={{ animation: 'rotateIn 0.3s ease' }} />
      ) : (
        <Moon size={16} color="#4f46e5" style={{ animation: 'bounceIn 0.3s ease' }} />
      )}
    </button>
  );
};

const buttonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  border: '1px solid var(--border-color)',
  background: 'var(--glass-bg)',
  cursor: 'pointer',
  padding: 0,
  transition: 'transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease',
  boxShadow: 'var(--glass-shadow)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  outline: 'none',
};
