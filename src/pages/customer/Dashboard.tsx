/* e:\claude_repos\trigital\openloyalty-master\frontend-react\src\pages\customer\Dashboard.tsx */
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Award, Wallet, ArrowUpRight, Zap, Target, Star } from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { user, showToast } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [level, setLevel] = useState<'Bronze' | 'Silver' | 'Gold'>('Bronze');
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomerData = async () => {
    if (!user || !user.id) return;
    setLoading(true);
    try {
      // Rehydrate customer wallet
      const customersList = await api.getCustomers();
      const match = customersList.find(c => c.id === user.id);
      if (match) {
        setBalance(match.points);
        setLevel(match.level);
      }
      
      const transferLogs = await api.getTransfers(user.id);
      setTransfers(transferLogs);
    } catch (e) {
      showToast('Failed to sync wallet balances', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [user]);

  if (loading) {
    return (
      <div style={loaderContainerStyle}>
        <div className="spinner" style={{ width: '40px', height: '40px', borderTopColor: 'var(--customer-primary-hex)' }}></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Opening your loyalty secure vault...</p>
      </div>
    );
  }

  // --- Tier Threshold Math ---
  const thresholds = { Bronze: 0, Silver: 200, Gold: 500 };
  let nextLevel = 'Gold';
  let nextThreshold = thresholds.Gold;
  let prevThreshold = thresholds.Silver;
  
  if (level === 'Bronze') {
    nextLevel = 'Silver';
    nextThreshold = thresholds.Silver;
    prevThreshold = thresholds.Bronze;
  } else if (level === 'Gold') {
    nextLevel = 'Highest Tier!';
    nextThreshold = thresholds.Gold;
    prevThreshold = thresholds.Silver;
  }

  const pointsToNext = level === 'Gold' ? 0 : nextThreshold - balance;
  const progressPercent = level === 'Gold' 
    ? 100 
    : Math.min(100, Math.max(0, ((balance - prevThreshold) / (nextThreshold - prevThreshold)) * 100));

  const getTierIcon = () => {
    if (level === 'Gold') return <Star size={24} color="#fbbf24" />;
    if (level === 'Silver') return <Award size={24} color="#34d399" />;
    return <Zap size={24} color="#d1d5db" />;
  };

  return (
    <div style={containerStyle} className="animate-fade-in">
      
      {/* Welcome Banner */}
      <div style={welcomeRowStyle}>
        <div>
          <h1 style={titleStyle}>Welcome back, {user?.username.split('@')[0]}!</h1>
          <p style={subtitleStyle}>Check your wallet balance and browse active rewards available for claim.</p>
        </div>
      </div>

      {/* Main Stats Row */}
      <div style={dashboardGridStyle}>
        
        {/* Wallet Balance Card */}
        <div style={walletCardStyle} className="glass-panel">
          <div style={walletLeftStyle}>
            <div style={walletIconBoxStyle}>
              <Wallet size={26} color="var(--customer-primary-hex)" />
            </div>
            <div style={walletLabelBoxStyle}>
              <span style={walletLabelStyle}>Loyalty Points Balance</span>
              <span style={walletValStyle}>{balance.toLocaleString()} <span style={{ fontSize: '1.25rem', fontWeight: 500 }}>pts</span></span>
            </div>
          </div>
          <div style={walletAccentBoxStyle}>
            <span style={levelTextLabelStyle}>Membership status</span>
            <span style={{ ...levelValueStyle, color: level === 'Gold' ? '#fbbf24' : level === 'Silver' ? '#34d399' : 'white' }}>
              {getTierIcon()} {level}
            </span>
          </div>
        </div>

        {/* Milestone Tier Progress Card */}
        <div style={progressCardStyle} className="glass-panel">
          <div style={progressCardHeaderStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={18} color="var(--customer-accent-hex)" />
              <h3 style={progressCardTitleStyle}>Membership Ladder Progress</h3>
            </div>
            {level !== 'Gold' && (
              <span style={progressRemainingStyle}>{pointsToNext} points to {nextLevel}</span>
            )}
          </div>

          <div style={progressBarContainerStyle}>
            <div style={progressBarBgStyle}>
              <div style={{ ...progressBarFgStyle, width: `${progressPercent}%` }}></div>
            </div>
            <div style={milestonesLabelsStyle}>
              <span style={{ fontWeight: level === 'Bronze' ? 700 : 500, color: level === 'Bronze' ? 'white' : '#6b7280' }}>Bronze (0)</span>
              <span style={{ fontWeight: level === 'Silver' ? 700 : 500, color: level === 'Silver' ? 'white' : '#6b7280' }}>Silver (200)</span>
              <span style={{ fontWeight: level === 'Gold' ? 700 : 500, color: level === 'Gold' ? 'white' : '#6b7280' }}>Gold (500)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Actions / Recent Activity Summary */}
      <div style={bottomPanelStyle} className="glass-panel">
        <h3 style={bottomTitleStyle}><ArrowUpRight size={16} /> Dashboard Tips</h3>
        <div style={tipsGridStyle}>
          <div style={tipCardStyle}>
            <span style={tipTitleStyle}>Claim Coupons</span>
            <p style={tipDescStyle}>Points can be spent inside the <strong>Redeem Rewards</strong> catalog to instantly claim digital vouchers.</p>
          </div>
          <div style={tipCardStyle}>
            <span style={tipTitleStyle}>Earn More Points</span>
            <p style={tipDescStyle}>Give your Member email ID (<strong>{user?.username}</strong>) to cashiers when checkout-shopping to award points!</p>
          </div>
          <div style={tipCardStyle}>
            <span style={tipTitleStyle}>Level Progression</span>
            <p style={tipDescStyle}>Earning points automatically climbs your membership ladder to unlock premium reward opportunities.</p>
          </div>
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

const welcomeRowStyle: React.CSSProperties = {
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

const dashboardGridStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem'
};

const walletCardStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '2rem',
  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(18, 22, 33, 0.4) 100%)',
  borderRadius: '16px',
  border: '1px solid rgba(16, 185, 129, 0.15)',
  flexWrap: 'wrap',
  gap: '1.5rem'
};

const walletLeftStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.25rem'
};

