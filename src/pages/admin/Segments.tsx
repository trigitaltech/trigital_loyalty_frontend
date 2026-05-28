/* e:\claude_repos\trigital\openloyalty-master\frontend-react\src\pages\admin\Segments.tsx */
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Sliders, ShieldAlert, Award, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSegments: React.FC = () => {
  const { showToast } = useAuth();
  const [segments, setSegments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSegments = async () => {
    setLoading(true);
    try {
      const data = await api.getSegments();
      setSegments(data);
    } catch (e) {
      showToast('Failed to retrieve customer segments info', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSegments();
  }, []);

  return (
    <div style={containerStyle} className="animate-fade-in">
      <div style={titleRowStyle}>
        <div>
          <h1 style={titleStyle}>Dynamic Customer Segments</h1>
          <p style={subtitleStyle}>Analyze dynamically calculated member clusters segmented by active point thresholds.</p>
        </div>
      </div>

      {/* Segments table and cards */}
      <div style={tableContainerStyle} className="glass-panel">
        {loading ? (
          <div style={loaderStyle}>
            <div className="spinner" style={{ borderTopColor: 'var(--admin-primary-hex)' }}></div>
          </div>
        ) : segments.length === 0 ? (
          <div style={noDataStyle}>
            <ShieldAlert size={36} color="var(--text-muted)" />
            <p>No active segments detected.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={gridTableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Segment Name</th>
                  <th style={thStyle}>Target Segment Description</th>
                  <th style={thStyle}>Minimum Point Eligibility</th>
                  <th style={thStyle}>Active Qualified Members</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Evaluation Matrix</th>
                </tr>
              </thead>
              <tbody>
                {segments.map(s => (
                  <tr key={s.id} style={trStyle}>
                    <td style={{ ...tdStyle, fontWeight: 600, color: 'white' }}>
                      {s.name}
                    </td>
                    <td style={{ ...tdStyle, fontSize: '0.85rem' }}>{s.description}</td>
                    <td style={{ ...tdStyle, color: 'var(--admin-primary-hex)', fontWeight: 700 }}>
                      &ge; {s.minPoints} pts
                    </td>
                    <td style={tdStyle}>
                      <span style={membersBadgeStyle}>
                        <UserCheck size={12} /> {s.customerCount} qualified
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <span style={formulaStyle}>
                        active_balance &ge; {s.minPoints} <ArrowRight size={10} /> Qualified
                      </span>
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

const membersBadgeStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 700,
  padding: '0.2rem 0.5rem',
  borderRadius: '4px',
  backgroundColor: 'rgba(16, 185, 129, 0.1)',
  border: '1px solid rgba(16, 185, 129, 0.2)',
  color: 'var(--color-success)',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem'
};

const formulaStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontFamily: 'monospace',
  color: 'var(--text-muted)',
  backgroundColor: 'rgba(0,0,0,0.2)',
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem'
};
