import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, User, Landmark, LogOut, Home, 
  BarChart3, Users, Settings2, Gift, Sliders,
  Wallet, Tag, History, Calculator, ClipboardList, Menu, X
} from 'lucide-react';
import suryaLogo from '../assets/Surya-Group-Logo.png';
import { ThemeToggle } from '../components/ThemeToggle';

// --- ADMIN LAYOUT ---
export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login?role=admin');
    }
  }, [user, navigate]);

  if (!user) return null;

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <BarChart3 size={18} /> },
    { name: 'Loyalty Members', path: '/admin/customers', icon: <Users size={18} /> },
    { name: 'Sellers / POS', path: '/admin/sellers', icon: <Landmark size={18} /> },
    { name: 'Earning Rules', path: '/admin/rules', icon: <Settings2 size={18} /> },
    { name: 'Rewards Campaigns', path: '/admin/campaigns', icon: <Gift size={18} /> },
    { name: 'Customer Segments', path: '/admin/segments', icon: <Sliders size={18} /> },
  ];

  return (
    <div style={adminContainerStyle}>
      {/* Sidebar Panel */}
      <aside style={sidebarStyle} className={`admin-sidebar-nav glass-panel ${mobileOpen ? 'active' : ''}`}>
        <div style={sidebarHeaderStyle}>
          <div style={logoWrapperStyle}>
            <img src={suryaLogo} alt="Surya Logo" style={{ height: '24px', borderRadius: '4px' }} />
            <span style={logoTextStyle}>Admin Cockpit</span>
          </div>
          <button style={mobileCloseBtnStyle} className="admin-sidebar-close-btn" onClick={() => setMobileOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav style={sidebarNavStyle}>
          {menuItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                onClick={() => setMobileOpen(false)}
                style={{
                  ...navItemStyle,
                  background: active ? 'rgba(99, 102, 241, 0.1)' : undefined,
                  borderLeft: active ? '3px solid var(--admin-primary-hex)' : '3px solid transparent',
                  color: active ? 'white' : 'var(--text-secondary)'
                }}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div style={sidebarFooterStyle}>
          <div style={userInfoStyle}>
            <div style={avatarStyle}>{user.username[0].toUpperCase()}</div>
            <div style={userMetaStyle}>
              <span style={usernameStyle}>{user.username}</span>
              <span style={roleBadgeStyle}>Administrator</span>
            </div>
          </div>
          <button onClick={logout} style={logoutButtonStyle}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div style={mainAreaStyle} className="admin-main-area-content">
        <header style={topHeaderStyle} className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button style={burgerStyle} className="admin-burger-toggle-btn" onClick={() => setMobileOpen(true)}>
              <Menu size={20} />
            </button>
            <h2 style={headerTitleStyle}>System Management Platform</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ThemeToggle />
            <Link to="/" style={hubLinkStyle}><Home size={16} /> Cockpit Hub</Link>
          </div>
        </header>

        <main style={bodyContentStyle}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// --- CUSTOMER LAYOUT ---
export const CustomerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user || user.role !== 'customer') {
      navigate('/login?role=customer');
    }
  }, [user, navigate]);

  if (!user) return null;

  const menuItems = [
    { name: 'My Wallet', path: '/customer', icon: <Wallet size={16} /> },
    { name: 'Redeem Rewards', path: '/customer/catalog', icon: <Tag size={16} /> },
    { name: 'My Ledger', path: '/customer/transactions', icon: <History size={16} /> },
  ];

  return (
    <div style={customerContainerStyle}>
      <header style={customerHeaderStyle} className="customer-navbar-header glass-panel">
        <div style={{ ...logoWrapperStyle, alignItems: 'center' }}>
          <img src={suryaLogo} alt="Surya Logo" style={{ height: '24px', borderRadius: '4px' }} />
          <span style={customerLogoTextStyle}>Member Portal</span>
        </div>

        <nav style={customerNavStyle} className="customer-nav-items">
          {menuItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                style={{
                  ...customerNavItemStyle,
                  color: active ? 'var(--customer-primary-hex)' : 'var(--text-secondary)',
                  borderBottom: active ? '2px solid var(--customer-primary-hex)' : '2px solid transparent'
                }}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div style={customerActionsStyle}>
          <ThemeToggle />
          <Link to="/" style={hubLinkStyle}><Home size={14} /> Hub</Link>
          <button onClick={logout} style={customerLogoutBtnStyle} aria-label="Logout"><LogOut size={16} /></button>
        </div>
      </header>

      <main style={customerMainStyle}>
        <Outlet />
      </main>
    </div>
  );
};

