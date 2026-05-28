/* e:\claude_repos\trigital\openloyalty-master\frontend-react\src\pages\customer\Catalog.tsx */
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Gift, HelpCircle, Ticket, ShieldAlert, Check, Copy } from 'lucide-react';
import { Modal } from '../../components/Modal';

export const CustomerCatalog: React.FC = () => {
  const { user, showToast } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Redemption Confirmation Modal
  const [targetReward, setTargetReward] = useState<any | null>(null);
  const [claiming, setClaiming] = useState(false);

  // Success Ticket Modal
  const [claimedCode, setClaimedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchCatalogData = async () => {
    if (!user || !user.id) return;
    setLoading(true);
    try {
      const camps = await api.getCampaigns();
      setCampaigns(camps);

      const customersList = await api.getCustomers();
      const match = customersList.find(c => c.id === user.id);
      if (match) {
        setBalance(match.points);
      }
    } catch (e) {
      showToast('Failed to load campaigns store', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogData();
  }, [user]);

  const handleRedeemClick = (reward: any) => {
    setTargetReward(reward);
  };

  const handleConfirmRedemption = async () => {
    if (!user?.id || !targetReward) return;

    setClaiming(true);
    try {
      const res = await api.claimReward(user.id, targetReward.id);
      if (res.success) {
        showToast(res.message || 'Reward claimed successfully!', 'success');
        setClaimedCode(res.couponCode);
        setTargetReward(null);
        fetchCatalogData(); // Sync points and stocks
      }
    } catch (e: any) {
      showToast(e.message || 'Points spend redemption failed', 'danger');
      setTargetReward(null);
    } finally {
      setClaiming(false);
    }
  };

  const handleCopyCode = () => {
    if (!claimedCode) return;
    navigator.clipboard.writeText(claimedCode);
    setCopied(true);
    showToast('Promo code copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={containerStyle} className="animate-fade-in">
      <div style={titleRowStyle}>
        <div>
          <h1 style={titleStyle}>Spend Points Store</h1>
          <p style={subtitleStyle}>Exchange accumulated loyalty points to unlock unique gift cards and products.</p>
        </div>
        <div style={balanceBadgeStyle}>
          <Ticket size={16} /> My Balance: <strong style={{ color: 'white', marginLeft: '0.25rem' }}>{balance} pts</strong>
        </div>
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div style={loaderStyle}>
          <div className="spinner" style={{ borderTopColor: 'var(--customer-primary-hex)' }}></div>
        </div>
      ) : campaigns.length === 0 ? (
        <div style={noDataStyle} className="glass-panel">
          <ShieldAlert size={36} color="var(--text-muted)" />
          <p>No rewards campaigns are currently active in catalog.</p>
        </div>
      ) : (
        <div style={cardsGridStyle}>
          {campaigns.map(c => {
            const availableCount = c.coupons.length - c.claimedCoupons.length;
            const canAfford = balance >= c.costInPoints;
            const outOfStock = availableCount <= 0;
            const pointsNeeded = c.costInPoints - balance;

            return (
              <div key={c.id} style={cardStyle} className="glass-panel">
                <div style={cardTopStyle}>
                  <div style={iconBoxStyle}>
                    <Gift size={20} color="var(--customer-primary-hex)" />
                  </div>
                  <span style={pointsBadgeStyle}>{c.costInPoints} pts</span>
                </div>

                <div style={cardMainStyle}>
                  <h3 style={cardTitleStyle}>{c.name}</h3>
                  <p style={cardDescStyle}>{c.shortDescription}</p>
                </div>

                <div style={cardFooterStyle}>
                  <div style={stockIndicatorStyle}>
                    {outOfStock ? (
                      <span style={{ color: 'var(--color-danger)', fontSize: '0.75rem', fontWeight: 600 }}>Out of Stock</span>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{availableCount} vouchers left</span>
                    )}
                  </div>

                  {outOfStock ? (
                    <button disabled style={redeemButtonDisabledStyle}>Sold Out</button>
                  ) : !canAfford ? (
                    <button disabled style={redeemButtonDisabledStyle}>
                      Need {pointsNeeded} pts
                    </button>
                  ) : (
                    <button onClick={() => handleRedeemClick(c)} style={redeemButtonStyle}>
                      Redeem Reward
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={targetReward !== null}
        onClose={() => setTargetReward(null)}
        title="Confirm Point Spend Redemption"
        footerButtons={
          <>
            <button onClick={() => setTargetReward(null)} style={modalCancelBtnStyle} disabled={claiming}>Cancel</button>
            <button onClick={handleConfirmRedemption} style={modalSubmitBtnStyle} disabled={claiming}>
              {claiming ? <div className="spinner"></div> : 'Confirm Exchange'}
            </button>
          </>
        }
      >
        {targetReward && (
          <div style={modalBodyStyle}>
            <p>Are you sure you want to spend <strong style={{ color: 'var(--customer-primary-hex)' }}>{targetReward.costInPoints} points</strong> to claim the following reward?</p>
            
            <div style={rewardSummaryBoxStyle}>
              <h4 style={rewardSummaryTitleStyle}>{targetReward.name}</h4>
              <p style={rewardSummaryDescStyle}>{targetReward.shortDescription}</p>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              * Upon confirmation, points will be deducted from your wallet ledger and the voucher code will be issued.
            </p>
          </div>
        )}
      </Modal>

      {/* Success Vouchers Ticket Modal */}
      <Modal
        isOpen={claimedCode !== null}
        onClose={() => setClaimedCode(null)}
        title="Reward Claimed Successfully!"
        footerButtons={
          <button onClick={() => setClaimedCode(null)} style={ticketCloseBtnStyle}>Done</button>
        }
      >
        {claimedCode && (
          <div style={ticketBodyStyle}>
            <p style={ticketSuccessLabelStyle}>Congratulations! Your promo code has been unlocked:</p>
            
            {/* Promo Code Coupon Ticket */}
            <div style={ticketContainerStyle}>
              <div style={ticketLeftCircleStyle}></div>
              <div style={ticketRightCircleStyle}></div>
              
              <div style={ticketContentStyle}>
                <span style={ticketHeaderLabelStyle}>LOYALTY CLAIM COUPON</span>
                <span style={ticketCodeStyle}>{claimedCode}</span>
                <button onClick={handleCopyCode} style={copyButtonStyle}>
                  {copied ? <Check size={14} color="var(--color-success)" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy Voucher Code'}
                </button>
              </div>
            </div>

            <p style={ticketHintStyle}>
              Please present this voucher code to merchant POS terminal checkouts or key in at e-commerce gateways to claim your reward.
            </p>
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
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1rem'
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

const balanceBadgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.9rem',
  fontWeight: 600,
  padding: '0.5rem 1rem',
  borderRadius: '9999px',
  background: 'rgba(16, 185, 129, 0.1)',
  border: '1px solid rgba(16, 185, 129, 0.2)',
  color: 'var(--customer-primary-hex)'
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
  background: 'rgba(16, 185, 129, 0.12)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const pointsBadgeStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 700,
  color: 'var(--customer-primary-hex)',
  backgroundColor: 'rgba(16, 185, 129, 0.08)',
  border: '1px solid rgba(16, 185, 129, 0.15)',
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
  marginTop: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem'
};

const stockIndicatorStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column'
};

const redeemButtonStyle: React.CSSProperties = {
  padding: '0.45rem 1rem',
  backgroundColor: 'var(--customer-primary-hex)',
  borderRadius: '6px',
  color: 'white',
  fontWeight: 700,
  fontSize: '0.8rem',
  boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)'
};

const redeemButtonDisabledStyle: React.CSSProperties = {
  padding: '0.45rem 1rem',
  backgroundColor: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '6px',
  color: 'var(--text-muted)',
  fontWeight: 600,
  fontSize: '0.8rem',
  cursor: 'not-allowed'
};

// Modal Conf
const modalBodyStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  fontSize: '0.95rem'
};

const rewardSummaryBoxStyle: React.CSSProperties = {
  padding: '1rem',
  backgroundColor: '#0a0d14',
  border: '1px solid rgba(255,255,255,0.05)',
  borderRadius: '8px',
};

const rewardSummaryTitleStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: 'white',
  fontFamily: 'var(--font-title)',
  marginBottom: '0.25rem'
};

const rewardSummaryDescStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.4
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
  backgroundColor: 'var(--customer-primary-hex)',
  borderRadius: '6px',
  color: 'white',
  fontSize: '0.85rem',
  fontWeight: 700,
  boxShadow: '0 4px 12px rgba(16,185,129,0.2)'
};

// Vouchers ticket styles
const ticketCloseBtnStyle: React.CSSProperties = {
  padding: '0.5rem 1.5rem',
  backgroundColor: 'var(--customer-primary-hex)',
  borderRadius: '6px',
  color: 'white',
  fontSize: '0.85rem',
  fontWeight: 700,
};

const ticketBodyStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: '1.5rem',
  width: '100%'
};

const ticketSuccessLabelStyle: React.CSSProperties = {
  color: '#e2e8f0',
  fontSize: '0.95rem'
};

const ticketContainerStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  width: '100%',
  maxWidth: '360px',
  height: '140px',
  backgroundColor: '#0f172a',
  border: '2px dashed var(--customer-primary-hex)',
  borderRadius: '10px',
  overflow: 'hidden'
};

const ticketLeftCircleStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(50% - 10px)',
  left: '-10px',
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  backgroundColor: '#121621',
  borderRight: '2px dashed var(--customer-primary-hex)',
  zIndex: 1
};

const ticketRightCircleStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(50% - 10px)',
  right: '-10px',
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  backgroundColor: '#121621',
  borderLeft: '2px dashed var(--customer-primary-hex)',
  zIndex: 1
};

const ticketContentStyle: React.CSSProperties = {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '1rem'
};

const ticketHeaderLabelStyle: React.CSSProperties = {
  fontSize: '0.65rem',
  color: 'var(--text-muted)',
  fontWeight: 700,
  letterSpacing: '0.2em'
};

const ticketCodeStyle: React.CSSProperties = {
  fontSize: '1.8rem',
  fontWeight: 800,
  fontFamily: 'monospace',
  color: 'white',
  letterSpacing: '0.05em'
};

const copyButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#c084fc',
  transition: 'color 0.15s ease',
};

const ticketHintStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.5,
  maxWidth: '340px'
};
