/* e:\claude_repos\trigital\openloyalty-master\frontend-react\src\pages\admin\Customers.tsx */
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Users, Search, UserCheck, Calendar, Phone, Award, ShieldAlert, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/Modal';

export const AdminCustomers: React.FC = () => {
  const { showToast } = useAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Detail Modal State
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loadingTransfers, setLoadingTransfers] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await api.getCustomers();
      setCustomers(data);
    } catch (e) {
      showToast('Failed to fetch loyalty member directory', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleOpenDetails = async (customer: any) => {
    setSelectedCustomer(customer);
    setLoadingTransfers(true);
    try {
      const data = await api.getTransfers(customer.id);
      setTransfers(data);
    } catch (e) {
      showToast('Failed to fetch point history', 'danger');
    } finally {
      setLoadingTransfers(false);
    }
  };

  const filtered = customers.filter(c => {
    const term = searchQuery.toLowerCase();
    const fullName = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
    return (
      c.email?.toLowerCase().includes(term) ||
      fullName.includes(term) ||
      c.phone?.includes(term)
    );
  });

  const getTierBadgeStyle = (tier: string): React.CSSProperties => {
    const base: React.CSSProperties = {
      fontSize: '0.75rem',
      fontWeight: 700,
      padding: '0.2rem 0.6rem',
      borderRadius: '9999px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      textTransform: 'uppercase'
    };

    if (tier === 'Gold') {
      return {
        ...base,
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        color: '#fbbf24',
        boxShadow: '0 0 10px rgba(245, 158, 11, 0.15)'
      };
    }
    if (tier === 'Silver') {
      return {
        ...base,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        color: '#34d399',
        boxShadow: '0 0 10px rgba(16, 185, 129, 0.15)'
      };
    }
    return {
      ...base,
      backgroundColor: 'rgba(156, 163, 175, 0.1)',
      border: '1px solid rgba(156, 163, 175, 0.25)',
      color: '#d1d5db'
    };
  };

  return (
    <div style={containerStyle} className="animate-fade-in">
      <div style={titleRowStyle}>
        <div>
          <h1 style={titleStyle}>Loyalty Member Directory</h1>
          <p style={subtitleStyle}>Analyze customer wallets, tier ladders, and ledger mutation logs.</p>
        </div>
      </div>

      {/* Filter and Table Card */}
      <div style={tableContainerStyle} className="glass-panel">
        <div style={filterRowStyle}>
          <div style={searchWrapperStyle}>
            <Search size={16} color="#6b7280" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by member name, email or phone..."
              style={searchInputStyle}
            />
          </div>
          <span style={countLabelStyle}>Showing {filtered.length} of {customers.length} records</span>
        </div>

        {loading ? (
          <div style={loaderStyle}>
            <div className="spinner" style={{ borderTopColor: 'var(--admin-primary-hex)' }}></div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={noDataStyle}>
            <ShieldAlert size={36} color="var(--text-muted)" />
            <p>No loyalty members match your query filters.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={gridTableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Full Name</th>
                  <th style={thStyle}>Loyalty Email</th>
                  <th style={thStyle}>Active Balance</th>
                  <th style={thStyle}>Ladders Level</th>
                  <th style={thStyle}>Mobile Phone</th>
                  <th style={thStyle}>Joined On</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} style={trStyle}>
                    <td style={{ ...tdStyle, fontWeight: 600, color: 'white' }}>
                      {c.firstName} {c.lastName}
                    </td>
                    <td style={tdStyle}>{c.email}</td>
                    <td style={{ ...tdStyle, color: 'var(--admin-accent-hex)', fontWeight: 700 }}>
                      {c.points.toLocaleString()} pts
                    </td>
                    <td style={tdStyle}>
                      <span style={getTierBadgeStyle(c.level)}>
                        <Award size={12} /> {c.level}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {c.phone ? (
                        <span style={phoneStyle}><Phone size={12} /> {c.phone}</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <span style={dateStyle}><Calendar size={12} /> {new Date(c.joinedAt).toLocaleDateString()}</span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <button onClick={() => handleOpenDetails(c)} style={actionBtnStyle}>
                        View Ledger
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details & Audit Logs Modal */}
      <Modal
        isOpen={selectedCustomer !== null}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}'s Wallet Audit` : ''}
        footerButtons={
          <button onClick={() => setSelectedCustomer(null)} style={modalCloseBtnStyle}>Close Ledger</button>
        }
      >
        {selectedCustomer && (
          <div style={modalBodyStyle}>
            {/* Meta */}
            <div style={modalMetaGridStyle} className="modal-meta-grid-3col">
              <div style={metaCardStyle}>
                <span style={metaLabelStyle}>Member ID</span>
                <span style={metaValStyle}>{selectedCustomer.id}</span>
              </div>
              <div style={metaCardStyle}>
                <span style={metaLabelStyle}>Point Balance</span>
                <span style={{ ...metaValStyle, color: 'var(--color-success)', fontWeight: 700 }}>
                  {selectedCustomer.points} pts
                </span>
              </div>
              <div style={metaCardStyle}>
                <span style={metaLabelStyle}>Tier Tier Status</span>
                <span style={{ ...metaValStyle, color: 'var(--color-warning)' }}>{selectedCustomer.level}</span>
              </div>
            </div>

            {/* Audit log list */}
            <h4 style={auditHeaderStyle}><Layers size={14} /> Historical Points Transfers Ledger</h4>

            {loadingTransfers ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                <div className="spinner"></div>
              </div>
            ) : transfers.length === 0 ? (
              <p style={noAuditStyle}>No point transfers have been logged for this wallet.</p>
            ) : (
              <div style={ledgerListStyle}>
                {transfers.slice().reverse().map((t: any) => {
                  const isCredit = t.type === 'credit';
                  return (
                    <div key={t.id} style={ledgerItemStyle}>
                      <div style={ledgerLeftStyle}>
                        <span style={{
                          ...ledgerSignStyle,
                          backgroundColor: isCredit ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: isCredit ? 'var(--color-success)' : 'var(--color-danger)'
                        }}>
                          {isCredit ? '+' : '-'}{t.amount}
                        </span>
                        <div style={ledgerDescBoxStyle}>
                          <span style={ledgerDescStyle}>{t.description}</span>
                          <span style={ledgerTimeStyle}>{new Date(t.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

// --- CSS STYLES ---
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

const tableContainerStyle: React.CSSProperties = {
  padding: '1.5rem',
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
  fontSize: '0.9rem'
};

const thStyle: React.CSSProperties = {
  padding: '1rem',
  color: 'var(--text-secondary)',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  fontWeight: 600
};

const trStyle: React.CSSProperties = {
  borderBottom: '1px solid rgba(255,255,255,0.04)',
  transition: 'background-color 0.15s ease'
};

const tdStyle: React.CSSProperties = {
  padding: '1rem',
  color: '#cbd5e1'
};

const phoneStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  fontSize: '0.85rem'
};

const dateStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  fontSize: '0.85rem',
  color: 'var(--text-secondary)'
};

const actionBtnStyle: React.CSSProperties = {
  backgroundColor: 'rgba(99, 102, 241, 0.1)',
  border: '1px solid rgba(99, 102, 241, 0.2)',
  borderRadius: '6px',
  color: '#c7d2fe',
  fontSize: '0.8rem',
  padding: '0.4rem 0.8rem',
  fontWeight: 600,
};

// Modal Styles
const modalCloseBtnStyle: React.CSSProperties = {
  padding: '0.5rem 1.25rem',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '6px',
  color: 'white',
  fontSize: '0.85rem',
  fontWeight: 600,
};

const modalBodyStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  width: '100%'
};

const modalMetaGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '0.75rem',
};

const metaCardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  padding: '0.75rem',
  backgroundColor: '#0a0d14',
  border: '1px solid rgba(255,255,255,0.05)',
  borderRadius: '8px',
};

const metaLabelStyle: React.CSSProperties = {
  fontSize: '0.65rem',
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  marginBottom: '0.25rem'
};

const metaValStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'white',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
};

const auditHeaderStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  gap: '0.35rem',
  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  paddingBottom: '0.5rem'
};

const noAuditStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '2rem 0',
  color: 'var(--text-muted)',
  fontSize: '0.85rem'
};

const ledgerListStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  maxHeight: '260px',
  overflowY: 'auto'
};

const ledgerItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.75rem',
  backgroundColor: '#0d1017',
  border: '1px solid rgba(255,255,255,0.03)',
  borderRadius: '8px'
};

const ledgerLeftStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  width: '100%'
};

const ledgerSignStyle: React.CSSProperties = {
  width: '42px',
  height: '24px',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
  fontWeight: 700,
  flexShrink: 0
};

const ledgerDescBoxStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.15rem',
  flexGrow: 1
};

const ledgerDescStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: '#e2e8f0',
  fontWeight: 500
};

const ledgerTimeStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  color: 'var(--text-muted)'
};
