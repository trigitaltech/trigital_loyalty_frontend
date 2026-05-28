/* e:\claude_repos\trigital\openloyalty-master\frontend-react\src\pages\UnifiedHub.tsx */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Landmark, Database, HelpCircle, ArrowRight } from 'lucide-react';
import suryaLogo from '../assets/Surya-Group-Logo.png';

export const UnifiedHub: React.FC = () => {
  const navigate = useNavigate();
  const { demoMode, setDemoMode, user, logout } = useAuth();

  const handleCardClick = (role: 'admin' | 'customer' | 'seller') => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div style={containerStyle}>
      {/* Dynamic Grid Background for Fintech Aesthetic */}
      <div style={gridBackgroundStyle}></div>

      {/* Floating Glowing Orbs */}
      <div style={orb1Style}></div>
      <div style={orb2Style}></div>

      {/* Top Banner Control Panel */}
      <div style={topBarStyle}>
        <div style={logoAreaStyle}>
          <img src={suryaLogo} alt="Surya Group Logo" style={{ height: '32px', marginRight: '0.5rem', borderRadius: '4px' }} />
          <span style={logoTextAccentStyle}>SURYA</span>
          <span style={logoTextSubStyle}>GROUP</span>
          <span style={badgeStyle}>v2.0 React</span>
        </div>

        <div style={connectionPanelStyle} className="glass-panel">
          <Database size={15} color={demoMode ? 'var(--color-warning)' : 'var(--color-success)'} />
          <span style={connectionLabelStyle}>
            Database Mode: <strong style={{ color: demoMode ? 'var(--color-warning)' : 'var(--color-success)' }}>
              {demoMode ? 'Offline Demo DB' : 'NestJS Server'}
            </strong>
          </span>
          <button 
            onClick={() => setDemoMode(!demoMode)} 
            style={{
              ...toggleButtonStyle,
              backgroundColor: demoMode ? 'var(--color-success)' : 'var(--color-warning)',
            }}
          >
            {demoMode ? 'Connect NestJS' : 'Enable Demo Mode'}
          </button>
        </div>
      </div>

      {/* Content Center */}
      <div style={contentAreaStyle}>
        <div style={headerAreaStyle}>
          <h1 style={titleStyle}>Surya Group Loyalty Cockpit</h1>
          <p style={subtitleStyle}>
            Welcome to the fully upgraded React & TypeScript loyalty engine. Choose a cockpit below to manage rewards, credit purchases, and claim coupons.
          </p>
        </div>

        {/* Roles Cards Grid */}
        <div style={cardsGridStyle}>
          
          {/* Card 1: Admin */}
          <div 
            onClick={() => handleCardClick('admin')} 
            style={{...cardStyle, '--glow-color': 'rgba(99, 102, 241, 0.4)'} as React.CSSProperties}
            className="glass-panel"
          >
            <div style={{ ...iconWrapperStyle, background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
              <Shield size={32} color="var(--admin-primary-hex)" />
            </div>
            <h2 style={cardTitleStyle}>Admin Cockpit</h2>
            <p style={cardDescStyle}>
              Configure earning rules, build dynamic segments, curate campaigns catalogs, and monitor global analytical trends.
            </p>
            <div style={{ ...actionLabelStyle, color: 'var(--admin-primary-hex)' }}>
              Enter Cockpit <ArrowRight size={16} />
            </div>
          </div>

          {/* Card 2: Participant */}
          <div 
            onClick={() => handleCardClick('customer')} 
            style={{...cardStyle, '--glow-color': 'rgba(16, 185, 129, 0.4)'} as React.CSSProperties}
            className="glass-panel"
          >
            <div style={{ ...iconWrapperStyle, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <User size={32} color="var(--customer-primary-hex)" />
            </div>
            <h2 style={cardTitleStyle}>Member Portal</h2>
            <p style={cardDescStyle}>
              Track wallet balance, view current membership levels (Bronze, Silver, Gold), and redeem points for promotional discount codes.
            </p>
            <div style={{ ...actionLabelStyle, color: 'var(--customer-primary-hex)' }}>
              Access Account <ArrowRight size={16} />
            </div>
          </div>

          {/* Card 3: POS Seller */}
          <div 
            onClick={() => handleCardClick('seller')} 
            style={{...cardStyle, '--glow-color': 'rgba(13, 148, 136, 0.4)'} as React.CSSProperties}
            className="glass-panel"
          >
            <div style={{ ...iconWrapperStyle, background: 'rgba(13, 148, 136, 0.15)', border: '1px solid rgba(13, 148, 136, 0.3)' }}>
              <Landmark size={32} color="var(--seller-primary-hex)" />
            </div>
            <h2 style={cardTitleStyle}>POS Terminal</h2>
            <p style={cardDescStyle}>
              Brick-and-mortar merchant cash desk terminal. Query member accounts, self-register guests, and post purchase invoice receipts.
            </p>
            <div style={{ ...actionLabelStyle, color: 'var(--seller-primary-hex)' }}>
              Open Terminal <ArrowRight size={16} />
            </div>
          </div>

        </div>

        {/* User Session Footer Banner */}
        {user && (
          <div style={sessionBannerStyle} className="glass-panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={avatarStyle}>{user.username[0].toUpperCase()}</div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Logged in as {user.username}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Role: {user.role.toUpperCase()}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={() => navigate(user.role === 'admin' ? '/admin' : user.role === 'customer' ? '/customer' : '/seller')}
                style={sessionGoButtonStyle}
              >
                Go to Active Cockpit
              </button>
              <button onClick={logout} style={sessionLogoutStyle}>Logout</button>
            </div>
          </div>
        )}
      </div>

      <div style={footerStyle}>
        <HelpCircle size={14} /> Surya Group Loyalty platform powered by React 18, Vite & NestJS TypeScript modules.
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  position: 'relative',
  minHeight: '100vh',
  width: '100vw',
  backgroundColor: 'var(--bg-app)',
  color: 'var(--text-primary)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflowX: 'hidden',
  padding: '2rem 1.5rem',
  boxSizing: 'border-box'
};

const gridBackgroundStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
  backgroundSize: '30px 30px',
  pointerEvents: 'none',
  zIndex: 0
};

const orb1Style: React.CSSProperties = {
  position: 'absolute',
  top: '15%',
  left: '10%',
  width: '400px',
  height: '400px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
  pointerEvents: 'none',
  zIndex: 0,
  filter: 'blur(40px)'
};

const orb2Style: React.CSSProperties = {
  position: 'absolute',
  bottom: '15%',
  right: '10%',
  width: '450px',
  height: '450px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
  pointerEvents: 'none',
  zIndex: 0,
  filter: 'blur(50px)'
};

const topBarStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  maxWidth: '1200px',
  zIndex: 1,
  marginBottom: '4rem',
  flexWrap: 'wrap',
  gap: '1.5rem'
};

const logoAreaStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  fontFamily: 'var(--font-title)',
  fontSize: '1.4rem',
  fontWeight: 800,
  letterSpacing: '-0.03em'
};

const logoTextAccentStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #a855f7, #6366f1)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const logoTextSubStyle: React.CSSProperties = {
  color: 'white',
};

