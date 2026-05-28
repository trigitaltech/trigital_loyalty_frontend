/* e:\claude_repos\trigital\openloyalty-master\frontend-react\src\pages\customer\Transactions.tsx */
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { History, ShieldAlert, Calendar } from 'lucide-react';

export const CustomerTransactions: React.FC = () => {
  const { user, showToast } = useAuth();
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransfers = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await api.getTransfers(user.id);
      setTransfers(data);
    } catch (e) {
      showToast('Failed to fetch transfers history logs', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, [user]);

  return (
    <div style={containerStyle} className="animate-fade-in">
      <div style={titleRowStyle}>
        <div>
          <h1 style={titleStyle}>My Wallet Ledger</h1>
          <p style={subtitleStyle}>Auditing transcript of all point deposits, purchases rewards, and active claims.</p>
        </div>
      </div>

      {/* Ledger Card */}
      <div style={tableContainerStyle} className="glass-panel">
        {loading ? (
          <div style={loaderStyle}>
            <div className="spinner" style={{ borderTopColor: 'var(--customer-primary-hex)' }}></div>
          </div>
        ) : transfers.length === 0 ? (
          <div style={noDataStyle}>
            <ShieldAlert size={36} color="var(--text-muted)" />
            <p>No historical transfers recorded for this loyalty wallet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={gridTableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Date & Time</th>
                  <th style={thStyle}>Transaction Description</th>
                  <th style={thStyle}>Action Type</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Ledger Mutation</th>
                </tr>
              </thead>
              <tbody>
                {transfers.slice().reverse().map(t => {
                  const isCredit = t.type === 'credit';
                  return (
                    <tr key={t.id} style={trStyle}>
                      <td style={tdStyle}>
                        <span style={dateStyle}>
                          <Calendar size={12} /> {new Date(t.createdAt).toLocaleString()}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, color: 'white', fontWeight: 500 }}>
                        {t.description}
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          ...badgeStyle,
                          backgroundColor: isCredit ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: isCredit ? 'var(--color-success)' : 'var(--color-danger)'
                        }}>
                          {isCredit ? 'DEPOSIT CREDIT' : 'REWARD REDEEM'}
                        </span>
                      </td>
                      <td style={{
                        ...tdStyle,
                        textAlign: 'right',
                        fontWeight: 700,
                        color: isCredit ? 'var(--color-success)' : 'var(--color-danger)'
                      }}>
                        {isCredit ? '+' : '-'}{t.amount} pts
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
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
  fontSize: '2.25rem',
  fontFamily: 'var(--font-title)',
  color: 'white',
  fontWeight: 800,
  letterSpacing: '-0.03em'
};

const subtitleStyle: React.CSSProperties = {
  color: 'var(--text-secondary)',
  fontSize: '0.95rem'
};

const tableContainerStyle: React.CSSProperties = {
  padding: '1.5rem',
  background: 'rgba(18, 22, 33, 0.4)',
  borderRadius: '14px',
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

const dateStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.85rem',
  color: 'var(--text-secondary)'
};

const badgeStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 700,
  padding: '0.2rem 0.5rem',
  borderRadius: '4px',
  display: 'inline-flex'
};