const walletIconBoxStyle: React.CSSProperties = {
  width: '56px',
  height: '56px',
  borderRadius: '12px',
  background: 'rgba(16, 185, 129, 0.15)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const walletLabelBoxStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem'
};

const walletLabelStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const walletValStyle: React.CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 800,
  color: 'white',
  fontFamily: 'var(--font-title)',
  lineHeight: 1
};

const walletAccentBoxStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '0.25rem'
};

const levelTextLabelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const levelValueStyle: React.CSSProperties = {
  fontSize: '1.35rem',
  fontWeight: 700,
  fontFamily: 'var(--font-title)',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
};

const progressCardStyle: React.CSSProperties = {
  padding: '2rem',
  background: 'rgba(18, 22, 33, 0.4)',
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem'
};

const progressCardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '0.5rem'
};

const progressCardTitleStyle: React.CSSProperties = {
  fontSize: '1.1rem',
  color: 'white',
  fontFamily: 'var(--font-title)'
};

const progressRemainingStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--customer-accent-hex)',
  fontWeight: 600,
  backgroundColor: 'rgba(245, 158, 11, 0.08)',
  border: '1px solid rgba(245, 158, 11, 0.15)',
  padding: '0.2rem 0.6rem',
  borderRadius: '9999px'
};

const progressBarContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem'
};

const progressBarBgStyle: React.CSSProperties = {
  width: '100%',
  height: '10px',
  backgroundColor: 'rgba(255,255,255,0.06)',
  borderRadius: '9999px',
  overflow: 'hidden'
};

const progressBarFgStyle: React.CSSProperties = {
  height: '100%',
  background: 'linear-gradient(90deg, var(--customer-primary-hex), var(--customer-accent-hex))',
  borderRadius: '9999px',
  transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
};

const milestonesLabelsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.75rem',
  color: 'var(--text-secondary)',
  fontWeight: 500
};

const bottomPanelStyle: React.CSSProperties = {
  padding: '2rem',
  background: 'rgba(18, 22, 33, 0.2)',
  borderRadius: '16px'
};

const bottomTitleStyle: React.CSSProperties = {
  fontSize: '1.1rem',
  color: 'white',
  fontFamily: 'var(--font-title)',
  marginBottom: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.35rem'
};

const tipsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '1.5rem'
};

const tipCardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  padding: '1.25rem',
  backgroundColor: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.04)',
  borderRadius: '10px'
};

const tipTitleStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  fontWeight: 700,
  color: 'white'
};

const tipDescStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.5
};
