/* e:\claude_repos\trigital\openloyalty-master\frontend-react\src\pages\admin\Dashboard.tsx */
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Coins, ShoppingBag, Users, Share2, Calendar, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { showToast } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (e) {
      showToast('Failed to fetch analytics statistics', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div style={loaderContainerStyle}>
        <div className="spinner" style={{ width: '40px', height: '40px', borderTopColor: 'var(--admin-primary-hex)' }}></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading analytics engine...</p>
      </div>
    );
  }

  // Calculate SVG line points for daily registrations
  const regData = Object.entries(stats.registrations || {}).map(([date, count]) => ({
    date: date.substring(5), // MM-DD
    count: count as number
  }));

  const maxVal = Math.max(...regData.map(d => d.count), 2);
  const width = 500;
  const height = 150;
  const padding = 20;
  
  const points = regData.map((d, index) => {
    const x = padding + (index * (width - padding * 2)) / (regData.length - 1);
    const y = height - padding - (d.count * (height - padding * 2)) / maxVal;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `
    ${padding},${height - padding} 
    ${points} 
    ${width - padding},${height - padding}
  `;

  return (
    <div style={containerStyle} className="animate-fade-in">
      {/* Top Title and Actions */}
      <div style={titleRowStyle}>
        <div>
          <h1 style={titleStyle}>Marketing Analytics</h1>
          <p style={subtitleStyle}>Real-time campaign performance and member engagement indicators.</p>
        </div>
        <button onClick={fetchStats} style={refreshButtonStyle}>
          <RefreshCw size={14} /> Refresh metrics
        </button>
      </div>

      {/* Grid Stats */}
      <div style={statsGridStyle}>
        
        {/* Card 1: Active Points */}
        <div style={cardStyle} className="glass-panel">
          <div style={cardContentStyle}>
            <span style={cardLabelStyle}>Active Points Ledger</span>
            <span style={cardValStyle}>{stats.points.totalPointsActive.toLocaleString()} pts</span>
            <span style={cardFooterStyle}>Issued: {stats.points.totalPointsIssued.toLocaleString()} | Spent: {stats.points.totalPointsSpent.toLocaleString()}</span>
          </div>
          <div style={{ ...iconStyle, background: 'rgba(99, 102, 241, 0.12)' }}>
            <Coins size={22} color="var(--admin-primary-hex)" />
          </div>
        </div>

        {/* Card 2: Sales Value */}
        <div style={cardStyle} className="glass-panel">
          <div style={cardContentStyle}>
            <span style={cardLabelStyle}>Gross POS Sales</span>
            <span style={cardValStyle}>${stats.transactions.totalTransactionsValue.toLocaleString()}</span>
            <span style={cardFooterStyle}>Avg Basket: ${Math.round(stats.transactions.averageGrossValue)} | Tx: {stats.transactions.totalTransactionsCount}</span>
          </div>
          <div style={{ ...iconStyle, background: 'rgba(168, 85, 247, 0.12)' }}>
            <ShoppingBag size={22} color="var(--admin-accent-hex)" />
          </div>
        </div>

        {/* Card 3: Loyalty Customers */}
        <div style={cardStyle} className="glass-panel">
          <div style={cardContentStyle}>
            <span style={cardLabelStyle}>Total Loyalty Members</span>
            <span style={cardValStyle}>{stats.customers.totalCustomersCount} members</span>
            <span style={cardFooterStyle}>Active Wallets: {stats.customers.activeCustomersCount} ({Math.round((stats.customers.activeCustomersCount / stats.customers.totalCustomersCount) * 100)}%)</span>
          </div>
          <div style={{ ...iconStyle, background: 'rgba(16, 185, 129, 0.12)' }}>
            <Users size={22} color="var(--color-success)" />
          </div>
        </div>

        {/* Card 4: Referrals */}
        <div style={cardStyle} className="glass-panel">
          <div style={cardContentStyle}>
            <span style={cardLabelStyle}>Referral Actions</span>
            <span style={cardValStyle}>{stats.referral.totalReferralsCount} invites</span>
            <span style={cardFooterStyle}>Awarded: {stats.referral.totalPointsAwarded} points</span>
          </div>
          <div style={{ ...iconStyle, background: 'rgba(245, 158, 11, 0.12)' }}>
            <Share2 size={22} color="var(--color-warning)" />
          </div>
        </div>

      </div>

      {/* Analytics Chart Row */}
      <div style={chartRowStyle} className="glass-panel">
        <div style={chartHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} color="var(--admin-primary-hex)" />
            <h3 style={chartTitleStyle}>New Member Registration Timeline</h3>
          </div>
          <span style={chartBadgeStyle}>Last 7 Days</span>
        </div>

        <div style={chartWrapperStyle}>
          <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
            <defs>
              <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--admin-primary-hex)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="var(--admin-primary-hex)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
            <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.1)" />

            {/* Area Path */}
            <polygon points={areaPoints} fill="url(#regGrad)" />

            {/* Line Path */}
            <polyline
              fill="none"
              stroke="var(--admin-primary-hex)"
              strokeWidth="3"
              points={points}
            />

            {/* Dots */}
            {regData.map((d, index) => {
              const x = padding + (index * (width - padding * 2)) / (regData.length - 1);
              const y = height - padding - (d.count * (height - padding * 2)) / maxVal;
              return (
                <g key={index}>
                  <circle cx={x} cy={y} r="5" fill="var(--bg-app)" stroke="var(--admin-primary-hex)" strokeWidth="2" />
                  <text x={x} y={y - 8} fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">
                    {d.count > 0 ? d.count : ''}
                  </text>
                  <text x={x} y={height - 4} fontSize="8" fill="#6b7280" textAnchor="middle">
                    {d.date}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

const loaderContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '60vh',
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem'
};

const titleRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1rem'
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

const refreshButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  padding: '0.5rem 1rem',
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  color: '#e5e7eb',
  fontSize: '0.8rem',
  fontWeight: 600,
  transition: 'all 0.15s ease',
};

const statsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '1.5rem'
};

const cardStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1.5rem',
  borderRadius: '12px',
  background: 'rgba(18, 22, 33, 0.4)'
};

const cardContentStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem'
};

const cardLabelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const cardValStyle: React.CSSProperties = {
  fontSize: '1.6rem',
  fontWeight: 700,
  color: 'white',
  fontFamily: 'var(--font-title)'
};

const cardFooterStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  color: 'var(--text-muted)'
};

const iconStyle: React.CSSProperties = {
  width: '42px',
  height: '42px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const chartRowStyle: React.CSSProperties = {
  padding: '2rem',
  borderRadius: '14px',
  background: 'rgba(18, 22, 33, 0.3)',
};

const chartHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.5rem'
};

const chartTitleStyle: React.CSSProperties = {
  fontSize: '1.1rem',
  color: 'white',
  fontFamily: 'var(--font-title)'
};

const chartBadgeStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  padding: '0.2rem 0.6rem',
  borderRadius: '9999px',
  backgroundColor: 'rgba(99, 102, 241, 0.1)',
  border: '1px solid rgba(99, 102, 241, 0.2)',
  color: 'var(--admin-primary-hex)',
  fontWeight: 600
};

const chartWrapperStyle: React.CSSProperties = {
  width: '100%',
  maxHeight: '260px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};
