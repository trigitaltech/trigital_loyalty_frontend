import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Landmark, Plus, Search, ShieldAlert, UserCheck, Calendar, MapPin, Key, UserPlus } from 'lucide-react';

interface Seller {
  id: string;
  username: string;
  name: string;
  posLocation: string;
  joinedAt: string;
  active: boolean;
}

export const AdminSellers: React.FC = () => {
  const { showToast } = useAuth();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [posLocation, setPosLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const data = await api.getSellers();
      setSellers(data);
    } catch (e) {
      showToast('Failed to load cashier list', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleCreateSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !name || !posLocation) {
      showToast('Please fill out all required fields.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      await api.createSeller({
        username,
        password: password || 'open',
        name,
        posLocation
      });
      showToast(`POS Cashier "${name}" onboarded successfully!`, 'success');
      
      // Reset Form
      setUsername('');
      setPassword('');
      setName('');
      setPosLocation('');
      
      // Refresh list
      fetchSellers();
    } catch (err: any) {
      showToast(err.message || 'Failed to onboard POS register cashier.', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const updated = await api.toggleSeller(id);
      showToast(
        `Cashier account status updated: ${updated.active ? 'Activated' : 'Deactivated'}`, 
        'info'
      );
      fetchSellers();
    } catch (err) {
      showToast('Failed to modify cashier account status', 'danger');
    }
  };

  const filtered = sellers.filter(s => {
    const query = searchQuery.toLowerCase();
    return (
      s.username.toLowerCase().includes(query) ||
      s.name.toLowerCase().includes(query) ||
      s.posLocation.toLowerCase().includes(query)
    );
  });

  return (
    <div style={containerStyle} className="animate-fade-in">
      <div style={titleRowStyle}>
        <div>
          <h1 style={titleStyle}>POS Onboarding & Cashier Registry</h1>
          <p style={subtitleStyle}>Manage merchant checkout outlet terminals, onboard sales cashiers, and toggle terminal credentials.</p>
        </div>
      </div>

      <div style={layoutGridStyle} className="terminal-grid-2col">
        {/* Onboard Form */}
        <div style={formCardStyle} className="glass-panel">
          <h3 style={sectionTitleStyle}><UserPlus size={18} color="var(--admin-primary-hex)" /> Onboard New POS / Seller</h3>
          <form onSubmit={handleCreateSeller} style={formStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Full Name / Operator Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Rohith Sen"
                required
                style={inputStyle}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>POS Terminal Location / Outlet *</label>
              <div style={inputWithIconStyle}>
                <MapPin size={16} color="#6b7280" style={inputIconStyle} />
                <input
                  type="text"
                  value={posLocation}
                  onChange={e => setPosLocation(e.target.value)}
                  placeholder="e.g. East Bangalore Branch"
                  required
                  style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Cashier Username *</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="e.g. surya_sales_east"
                required
                style={inputStyle}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Security Password (Defaults to "open")</label>
              <div style={inputWithIconStyle}>
                <Key size={16} color="#6b7280" style={inputIconStyle} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting} 
              style={{
                ...submitButtonStyle,
                background: 'var(--admin-primary-hex)',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.2)'
              }}
            >
              {submitting ? <div className="spinner"></div> : 'Register POS Cashier'}
            </button>
          </form>
        </div>

        {/* Sellers Directory List */}
        <div style={tableContainerStyle} className="glass-panel">
          <div style={filterRowStyle}>
            <div style={searchWrapperStyle}>
              <Search size={16} color="#6b7280" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter by cashier, outlet or username..."
                style={searchInputStyle}
              />
            </div>
            <span style={countLabelStyle}>Showing {filtered.length} of {sellers.length} outlets</span>
          </div>

          {loading ? (
            <div style={loaderStyle}>
              <div className="spinner" style={{ borderTopColor: 'var(--admin-primary-hex)' }}></div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={noDataStyle}>
              <ShieldAlert size={36} color="var(--text-muted)" />
              <p>No sales outlet cashier registries match your query filters.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={gridTableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Cashier Name</th>
                    <th style={thStyle}>Username</th>
                    <th style={thStyle}>Outlet / Location</th>
                    <th style={thStyle}>Registered</th>
                    <th style={thStyle}>Status</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id} style={trStyle}>
                      <td style={{ ...tdStyle, fontWeight: 600, color: 'white' }}>
                        {s.name}
                      </td>
                      <td style={tdStyle}>
                        <span style={usernameBadgeStyle}>{s.username}</span>
                      </td>
                      <td style={tdStyle}>
                        <span style={outletSpanStyle}><Landmark size={12} /> {s.posLocation}</span>
                      </td>
                      <td style={tdStyle}>
                        <span style={dateStyle}><Calendar size={12} /> {new Date(s.joinedAt).toLocaleDateString()}</span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          ...statusBadgeStyle,
                          backgroundColor: s.active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          border: s.active ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                          color: s.active ? '#34d399' : '#f87171'
                        }}>
                          {s.active ? 'Active Outlet' : 'Deactivated'}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>
                        <button 
                          onClick={() => handleToggleStatus(s.id)} 
                          style={{
                            ...actionBtnStyle,
                            backgroundColor: s.active ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            border: s.active ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)',
                            color: s.active ? '#f87171' : '#34d399'
                          }}
                        >
                          {s.active ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- CSS STYLING ---
const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem'
};

const titleRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const titleStyle: React.CSSProperties = {
  fontSize: '2rem',
  fontFamily: 'var(--font-title)',
  color: 'white',
  fontWeight: 800
};

const subtitleStyle: React.CSSProperties = {
  color: 'var(--text-secondary)',
  fontSize: '0.9rem'
};

const layoutGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '4fr 7fr',
  gap: '1.5rem',
  alignItems: 'flex-start'
};

const formCardStyle: React.CSSProperties = {
  padding: '1.75rem',
  background: 'rgba(18, 22, 33, 0.4)',
  borderRadius: '14px',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '1.15rem',
  color: 'white',
  fontFamily: 'var(--font-title)',
  marginBottom: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  paddingBottom: '0.5rem'
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem'
};

const formGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem'
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#cbd5e1'
};

const inputStyle: React.CSSProperties = {
  background: '#0d1017',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  color: 'white'
};

const inputWithIconStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center'
};

const inputIconStyle: React.CSSProperties = {
  position: 'absolute',
  left: '1rem',
  pointerEvents: 'none'
};

const submitButtonStyle: React.CSSProperties = {
  padding: '0.8rem',
  borderRadius: '8px',
  color: 'white',
  fontWeight: 700,
  fontSize: '0.9rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '0.5rem',
  transition: 'transform 0.15s ease'
};

const tableContainerStyle: React.CSSProperties = {
  padding: '1.75rem',
  background: 'rgba(18, 22, 33, 0.4)',
  borderRadius: '14px',
};

const filterRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.5rem',
  gap: '1rem',
  flexWrap: 'wrap'
};

const searchWrapperStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  maxWidth: '420px',
  width: '100%'
};

const searchInputStyle: React.CSSProperties = {
  paddingLeft: '2.5rem',
  background: '#0d1017',
  border: '1px solid rgba(255,255,255,0.06)',
  color: 'white'
};

const countLabelStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--text-muted)'
};

const loaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  padding: '3rem 0'
};

const noDataStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '4rem 0',
  color: 'var(--text-secondary)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem'
};

const gridTableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left',
  fontSize: '0.85rem'
};

const thStyle: React.CSSProperties = {
  padding: '0.85rem',
  color: 'var(--text-secondary)',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  fontWeight: 600
};

const trStyle: React.CSSProperties = {
  borderBottom: '1px solid rgba(255,255,255,0.04)',
  transition: 'background-color 0.15s ease'
};

const tdStyle: React.CSSProperties = {
  padding: '0.85rem',
  color: '#cbd5e1'
};

const usernameBadgeStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '0.8rem',
  backgroundColor: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  padding: '0.15rem 0.4rem',
  borderRadius: '4px',
  color: 'white'
};

const outletSpanStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  color: 'white'
};

const dateStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  color: 'var(--text-secondary)'
};

const statusBadgeStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 600,
  padding: '0.15rem 0.5rem',
  borderRadius: '9999px',
};

const actionBtnStyle: React.CSSProperties = {
  borderRadius: '6px',
  fontSize: '0.75rem',
  padding: '0.3rem 0.6rem',
  fontWeight: 600,
};
