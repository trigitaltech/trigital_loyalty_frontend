/* e:\claude_repos\trigital\openloyalty-master\frontend-react\src\pages\Login.tsx */
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Shield, User, Landmark, Key, Mail } from 'lucide-react';

export const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, user } = useAuth();

  // Determine current role gate
  const roleParam = searchParams.get('role') || 'admin';
  const role = (['admin', 'customer', 'seller'].includes(roleParam) ? roleParam : 'admin') as 'admin' | 'customer' | 'seller';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If already logged in with this role, redirect directly
  useEffect(() => {
    if (user && user.role === role) {
      navigate(role === 'admin' ? '/admin' : role === 'customer' ? '/customer' : '/seller');
    }
  }, [user, role, navigate]);

  // Pre-filled credentials mapping for swift developer testing
  const getPreFilledCredentials = () => {
    switch (role) {
      case 'customer':
        return { user: 'dev@openloyalty.io', pass: 'open' };
      case 'seller':
        return { user: 'seller', pass: 'open' };
      case 'admin':
      default:
        return { user: 'admin', pass: 'open' };
    }
  };

  const handleQuickFill = () => {
    const creds = getPreFilledCredentials();
    setUsername(creds.user);
    setPassword(creds.pass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setSubmitting(true);
    try {
      await login(username, password, role);
      navigate(role === 'admin' ? '/admin' : role === 'customer' ? '/customer' : '/seller');
    } catch (err) {
      // Notification is pushed by AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  // Color theme helpers based on current role
  const getThemeColor = () => {
    if (role === 'customer') return 'var(--customer-primary-hex)';
    if (role === 'seller') return 'var(--seller-primary-hex)';
    return 'var(--admin-primary-hex)';
  };

  const getRoleTitle = () => {
    if (role === 'customer') return 'Member Portal';
    if (role === 'seller') return 'POS Terminal';
    return 'Admin Cockpit';
  };

  const getRoleIcon = () => {
    if (role === 'customer') return <User size={24} color="var(--customer-primary-hex)" />;
    if (role === 'seller') return <Landmark size={24} color="var(--seller-primary-hex)" />;
    return <Shield size={24} color="var(--admin-primary-hex)" />;
  };

  return (
    <div style={containerStyle}>
      <div style={gridBackgroundStyle}></div>

      {/* Floating Ambient Glow */}
      <div style={{
        ...ambientGlowStyle,
        background: `radial-gradient(circle, ${getThemeColor()}1a 0%, transparent 70%)`
      }}></div>

      <div style={contentCardWrapperStyle}>
        {/* Back Button */}
        <button onClick={() => navigate('/')} style={backButtonStyle}>
          <ArrowLeft size={16} /> Back to Cockpits
        </button>

        {/* Login Card */}
        <div style={{ ...loginCardStyle, borderTop: `4px solid ${getThemeColor()}` }} className="glass-panel animate-fade-in">
          {/* Header */}
          <div style={cardHeaderStyle}>
            <div style={{ ...iconContainerStyle, background: `${getThemeColor()}15` }}>
              {getRoleIcon()}
            </div>
            <h2 style={cardTitleStyle}>{getRoleTitle()} Login</h2>
            <p style={cardSubtitleStyle}>Enter your africanLoyalty account credentials to proceed.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                {role === 'customer' ? 'Email Address' : 'Username'}
              </label>
              <div style={inputContainerStyle}>
                <div style={inputIconStyle}>
                  {role === 'customer' ? <Mail size={16} color="#6b7280" /> : <User size={16} color="#6b7280" />}
                </div>
                <input
                  type={role === 'customer' ? 'email' : 'text'}
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder={role === 'customer' ? 'dev@openloyalty.io' : 'Enter username'}
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Password</label>
              <div style={inputContainerStyle}>
                <div style={inputIconStyle}>
                  <Key size={16} color="#6b7280" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Quick pre-fill helper */}
            <div style={quickFillPanelStyle}>
              <span style={quickFillLabelStyle}>Testing credentials available:</span>
              <button type="button" onClick={handleQuickFill} style={{ ...quickFillButtonStyle, color: getThemeColor() }}>
                Auto-fill {getPreFilledCredentials().user}
              </button>
            </div>

            {/* Action Button */}
            <button 
              type="submit" 
              disabled={submitting}
              style={{
                ...submitButtonStyle,
                background: getThemeColor(),
                boxShadow: `0 4px 15px -3px ${getThemeColor()}40`
              }}
            >
              {submitting ? <div className="spinner" style={{ margin: '0 auto' }}></div> : 'Authenticate'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  position: 'relative',
  minHeight: '100vh',
  width: '100vw',
  backgroundColor: 'var(--bg-app)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '1.5rem',
  boxSizing: 'border-box',
  overflow: 'hidden'
};

const gridBackgroundStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
  backgroundSize: '25px 25px',
  pointerEvents: 'none',
  zIndex: 0
};

const ambientGlowStyle: React.CSSProperties = {
  position: 'absolute',
  width: '600px',
  height: '600px',
  borderRadius: '50%',
  pointerEvents: 'none',
  zIndex: 0,
  filter: 'blur(60px)'
};

const contentCardWrapperStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '440px',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem'
};

const backButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: 'var(--text-secondary)',
  fontSize: '0.9rem',
  fontWeight: 500,
  alignSelf: 'flex-start',
  transition: 'color 0.15s ease',
};

const loginCardStyle: React.CSSProperties = {
  padding: '2.5rem',
  borderRadius: '16px',
  background: 'rgba(18, 22, 33, 0.8)',
  boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.7)'
};

const cardHeaderStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '2rem'
};

const iconContainerStyle: React.CSSProperties = {
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 1rem'
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  color: 'white',
  fontFamily: 'var(--font-title)',
  marginBottom: '0.5rem'
};

const cardSubtitleStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.4
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem'
};

const formGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  fontWeight: 600,
  color: '#e5e7eb',
  letterSpacing: '0.01em'
};

const inputContainerStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center'
};

const inputIconStyle: React.CSSProperties = {
  position: 'absolute',
  left: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none'
};

const inputStyle: React.CSSProperties = {
  paddingLeft: '2.75rem',
  background: '#0e111a',
  border: '1px solid rgba(255, 255, 255, 0.08)',
};

const quickFillPanelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  padding: '0.75rem',
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.04)',
  borderRadius: '8px',
  fontSize: '0.75rem',
  marginTop: '0.25rem'
};

const quickFillLabelStyle: React.CSSProperties = {
  color: 'var(--text-secondary)'
};

const quickFillButtonStyle: React.CSSProperties = {
  fontWeight: 600,
  cursor: 'pointer',
  textAlign: 'left',
  padding: '0.1rem 0'
};

const submitButtonStyle: React.CSSProperties = {
  color: 'white',
  fontWeight: 700,
  fontSize: '1rem',
  padding: '0.85rem',
  borderRadius: '8px',
  marginTop: '0.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.15s ease, opacity 0.15s ease',
};
