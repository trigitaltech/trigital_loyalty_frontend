/* e:\claude_repos\trigital\openloyalty-master\frontend-react\src\pages\seller\Transactions.tsx */
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ClipboardList, ShieldAlert, Calendar, User, CreditCard } from 'lucide-react';

export const SellerTransactions: React.FC = () => {
  const { showToast } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await api.getTransactions();
      setTransactions(data);
    } catch (e) {
      showToast('Failed to fetch historic POS receipts', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div style={containerStyle} className="animate-fade-in">
      <div style={titleRowStyle}>
        <div>
          <h1 style={titleStyle}>POS Uploaded Receipts Logs</h1>
          <p style={subtitleStyle}>Auditing transcript of all brick-and-mortar purchase transactions posted by cashier desks.</p>
        </div>
      </div>

      {/* Receipts table */}
      <div style={tableContainerStyle} className="glass-panel">
        {loading ? (
          <div style={loaderStyle}>
            <div className="spinner" style={{ borderTopColor: 'var(--seller-primary-hex)' }}></div>
          </div>
        ) : transactions.length === 0 ? (
          <div style={noDataStyle}>
            <ShieldAlert size={36} color="var(--text-muted)" />
            <p>No historical purchase transactions have been posted yet today.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={gridTableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Date & Time</th>
                  <th style={thStyle}>Invoice Doc Serial</th>
                  <th style={thStyle}>Assigned loyalty Member</th>
                  <th style={thStyle}>Receipt Basket Total</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Points Awarded</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice().reverse().map(t => (
                  <tr key={t.id} style={trStyle}>
                    <td style={tdStyle}>
                      <span style={dateStyle}>
                        <Calendar size={12} /> {new Date(t.createdAt).toLocaleString()}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, color: 'white', fontWeight: 600 }}>
                      {t.documentNumber}
                    </td>
                    <td style={tdStyle}>
                      <span style={memberStyle}>
                        <User size={12} /> {t.customerName}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>
                      ${t.grossValue}
                    </td>
                    <td style={{
                      ...tdStyle,
                      textAlign: 'right',
                      fontWeight: 700,
                      color: 'var(--color-success)'
                    }}>
                      +{t.pointsAwarded} pts
                    </td>
                  </tr>
                ))}
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

const memberStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.85rem',
  color: 'white'
};