const badgeStyle: React.CSSProperties = {
  fontSize: '0.65rem',
  padding: '0.2rem 0.5rem',
  borderRadius: '9999px',
  backgroundColor: 'rgba(255, 255, 255, 0.06)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: '#9ca3af',
  marginLeft: '0.5rem',
  fontWeight: 500
};

const connectionPanelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.5rem 1rem',
  fontSize: '0.85rem',
  borderRadius: '9999px',
  background: 'rgba(18, 22, 33, 0.5)'
};

const connectionLabelStyle: React.CSSProperties = {
  color: '#d1d5db',
};

const toggleButtonStyle: React.CSSProperties = {
  color: 'white',
  fontWeight: 600,
  fontSize: '0.75rem',
  padding: '0.35rem 0.75rem',
  borderRadius: '9999px',
  transition: 'transform 0.15s ease',
};

const contentAreaStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  maxWidth: '1200px',
  zIndex: 1,
  flexGrow: 1
};

const headerAreaStyle: React.CSSProperties = {
  textAlign: 'center',
  maxWidth: '700px',
  marginBottom: '3rem',
  animation: 'fadeIn 0.4s ease-out'
};

const titleStyle: React.CSSProperties = {
  fontSize: '3rem',
  fontFamily: 'var(--font-title)',
  fontWeight: 800,
  marginBottom: '1rem',
  background: 'linear-gradient(135deg, #ffffff 50%, #9ca3af 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '-0.04em'
};

const subtitleStyle: React.CSSProperties = {
  color: 'var(--text-secondary)',
  fontSize: '1.1rem',
  lineHeight: 1.6
};

const cardsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '2rem',
  width: '100%',
  marginBottom: '4rem',
  animation: 'fadeIn 0.5s ease-out'
};

const cardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  padding: '2.5rem',
  borderRadius: '16px',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  height: '360px',
  justifyContent: 'space-between',
};

const iconWrapperStyle: React.CSSProperties = {
  width: '64px',
  height: '64px',
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1.5rem'
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  color: 'white',
  marginBottom: '0.75rem',
  fontFamily: 'var(--font-title)'
};

const cardDescStyle: React.CSSProperties = {
  color: 'var(--text-secondary)',
  fontSize: '0.9rem',
  lineHeight: 1.6,
  flexGrow: 1,
  marginBottom: '1.5rem'
};

const actionLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontWeight: 600,
  fontSize: '0.95rem',
  transition: 'transform 0.2s ease',
};

const sessionBannerStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '750px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 1.5rem',
  borderRadius: '12px',
  marginTop: '1rem',
  flexWrap: 'wrap',
  gap: '1rem'
};

const avatarStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #a855f7, #6366f1)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: '0.95rem'
};

const sessionGoButtonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  backgroundColor: '#6366f1',
  borderRadius: '6px',
  color: 'white',
  fontSize: '0.85rem',
  fontWeight: 600,
};

const sessionLogoutStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  borderRadius: '6px',
  color: '#f87171',
  fontSize: '0.85rem',
  fontWeight: 600,
};

const footerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  marginTop: 'auto',
  paddingTop: '2rem',
  zIndex: 1
};
