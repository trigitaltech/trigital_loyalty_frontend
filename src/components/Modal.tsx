/* e:\claude_repos\trigital\openloyalty-master\frontend-react\src\components\Modal.tsx */
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footerButtons?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footerButtons }) => {
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={overlayStyle} onClick={onClose} aria-modal="true" role="dialog">
      <div style={contentStyle} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <h3 style={titleStyle}>{title}</h3>
          <button style={closeButtonStyle} onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={bodyStyle}>
          {children}
        </div>

        {/* Footer */}
        {footerButtons && (
          <div style={footerStyle}>
            {footerButtons}
          </div>
        )}
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  background: 'rgba(5, 7, 12, 0.75)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
};

const contentStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '520px',
  maxHeight: '85vh',
  background: '#121621',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
  overflow: 'hidden',
  animation: 'fadeIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1.25rem 1.5rem',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
};

const titleStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  color: '#f3f4f6',
  fontFamily: 'var(--font-title)'
};

const closeButtonStyle: React.CSSProperties = {
  color: '#9ca3af',
  padding: '0.25rem',
  borderRadius: '6px',
  transition: 'all 0.15s ease',
  backgroundColor: 'rgba(255, 255, 255, 0.04)',
};

const bodyStyle: React.CSSProperties = {
  padding: '1.5rem',
  overflowY: 'auto',
  fontSize: '0.95rem',
  color: '#d1d5db',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const footerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '0.75rem',
  padding: '1rem 1.5rem',
  background: '#0d1017',
  borderTop: '1px solid rgba(255, 255, 255, 0.06)'
};
