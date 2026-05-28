/* e:\claude_repos\trigital\openloyalty-master\frontend-react\src\pages\seller\Terminal.tsx */
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Calculator, Users, Plus, ShoppingCart, Tag, Ticket, CheckCircle, Search, UserCheck } from 'lucide-react';
import { Modal } from '../../components/Modal';

interface CartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
}

export const SellerTerminal: React.FC = () => {
  const { showToast } = useAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Transaction State
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [grossValue, setGrossValue] = useState(0);

  // Cart item inputs
  const [itemSku, setItemSku] = useState('SKU-NORMAL');
  const [itemName, setItemName] = useState('Basic Widget');
  const [itemPrice, setItemPrice] = useState<number>(30);
  const [itemQty, setItemQty] = useState<number>(1);

  // Invoice success ticket modal
  const [successReceipt, setSuccessReceipt] = useState<any | null>(null);

  // Registration Modal State
  const [regModalOpen, setRegModalOpen] = useState(false);
  const [regEmail, setRegEmail] = useState('');
  const [regFirst, setRegFirst] = useState('');
  const [regLast, setRegLast] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [registering, setRegistering] = useState(false);

  const loadTerminalData = async () => {
    setLoading(true);
    try {
      const usersList = await api.getCustomers();
      setCustomers(usersList);
      
      // Auto generate document number
      const rand = Math.floor(1000 + Math.random() * 9000);
      setDocumentNumber(`REC-2026-${rand}`);
    } catch (e) {
      showToast('Failed to load merchant directories', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTerminalData();
  }, []);

  // Update total gross value when cart changes
  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setGrossValue(total);
  }, [cart]);

  // Handle Preset item change
  const handleSkuPreset = (sku: string) => {
    setItemSku(sku);
    if (sku === 'SKU-PREMIUM') {
      setItemName('Premium Gold Widget');
      setItemPrice(100);
    } else {
      setItemName('Basic Widget');
      setItemPrice(30);
    }
  };

  const handleAddToCart = () => {
    if (itemPrice <= 0 || itemQty <= 0) return;
    
    // Check if sku already in cart
    const existing = cart.find(it => it.sku === itemSku);
    if (existing) {
      setCart(prev => prev.map(it => it.sku === itemSku ? { ...it, quantity: it.quantity + itemQty } : it));
    } else {
      setCart(prev => [...prev, { sku: itemSku, name: itemName, price: itemPrice, quantity: itemQty }]);
    }
    
    showToast('Product added to transaction cart', 'success');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handlePostReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      showToast('Please select or register a customer for points credit', 'warning');
      return;
    }
    if (cart.length === 0) {
      showToast('Transaction cart cannot be empty', 'warning');
      return;
    }

    try {
      const res = await api.createTransaction({
        customerId: selectedCustomerId,
        documentNumber,
        grossValue,
        items: cart
      });

      setSuccessReceipt(res);
      showToast(`Receipt posted successfully! +${res.pointsAwarded} points awarded.`, 'success');

      // Reset
      setCart([]);
      setSelectedCustomerId('');
      
      loadTerminalData(); // Re-sync customers
    } catch (err: any) {
      showToast('Failed to post purchase invoice transaction', 'danger');
    }
  };

  const handleRegisterCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regFirst || !regLast) return;

    setRegistering(true);
    try {
      const newCustomer = await api.registerCustomer({
        email: regEmail,
        firstName: regFirst,
        lastName: regLast,
        phone: regPhone || undefined
      });

      showToast(`Welcome! Member registered. 50 bonus pts credited.`, 'success');
      setRegModalOpen(false);

      // Pre-select new customer in POS
      setSelectedCustomerId(newCustomer.id);

      // Reset fields
      setRegEmail('');
      setRegFirst('');
      setRegLast('');
      setRegPhone('');

      loadTerminalData();
    } catch (err) {
      showToast('Failed to register member', 'danger');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div style={loaderContainerStyle}>
        <div className="spinner" style={{ width: '40px', height: '40px', borderTopColor: 'var(--seller-primary-hex)' }}></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Booting cashier POS register terminal...</p>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="animate-fade-in">
      <div style={titleRowStyle}>
        <div>
          <h1 style={titleStyle}>POS Loyalty Cashier Panel</h1>
          <p style={subtitleStyle}>Submit customer checkout invoices to dynamically trigger point multipliers and tier upgrades.</p>
        </div>
      </div>

      <div style={panelGridStyle} className="terminal-grid-2col">
        
        {/* Left Side: Receipt Form builder */}
        <div style={formCardStyle} className="glass-panel">
          <h3 style={sectionTitleStyle}><Calculator size={18} color="var(--seller-primary-hex)" /> Invoice Details</h3>
          
          <form onSubmit={handlePostReceipt} style={formStyle}>
            <div style={formRowStyle} className="form-row-2col">
              {/* Customer Selector */}
              <div style={formGroupStyle}>
                <label style={labelStyle}>Assign Loyalty Customer</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select 
                    value={selectedCustomerId} 
                    onChange={e => setSelectedCustomerId(e.target.value)}
                    required
                    style={{ flexGrow: 1 }}
                  >
                    <option value="">-- Choose Loyalty Member --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.firstName} {c.lastName} ({c.email}) — Balance: {c.points} pts
                      </option>
                    ))}
                  </select>
                  <button 
                    type="button" 
                    onClick={() => setRegModalOpen(true)} 
                    style={registerTriggerBtnStyle}
                    title="Register Guest Member"
                  >
                    <Plus size={16} /> Guest
                  </button>
                </div>
              </div>

              {/* Document Number */}
              <div style={formGroupStyle}>
                <label style={labelStyle}>Invoice Serial Number</label>
                <input
                  type="text"
                  value={documentNumber}
                  onChange={e => setDocumentNumber(e.target.value)}
                  required
                  style={{ background: '#0e111a', color: 'white', fontWeight: 600 }}
                />
              </div>
            </div>

            {/* Item Cart Builder */}
            <div style={cartBuilderBoxStyle}>
              <h4 style={subSectionTitleStyle}><ShoppingCart size={14} /> Add Product Cart Items</h4>
              <div style={cartFormRowStyle}>
                <div style={{ ...formGroupStyle, flexGrow: 2 }}>
                  <label style={labelStyle}>Product Item Preset</label>
                  <select value={itemSku} onChange={e => handleSkuPreset(e.target.value)}>
                    <option value="SKU-NORMAL">SKU-NORMAL (Basic Widget, $30)</option>
                    <option value="SKU-PREMIUM">SKU-PREMIUM (Premium Gold Widget, $100) — +50pts Rule!</option>
                  </select>
                </div>
                <div style={{ ...formGroupStyle, width: '90px' }}>
                  <label style={labelStyle}>Qty</label>
                  <input
                    type="number"
                    value={itemQty}
                    onChange={e => setItemQty(Number(e.target.value))}
                    min="1"
                    required
                  />
                </div>
                <button type="button" onClick={handleAddToCart} style={addToCartBtnStyle}>
                  Add Item
                </button>
              </div>
            </div>

            {/* Cart Table View */}
            <div style={cartTableContainerStyle}>
              {cart.length === 0 ? (
                <p style={emptyCartStyle}>Cart is empty. Please add items to compute gross purchase value.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <table style={cartTableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>SKU Code</th>
                        <th style={thStyle}>Product Item</th>
                        <th style={thStyle}>Price</th>
                        <th style={thStyle}>Qty</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item, idx) => (
                        <tr key={idx} style={trStyle}>
                          <td style={tdStyle}><span style={skuBadgeStyle}>{item.sku}</span></td>
                          <td style={{ ...tdStyle, color: 'white' }}>{item.name}</td>
                          <td style={tdStyle}>${item.price}</td>
                          <td style={tdStyle}>{item.quantity}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600 }}>${item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div style={cartSummaryRowStyle}>
                    <button type="button" onClick={handleClearCart} style={clearCartBtnStyle}>Clear Cart</button>
                    <span style={grossLabelStyle}>Gross Total Value: <strong style={{ color: 'white', fontSize: '1.25rem' }}>${grossValue}</strong></span>
                  </div>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={cart.length === 0 || !selectedCustomerId} 
              style={{
                ...submitButtonStyle,
                background: cart.length === 0 || !selectedCustomerId ? 'rgba(255,255,255,0.03)' : 'var(--seller-primary-hex)',
                color: cart.length === 0 || !selectedCustomerId ? 'var(--text-muted)' : 'white',
                boxShadow: cart.length === 0 || !selectedCustomerId ? 'none' : '0 4px 15px rgba(13, 148, 136, 0.25)'
              }}
            >
              Post Invoice & Award points
            </button>
          </form>

        </div>

        {/* Right Side: Quick info guidelines */}
        <div style={rulesGuideCardStyle} className="glass-panel">
          <h3 style={sectionTitleStyle}><Tag size={18} color="var(--seller-primary-hex)" /> Active Earning Matrix</h3>
          <div style={guideBoxStyle}>
            <div style={guideItemStyle}>
              <span style={guidePointsStyle}>+2 points</span>
              <span style={guideLabelStyle}>Per Spent Dollar gross value</span>
            </div>
            <div style={guideItemStyle}>
              <span style={{ ...guidePointsStyle, color: 'var(--color-warning)' }}>+50 points</span>
              <span style={guideLabelStyle}>Bonus reward per SKU: <strong>SKU-PREMIUM</strong> purchase quantity</span>
            </div>
          </div>
          
          <div style={guideNoteStyle}>
            <strong>Quick testing hint:</strong> Add 1 copy of <strong>SKU-PREMIUM</strong> to checkout cart. It will trigger a base points calculation ($100 spent * 2 = 200 pts) plus SKU bonus (50 pts) = <strong>250 pts total</strong> credited!
          </div>
        </div>

      </div>

      {/* Guest registration Modal */}
      <Modal
        isOpen={regModalOpen}
        onClose={() => setRegModalOpen(false)}
        title="Register New Loyalty Member"
        footerButtons={
          <>
            <button onClick={() => setRegModalOpen(false)} style={modalCancelBtnStyle} disabled={registering}>Cancel</button>
            <button onClick={handleRegisterCustomer} style={modalSubmitBtnStyle} disabled={registering}>
              {registering ? <div className="spinner"></div> : 'Register Customer'}
            </button>
          </>
        }
      >
        <form onSubmit={handleRegisterCustomer} style={formStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Email Address (Login Username)</label>
            <input
              type="email"
              value={regEmail}
              onChange={e => setRegEmail(e.target.value)}
              placeholder="e.g. customer@example.com"
              required
            />
          </div>

          <div style={formRowStyle} className="form-row-2col">
            <div style={formGroupStyle}>
              <label style={labelStyle}>First Name</label>
              <input
                type="text"
                value={regFirst}
                onChange={e => setRegFirst(e.target.value)}
                placeholder="John"
                required
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Last Name</label>
              <input
                type="text"
                value={regLast}
                onChange={e => setRegLast(e.target.value)}
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Mobile Phone Number (Optional)</label>
            <input
              type="text"
              value={regPhone}
              onChange={e => setRegPhone(e.target.value)}
              placeholder="+1 (555) 012-3456"
            />
          </div>
        </form>
      </Modal>

      {/* Invoice Receipt calculation Modal */}
      <Modal
        isOpen={successReceipt !== null}
        onClose={() => setSuccessReceipt(null)}
        title="POS Purchase Invoice Posted!"
        footerButtons={
          <button onClick={() => setSuccessReceipt(null)} style={successTicketCloseBtnStyle}>Close Ticket</button>
        }
      >
        {successReceipt && (
          <div style={ticketBodyStyle}>
            <CheckCircle size={48} color="var(--color-success)" style={{ animation: 'fadeIn 0.3s ease' }} />
            <h3 style={ticketTitleStyle}>Points Award Transaction Success</h3>
            
            <div style={receiptFrameStyle}>
              <div style={receiptDottedLineStyle}></div>
              
              <div style={receiptContentStyle}>
                <div style={receiptRowStyle}>
                  <span>Receipt Document</span>
                  <strong>{successReceipt.transaction.documentNumber}</strong>
                </div>
                <div style={receiptRowStyle}>
                  <span>Assigned Customer ID</span>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{successReceipt.transaction.customerId.substring(0, 18)}...</span>
                </div>
                <div style={receiptDottedDividerStyle}></div>

                <div style={{ ...receiptRowStyle, fontSize: '1rem', color: 'white' }}>
                  <span>Gross Basket Total</span>
                  <strong>${successReceipt.transaction.grossValue}</strong>
                </div>
                
                <div style={{ ...receiptRowStyle, color: 'var(--seller-primary-hex)', fontWeight: 700 }}>
                  <span>Points Credited</span>
                  <span>+{successReceipt.pointsAwarded} pts</span>
                </div>

                <div style={receiptDottedDividerStyle}></div>

                <div style={receiptRowStyle}>
                  <span>New Wallet Balance</span>
                  <strong>{successReceipt.newBalance} pts</strong>
                </div>
                
                <div style={receiptRowStyle}>
                  <span>Membership Level Status</span>
                  <span style={{ color: 'var(--color-warning)', fontWeight: 700 }}>{successReceipt.level}</span>
                </div>
              </div>
            </div>
            
            <p style={receiptFooterHintStyle}>
              Loyalty balances recalculated and PostgreSQL aggregate events rehydrated successfully!
            </p>
          </div>
        )}
      </Modal>

    </div>
  );
};

// --- CSS STYLING ---
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

const panelGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '7fr 4fr',
  gap: '1.5rem',
  alignItems: 'flex-start',
};

