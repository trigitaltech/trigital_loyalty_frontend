/* e:\claude_repos\trigital\openloyalty-master\frontend-react\src\pages\admin\Campaigns.tsx */
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Gift, Plus, ShieldAlert, Tag, Ticket, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/Modal';

export const AdminCampaigns: React.FC = () => {
  const { showToast } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Wizard State
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [costInPoints, setCostInPoints] = useState<number>(50);
  const [couponsInput, setCouponsInput] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const data = await api.getCampaigns();
      setCampaigns(data);
    } catch (e) {
      showToast('Failed to fetch rewards campaign catalog', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !shortDescription || costInPoints <= 0) return;
    
    const coupons = couponsInput
      .split(',')
      .map(c => c.trim().toUpperCase())
      .filter(c => c.length > 0);

    if (coupons.length === 0) {
      showToast('Please specify at least one promotional coupon code for the reward pool.', 'warning');
      return;
    }

    setSaving(true);
    try {
      await api.createCampaign({
        name,
        shortDescription,
        costInPoints,
        coupons
      });
      showToast('Reward campaign successfully introduced', 'success');
      setModalOpen(false);

      // Reset
      setName('');
      setShortDescription('');
      setCostInPoints(50);
      setCouponsInput('');

      fetchCampaigns();
    } catch (e) {
      showToast('Failed to establish campaign', 'danger');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={containerStyle} className="animate-fade-in">
      <div style={titleRowStyle}>
        <div>
          <h1 style={titleStyle}>Rewards Catalog Campaigns</h1>
          <p style={subtitleStyle}>Manage promotional digital loyalty rewards, claimed coupon keys, and point costs.</p>
        </div>
        <button onClick={() => setModalOpen(true)} style={addButtonStyle}>
          <Plus size={16} /> Establish New Reward
        </button>
      </div>

      {/* Grid List */}
      {loading ? (
        <div style={loaderStyle}>
          <div className="spinner" style={{ borderTopColor: 'var(--admin-primary-hex)' }}></div>
        </div>
      ) : campaigns.length === 0 ? (
        <div style={noDataStyle} className="glass-panel">
          <ShieldAlert size={36} color="var(--text-muted)" />
          <p>No active reward campaigns configured. Click the button above to launch one.</p>
        </div>
      ) : (
        <div style={cardsGridStyle}>
          {campaigns.map(c => {
            const availableCount = c.coupons.length - c.claimedCoupons.length;
            const progress = (c.claimedCoupons.length / c.coupons.length) * 100;
            
            return (
              <div key={c.id} style={cardStyle} className="glass-panel">
                <div style={cardTopStyle}>
                  <div style={iconBoxStyle}>
                    <Gift size={20} color="var(--admin-accent-hex)" />
                  </div>
                  <span style={pointsBadgeStyle}>{c.costInPoints} pts</span>
                </div>

                <div style={cardMainStyle}>
                  <h3 style={cardTitleStyle}>{c.name}</h3>
                  <p style={cardDescStyle}>{c.shortDescription}</p>
                </div>

                <div style={cardFooterStyle}>
                  {/* Coupon Inventory */}
                  <div style={progressBoxStyle}>
                    <div style={progressLabelStyle}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Ticket size={12} /> Claimed Coupons
                      </span>
                      <span>{c.claimedCoupons.length} / {c.coupons.length}</span>
                    </div>
                    
                    {/* Visual Progress Bar */}
                    <div style={barBgStyle}>
                      <div style={{ ...barFgStyle, width: `${progress}%` }}></div>
                    </div>

                    <div style={stockIndicatorStyle}>
                      <span style={{ color: availableCount === 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                        {availableCount === 0 ? 'Out of Stock' : `${availableCount} vouchers left`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Wizard Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Establish New Reward Campaign"
        footerButtons={
          <>
            <button onClick={() => setModalOpen(false)} style={modalCancelBtnStyle}>Cancel</button>
            <button 
              onClick={handleSubmit} 
              disabled={saving}
              style={modalSubmitBtnStyle}
            >
              {saving ? <div className="spinner"></div> : 'Launch Reward'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Reward Campaign Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. VIP Metal Water Bottle"
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Short Description</label>
            <textarea
              value={shortDescription}
              onChange={e => setShortDescription(e.target.value)}
              placeholder="Give a beautiful description of what customer gets"
              required
              rows={3}
              style={{ resize: 'none' }}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Redemption Point Cost</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Ticket size={16} color="#6b7280" style={{ position: 'absolute', left: '1rem' }} />
              <input
                type="number"
                value={costInPoints}
                onChange={e => setCostInPoints(Number(e.target.value))}
                min="10"
                required
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Promotional Codes Pool <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(Comma-separated)</span>
            </label>
            <input
              type="text"
              value={couponsInput}
              onChange={e => setCouponsInput(e.target.value)}
              placeholder="e.g. GOLD-VOUCHER1, GOLD-VOUCHER2, GOLD-VOUCHER3"
              required
            />
            <span style={hintStyle}><HelpCircle size={10} /> Commas split multiple codes to build an active voucher pool.</span>
          </div>
        </form>
      </Modal>
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

const addButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.65rem 1.25rem',
  backgroundColor: 'var(--admin-primary-hex)',
  borderRadius: '8px',
  color: 'white',
  fontWeight: 700,
  fontSize: '0.85rem',
  boxShadow: '0 4px 15px rgba(99,102,241,0.25)',
  transition: 'transform 0.15s ease',
};

const loaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  padding: '4rem 0'
};

const noDataStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '4rem 2rem',
  color: 'var(--text-secondary)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem'
};

const cardsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1.5rem',
  width: '100%'
};

const cardStyle: React.CSSProperties = {
  padding: '1.5rem',
  background: 'rgba(18, 22, 33, 0.4)',
  borderRadius: '12px',
  display: 'flex',
  flexDirection: 'column',
  height: '280px',
};

const cardTopStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem'
};

const iconBoxStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  background: 'rgba(168, 85, 247, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const pointsBadgeStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 700,
  color: 'var(--admin-accent-hex)',
  backgroundColor: 'rgba(168, 85, 247, 0.08)',
  border: '1px solid rgba(168, 85, 247, 0.15)',
  padding: '0.2rem 0.5rem',
  borderRadius: '6px'
};

const cardMainStyle: React.CSSProperties = {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: '1.15rem',
  color: 'white',
  fontFamily: 'var(--font-title)'
};

const cardDescStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.4,
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical'
};

const cardFooterStyle: React.CSSProperties = {
  borderTop: '1px solid rgba(255,255,255,0.04)',
  paddingTop: '0.75rem',
  marginTop: 'auto'
};

const progressBoxStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem'
};

const progressLabelStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.75rem',
  color: 'var(--text-secondary)'
};

const barBgStyle: React.CSSProperties = {
  width: '100%',
  height: '4px',
  backgroundColor: 'rgba(255,255,255,0.06)',
  borderRadius: '9999px',
  overflow: 'hidden'
};

const barFgStyle: React.CSSProperties = {
  height: '100%',
  backgroundColor: 'var(--admin-accent-hex)',
  borderRadius: '9999px'
};

const stockIndicatorStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 600,
  textAlign: 'right'
};

// Wizard Form Styles
const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
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

const hintStyle: React.CSSProperties = {
  fontSize: '0.65rem',
  color: 'var(--text-muted)',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.2rem'
};

const modalCancelBtnStyle: React.CSSProperties = {
  padding: '0.5rem 1.25rem',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '6px',
  color: 'white',
  fontSize: '0.85rem',
  fontWeight: 600,
};

const modalSubmitBtnStyle: React.CSSProperties = {
  padding: '0.5rem 1.25rem',
  backgroundColor: 'var(--admin-primary-hex)',
  borderRadius: '6px',
  color: 'white',
  fontSize: '0.85rem',
  fontWeight: 700,
  boxShadow: '0 4px 12px rgba(99,102,241,0.2)'
};