// --- SELLER LAYOUT ---
export const SellerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user || user.role !== 'seller') {
      navigate('/login?role=seller');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div style={sellerContainerStyle}>
      <header style={sellerHeaderStyle} className="seller-navbar-header glass-panel">
        <div style={{ ...logoWrapperStyle, alignItems: 'center' }}>
          <img src={suryaLogo} alt="Surya Logo" style={{ height: '24px', borderRadius: '4px' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={sellerLogoTextStyle}>POS Terminal</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--seller-primary-hex)', fontWeight: 600 }}>
              Cashier: {user.username} {user.posLocation ? `(${user.posLocation})` : ''}
            </span>
          </div>
        </div>

        <div style={sellerNavStyle} className="seller-nav-links">
          <Link 
            to="/seller" 
            style={{
              ...sellerLinkStyle,
              background: location.pathname === '/seller' ? 'rgba(13, 148, 136, 0.15)' : undefined,
              borderColor: location.pathname === '/seller' ? 'var(--seller-primary-hex)' : 'transparent',
              color: location.pathname === '/seller' ? 'white' : 'var(--text-secondary)'
            }}
          >
            <Calculator size={16} /> Cash Counter
          </Link>
          <Link 
            to="/seller/transactions" 
            style={{
              ...sellerLinkStyle,
              background: location.pathname === '/seller/transactions' ? 'rgba(13, 148, 136, 0.15)' : undefined,
              borderColor: location.pathname === '/seller/transactions' ? 'var(--seller-primary-hex)' : 'transparent',
              color: location.pathname === '/seller/transactions' ? 'white' : 'var(--text-secondary)'
            }}
          >
            <ClipboardList size={16} /> Historic Reciepts
          </Link>
        </div>

        <div style={customerActionsStyle}>
          <ThemeToggle />
          <Link to="/" style={hubLinkStyle}><Home size={14} /> Hub</Link>
          <button onClick={logout} style={customerLogoutBtnStyle} aria-label="Logout"><LogOut size={16} /></button>
        </div>
      </header>

      <main style={sellerMainStyle}>
        <Outlet />
      </main>
    </div>
  );
};

// --- CSS STYLING OBJECTS ---

// Admin Styles
const adminContainerStyle: React.CSSProperties = {
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: 'var(--bg-app)'
};

const sidebarStyle: React.CSSProperties = {
  width: '260px',
  height: '100vh',
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  zIndex: 100,
  background: '#0d1017',
  display: 'flex',
  flexDirection: 'column',
  padding: '1.5rem',
  borderRight: '1px solid rgba(255, 255, 255, 0.08)',
  boxSizing: 'border-box',
  transition: 'left var(--transition-normal)'
};

const sidebarHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '2rem'
};

const logoWrapperStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

const logoTextStyle: React.CSSProperties = {
  fontWeight: 700,
  fontFamily: 'var(--font-title)',
  fontSize: '1.05rem',
  color: 'white'
};

const mobileCloseBtnStyle: React.CSSProperties = {
  display: 'none', // Overridden in mobile views if media query triggers
  color: '#9ca3af',
  padding: '0.25rem'
};

const sidebarNavStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  flexGrow: 1
};

const navItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.75rem 1rem',
  borderRadius: '6px',
  fontSize: '0.9rem',
  fontWeight: 500,
  transition: 'all 0.15s ease',
};

const sidebarFooterStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
  paddingTop: '1rem'
};

const userInfoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

const avatarStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #a855f7, #6366f1)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: '0.85rem'
};

const userMetaStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const usernameStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  fontWeight: 600,
  color: 'white'
};

const roleBadgeStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  color: 'var(--text-secondary)'
};

const logoutButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  width: '100%',
  padding: '0.6rem',
  background: 'rgba(239, 68, 68, 0.08)',
  border: '1px solid rgba(239, 68, 68, 0.15)',
  borderRadius: '6px',
  color: '#f87171',
  fontSize: '0.8rem',
  fontWeight: 600,
};

const mainAreaStyle: React.CSSProperties = {
  flexGrow: 1,
  marginLeft: '260px',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box'
};

const topHeaderStyle: React.CSSProperties = {
  height: '64px',
  width: '100%',
  background: 'rgba(18, 22, 33, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 2rem',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  boxSizing: 'border-box'
};

const headerTitleStyle: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 600,
  color: 'white',
  fontFamily: 'var(--font-sans)',
  letterSpacing: '0.01em'
};

const burgerStyle: React.CSSProperties = {
  display: 'none', // Show in mobile responsive layout
  color: '#d1d5db',
  cursor: 'pointer'
};

const hubLinkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.8rem',
  fontWeight: 500,
  padding: '0.4rem 0.8rem',
  borderRadius: '9999px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  color: 'var(--text-secondary)',
  transition: 'all 0.15s ease',
};

const bodyContentStyle: React.CSSProperties = {
  padding: '2rem',
  flexGrow: 1,
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto'
};

// Customer Styles
const customerContainerStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: 'var(--bg-app)',
  display: 'flex',
  flexDirection: 'column'
};

const customerHeaderStyle: React.CSSProperties = {
  height: '70px',
  background: '#0d1017',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 2rem',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  boxSizing: 'border-box',
  zIndex: 10
};

const customerLogoTextStyle: React.CSSProperties = {
  fontWeight: 700,
  fontFamily: 'var(--font-title)',
  fontSize: '1.1rem',
  color: 'white'
};

const customerNavStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1.5rem',
  height: '100%'
};

const customerNavItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.9rem',
  fontWeight: 600,
  padding: '0 0.5rem',
  height: '100%',
  transition: 'all 0.15s ease',
};

const customerActionsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem'
};

const customerLogoutBtnStyle: React.CSSProperties = {
  color: '#ef4444',
  padding: '0.4rem',
  borderRadius: '6px',
  background: 'rgba(239, 68, 68, 0.05)',
  border: '1px solid rgba(239, 68, 68, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const customerMainStyle: React.CSSProperties = {
  padding: '2.5rem 2rem',
  width: '100%',
  maxWidth: '1000px',
  margin: '0 auto',
  flexGrow: 1,
  boxSizing: 'border-box'
};

// Seller Styles
const sellerContainerStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: 'var(--bg-app)',
  display: 'flex',
  flexDirection: 'column'
};

const sellerHeaderStyle: React.CSSProperties = {
  height: '70px',
  background: '#0d1017',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 2rem',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  boxSizing: 'border-box',
  zIndex: 10
};

const sellerLogoTextStyle: React.CSSProperties = {
  fontWeight: 700,
  fontFamily: 'var(--font-title)',
  fontSize: '1.1rem',
  color: 'white'
};

const sellerNavStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem'
};

const sellerLinkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  fontSize: '0.85rem',
  fontWeight: 600,
  border: '1px solid transparent',
  transition: 'all 0.15s ease',
};

const sellerMainStyle: React.CSSProperties = {
  padding: '2.5rem 2rem',
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  flexGrow: 1,
  boxSizing: 'border-box'
};
