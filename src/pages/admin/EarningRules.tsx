/* e:\claude_repos\trigital\openloyalty-master\frontend-react\src\pages\admin\EarningRules.tsx */
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Settings2, Plus, Power, ShieldAlert, Tag, Coins } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/Modal';

export const AdminEarningRules: React.FC = () => {
  const { showToast } = useAuth();
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Rule Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'points_per_dollar' | 'product_sku'>('points_per_dollar');
  const [pointsAmount, setPointsAmount] = useState<number>(1);
  const [sku, setSku] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const data = await api.getRules();
      setRules(data);
    } catch (e) {
      showToast('Failed to fetch points calculations rules', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleToggle = async (id: string) => {
    try {
      await api.toggleRule(id);
      setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
      showToast('Earning rule status modified', 'success');
    } catch (e) {
      showToast('Failed to toggle earning rule state', 'danger');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || pointsAmount <= 0) return;
    if (type === 'product_sku' && !sku) {
      showToast('Product SKU is required for SKU-specific rules', 'warning');
      return;
    }

    setSaving(true);
    try {
      await api.createRule({
        name,
        type,
        pointsAmount,
        sku: type === 'product_sku' ? sku : undefined
      });
      showToast('Earning rule successfully established', 'success');
      setModalOpen(false);
      
      // Reset Form
      setName('');
      setType('points_per_dollar');
      setPointsAmount(1);
      setSku('');

      fetchRules();
    } catch (e) {
      showToast('Failed to create earning rule', 'danger');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={containerStyle} className="animate-fade-in">
      <div style={titleRowStyle}>
        <div>
          <h1 style={titleStyle}>Earning Rules Configuration</h1>
          <p style={subtitleStyle}>Set points calculation criteria for product SKU purchases and spent dollars.</p>
        </div>
        <button onClick={() => setModalOpen(true)} style={addButtonStyle}>
          <Plus size={16} /> Create Earning Rule
        </button>
      </div>

      {/* Rules Grid Card */}
      <div style={tableContainerStyle} className="glass-panel">
        {loading ? (
          <div style={loaderStyle}>
            <div className="spinner" style={{ borderTopColor: 'var(--admin-primary-hex)' }}></div>
          </div>
        ) : rules.length === 0 ? (
          <div style={noDataStyle}>
            <ShieldAlert size={36} color="var(--text-muted)" />
            <p>No active earning rules found. Click the button above to establish your first rule.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={gridTableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Rule Name</th>
                  <th style={thStyle}>Calculation Mode</th>
                  <th style={thStyle}>Bonus Amount</th>
                  <th style={thStyle}>Target SKU</th>
                  <th style={thStyle}>Activation Status</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rules.map(r => (
                  <tr key={r.id} style={{ ...trStyle, opacity: r.active ? 1 : 0.6 }}>
                    <td style={{ ...tdStyle, fontWeight: 600, color: 'white' }}>
                      {r.name}
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        ...badgeStyle,
                        backgroundColor: r.type === 'points_per_dollar' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(168, 85, 247, 0.1)',
                        color: r.type === 'points_per_dollar' ? 'var(--admin-primary-hex)' : 'var(--admin-accent-hex)'
                      }}>
                        {r.type === 'points_per_dollar' ? 'Points Per Spent Dollar' : 'Product SKU Bonus'}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 700, color: 'var(--admin-primary-hex)' }}>
                      {r.pointsAmount} pts {r.type === 'points_per_dollar' ? '/ $' : 'flat'}
                    </td>
                    <td style={tdStyle}>
                      {r.sku ? (
                        <span style={skuBoxStyle}><Tag size={12} /> {r.sku}</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Global (All SKUs)</span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        ...statusBadgeStyle,
                        color: r.active ? 'var(--color-success)' : 'var(--text-muted)'
                      }}>
                        <span style={{ ...dotStyle, backgroundColor: r.active ? 'var(--color-success)' : 'var(--text-muted)' }}></span>
                        {r.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <button 
                        onClick={() => handleToggle(r.id)} 
                        style={{
                          ...actionBtnStyle,
                          color: r.active ? '#f87171' : '#34d399',
                          backgroundColor: r.active ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                          borderColor: r.active ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)'
                        }}
                      >
                        <Power size={12} /> {r.active ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Creation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Establish New Earning Rule"
        footerButtons={
          <>
            <button onClick={() => setModalOpen(false)} style={modalCancelBtnStyle}>Cancel</button>
            <button 
              onClick={handleSubmit} 
              disabled={saving}
              style={modalSubmitBtnStyle}
            >
              {saving ? <div className="spinner"></div> : 'Create Rule'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Earning Rule Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Standard 2x Point multiplier"
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Calculation Mode</label>
            <select 
              value={type} 
              onChange={e => setType(e.target.value as any)}
            >
              <option value="points_per_dollar">Points Awarded Per Dollar Spent</option>
              <option value="product_sku">Bonus Points for Specific Product SKU</option>
            </select>
          </div>

          {type === 'product_sku' && (
            <div style={formGroupStyle}>
              <label style={labelStyle}>Target Product SKU Code</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={sku}
                  onChange={e => setSku(e.target.value)}
                  placeholder="e.g. SKU-PREMIUM"
                  required
                />
              </div>
            </div>
          )}

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              {type === 'points_per_dollar' ? 'Points Multiplier Amount' : 'Flat Bonus Points'}
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Coins size={16} color="#6b7280" style={{ position: 'absolute', left: '1rem' }} />
              <input
                type="number"
                value={pointsAmount}
                onChange={e => setPointsAmount(Number(e.target.value))}
                min="1"
                required
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
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

const badgeStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 600,
  padding: '0.2rem 0.6rem',
  borderRadius: '6px',
  display: 'inline-flex'
};

const skuBoxStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  fontSize: '0.8rem',
  padding: '0.2rem 0.5rem',
  borderRadius: '4px',
  backgroundColor: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  color: 'white',
  fontWeight: 600
};

const statusBadgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.8rem',
  fontWeight: 600
};

const dotStyle: React.CSSProperties = {
  width: '6px',
  height: '6px',
  borderRadius: '50%'
};

const actionBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  border: '1px solid',
  borderRadius: '6px',
  fontSize: '0.8rem',
  padding: '0.4rem 0.8rem',
  fontWeight: 600,
};

// Modal Form Styles
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
