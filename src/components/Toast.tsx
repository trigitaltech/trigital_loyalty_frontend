/* e:\claude_repos\trigital\openloyalty-master\frontend-react\src\components\Toast.tsx */
import React from 'react';
import { useAuth, Toast as ToastType } from '../context/AuthContext';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useAuth();

  if (toasts.length === 0) return null;

  return (
    <div style={containerStyle}>
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={() => dismissToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastType; onClose: () => void }> = ({ toast, onClose }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle size={18} color="var(--color-success)" />;
      case 'warning': return <AlertTriangle size={18} color="var(--color-warning)" />;
      case 'danger': return <AlertCircle size={18} color="var(--color-danger)" />;
      case 'info':
      default:
        return <Info size={18} color="var(--color-info)" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success': return 'var(--color-success)';
      case 'warning': return 'var(--color-warning)';
      case 'danger': return 'var(--color-danger)';
      case 'info':
      default:
        return 'var(--color-info)';
    }
  };

  return (
    <div style={{ ...itemStyle, borderLeft: `4px solid ${getBorderColor()}` }}>
      <div style={iconStyle}>{getIcon()}</div>
      <div style={messageStyle}>{toast.message}</div>
      <button onClick={onClose} style={closeButtonStyle} aria-label="Close notification">
        <X size={14} />
      </button>
    </div>
  );
};

// Inline CSS for clean module encapsulation
const containerStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '1.5rem',
  right: '1.5rem',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  maxWidth: '380px',
  width: 'calc(100% - 3rem)'
};

const itemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '1rem',
  background: 'rgba(18, 22, 33, 0.85)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '8px',
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
  animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
};

const iconStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '0.75rem',
  flexShrink: 0
};

const messageStyle: React.CSSProperties = {
  flexGrow: 1,
  fontSize: '0.9rem',
  fontWeight: 500,
  color: '#f3f4f6',
  paddingRight: '0.5rem',
  wordBreak: 'break-word'
};

const closeButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#9ca3af',
  padding: '0.25rem',
  borderRadius: '4px',
  transition: 'color 0.15s ease',
};