const formCardStyle: React.CSSProperties = {
  padding: '2rem',
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
  gap: '1.5rem'
};

const formRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',
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

const registerTriggerBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  padding: '0 1rem',
  backgroundColor: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '6px',
  color: '#e5e7eb',
  fontSize: '0.8rem',
  fontWeight: 600,
};

const cartBuilderBoxStyle: React.CSSProperties = {
  padding: '1.25rem',
  backgroundColor: 'rgba(0,0,0,0.15)',
  border: '1px solid rgba(255,255,255,0.03)',
  borderRadius: '8px',
};

const subSectionTitleStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  fontWeight: 600,
  color: '#cbd5e1',
  marginBottom: '0.75rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem'
};

const cartFormRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.75rem',
  alignItems: 'flex-end',
};

const addToCartBtnStyle: React.CSSProperties = {
  padding: '0.7rem 1.25rem',
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '6px',
  color: 'white',
  fontWeight: 700,
  fontSize: '0.8rem',
};

const cartTableContainerStyle: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.04)',
  borderRadius: '8px',
  overflow: 'hidden',
  background: 'rgba(0,0,0,0.1)'
};

const emptyCartStyle: React.CSSProperties = {
  padding: '2.5rem',
  textAlign: 'center',
  color: 'var(--text-muted)',
  fontSize: '0.85rem'
};

const cartTableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left',
  fontSize: '0.85rem'
};

const thStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  color: 'var(--text-secondary)',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
  fontWeight: 600,
  backgroundColor: 'rgba(0,0,0,0.2)'
};

const trStyle: React.CSSProperties = {
  borderBottom: '1px solid rgba(255,255,255,0.02)'
};

const tdStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  color: '#cbd5e1'
};

const skuBadgeStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontFamily: 'monospace',
  padding: '0.15rem 0.35rem',
  backgroundColor: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '4px',
  color: 'white'
};

const cartSummaryRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.75rem 1rem',
  backgroundColor: 'rgba(0,0,0,0.25)',
  borderTop: '1px solid rgba(255,255,255,0.04)',
};

const clearCartBtnStyle: React.CSSProperties = {
  color: '#f87171',
  fontSize: '0.8rem',
  fontWeight: 600,
};

const grossLabelStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem'
};

const submitButtonStyle: React.CSSProperties = {
  padding: '0.85rem',
  borderRadius: '8px',
  fontWeight: 700,
  fontSize: '0.95rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '0.5rem',
  transition: 'transform 0.15s ease'
};

// Right Guide Card
const rulesGuideCardStyle: React.CSSProperties = {
  padding: '1.5rem',
  background: 'rgba(18, 22, 33, 0.3)',
  borderRadius: '14px',
};

const guideBoxStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginBottom: '1.5rem'
};

const guideItemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  padding: '0.75rem',
  background: 'rgba(255,255,255,0.01)',
  border: '1px solid rgba(255,255,255,0.03)',
  borderRadius: '8px',
};

const guidePointsStyle: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  color: 'var(--seller-primary-hex)',
  fontFamily: 'var(--font-title)'
};

const guideLabelStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.4
};

const guideNoteStyle: React.CSSProperties = {
  padding: '0.75rem',
  backgroundColor: 'rgba(99, 102, 241, 0.05)',
  border: '1px solid rgba(99, 102, 241, 0.12)',
  borderRadius: '8px',
  fontSize: '0.75rem',
  color: '#c7d2fe',
  lineHeight: 1.5
};

// Modal Registration cancel / submit
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
  backgroundColor: 'var(--seller-primary-hex)',
  borderRadius: '6px',
  color: 'white',
  fontSize: '0.85rem',
  fontWeight: 700,
  boxShadow: '0 4px 12px rgba(13,148,136,0.2)'
};

// Success Ticket modal
const successTicketCloseBtnStyle: React.CSSProperties = {
  padding: '0.5rem 1.5rem',
  backgroundColor: 'var(--seller-primary-hex)',
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
  gap: '1rem',
  width: '100%'
};

const ticketTitleStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  fontFamily: 'var(--font-title)',
  color: 'white',
  fontWeight: 700
};

const receiptFrameStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '340px',
  backgroundColor: '#0a0d14',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  padding: '1.25rem',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
  position: 'relative'
};

const receiptDottedLineStyle: React.CSSProperties = {
  position: 'absolute',
  top: '-1px',
  left: '5%',
  width: '90%',
  borderTop: '2px dotted rgba(255,255,255,0.1)'
};

const receiptContentStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.65rem',
  textAlign: 'left'
};

const receiptRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.8rem',
  color: 'var(--text-secondary)'
};

const receiptDottedDividerStyle: React.CSSProperties = {
  borderTop: '1px dotted rgba(255,255,255,0.08)',
  margin: '0.25rem 0'
};

const receiptFooterHintStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  lineHeight: 1.4,
  maxWidth: '300px'
};
