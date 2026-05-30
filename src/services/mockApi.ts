/* e:\claude_repos\trigital\openloyalty-master\frontend-react\src\services\mockApi.ts */
import {
  INITIAL_EARNING_RULES,
  INITIAL_CAMPAIGNS,
  INITIAL_CUSTOMERS,
  INITIAL_TRANSACTIONS,
  INITIAL_TRANSFERS,
  INITIAL_SEGMENTS,
  INITIAL_SELLERS,
  EarningRule,
  Campaign,
  Customer,
  Transaction,
  PointTransfer,
  Segment,
  Seller
} from './mockData';

// Local storage keys
const KEYS = {
  RULES: 'ol_mock_rules',
  CAMPAIGNS: 'ol_mock_campaigns',
  CUSTOMERS: 'ol_mock_customers',
  TRANSACTIONS: 'ol_mock_transactions',
  TRANSFERS: 'ol_mock_transfers',
  SEGMENTS: 'ol_mock_segments',
  SELLERS: 'ol_mock_sellers',
};

// Initialize Mock database
const initMockDb = () => {
  if (!localStorage.getItem(KEYS.RULES)) {
    localStorage.setItem(KEYS.RULES, JSON.stringify(INITIAL_EARNING_RULES));
  }
  if (!localStorage.getItem(KEYS.CAMPAIGNS)) {
    localStorage.setItem(KEYS.CAMPAIGNS, JSON.stringify(INITIAL_CAMPAIGNS));
  }
  if (!localStorage.getItem(KEYS.CUSTOMERS)) {
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
  }
  if (!localStorage.getItem(KEYS.TRANSACTIONS)) {
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
  }
  if (!localStorage.getItem(KEYS.TRANSFERS)) {
    localStorage.setItem(KEYS.TRANSFERS, JSON.stringify(INITIAL_TRANSFERS));
  }
  if (!localStorage.getItem(KEYS.SEGMENTS)) {
    localStorage.setItem(KEYS.SEGMENTS, JSON.stringify(INITIAL_SEGMENTS));
  }
  if (!localStorage.getItem(KEYS.SELLERS)) {
    localStorage.setItem(KEYS.SELLERS, JSON.stringify(INITIAL_SELLERS));
  }
};

// Initialize on import
initMockDb();

// Helper to get and set
const getDb = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setDb = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Recalculate tier level based on points
const calculateLevel = (points: number): 'Bronze' | 'Silver' | 'Gold' => {
  if (points >= 500) return 'Gold';
  if (points >= 200) return 'Silver';
  return 'Bronze';
};

// Recalculate customer segments
const updateSegmentsCustomerCount = () => {
  const customers = getDb<Customer>(KEYS.CUSTOMERS);
  const segments = getDb<Segment>(KEYS.SEGMENTS);
  
  const updated = segments.map(seg => {
    const matching = customers.filter(c => c.points >= seg.minPoints);
    return { ...seg, customerCount: matching.length };
  });
  
  setDb(KEYS.SEGMENTS, updated);
};

export const mockApi = {
  // --- AUTHENTICATION ---
  login: async (username: string, role: 'admin' | 'customer' | 'seller') => {
    if (role === 'seller') {
      const sellers = getDb<Seller>(KEYS.SELLERS);
      const found = sellers.find(s => s.username === username);
      if (!found) {
        throw new Error('Cashier/POS username not found in database.');
      }
      if (!found.active) {
        throw new Error('This cashier/POS account is inactive or deactivated.');
      }
      return {
        token: `mock_jwt_seller_${Date.now()}`,
        refresh_token: `mock_refresh_seller_${Date.now()}`,
        username: found.username,
        name: found.name,
        posLocation: found.posLocation,
        roles: ['ROLE_SELLER']
      };
    }

    // Basic simulator for others
    return {
      token: `mock_jwt_${role}_${Date.now()}`,
      refresh_token: `mock_refresh_${role}_${Date.now()}`,
      username: username,
      roles: [role === 'admin' ? 'ROLE_ADMIN' : role === 'seller' ? 'ROLE_SELLER' : 'ROLE_PARTICIPANT']
    };
  },

  // --- STATS ---
  getStats: async () => {
    const transfers = getDb<PointTransfer>(KEYS.TRANSFERS);
    const customers = getDb<Customer>(KEYS.CUSTOMERS);
    const transactions = getDb<Transaction>(KEYS.TRANSACTIONS);

    const totalPointsActive = customers.reduce((sum, c) => sum + c.points, 0);
    const totalTransactionsVal = transactions.reduce((sum, t) => sum + t.grossValue, 0);

    return {
      points: {
        totalPointsActive,
        totalPointsIssued: transfers.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0),
        totalPointsSpent: transfers.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0),
      },
      transactions: {
        totalTransactionsCount: transactions.length,
        totalTransactionsValue: totalTransactionsVal,
        averageGrossValue: transactions.length > 0 ? (totalTransactionsVal / transactions.length) : 0,
      },
      customers: {
        totalCustomersCount: customers.length,
        activeCustomersCount: customers.filter(c => c.points > 0).length,
      },
      referral: {
        totalReferralsCount: 4,
        totalPointsAwarded: 150
      },
      registrations: {
        "2026-05-20": 1,
        "2026-05-21": 0,
        "2026-05-22": 1,
        "2026-05-23": 0,
        "2026-05-24": 0,
        "2026-05-25": 1,
        "2026-05-26": customers.length - 3 // Dynamic registrations for today
      }
    };
  },

  // --- CUSTOMERS ---
  getCustomers: async () => {
    return getDb<Customer>(KEYS.CUSTOMERS);
  },

  registerCustomer: async (customerData: Partial<Customer>) => {
    const customers = getDb<Customer>(KEYS.CUSTOMERS);
    const newCustomer: Customer = {
      id: customerData.id || `cust-${Date.now()}`,
      username: customerData.email || 'unknown',
      email: customerData.email || '',
      firstName: customerData.firstName || '',
      lastName: customerData.lastName || '',
      points: 0,
      level: 'Bronze',
      joinedAt: new Date().toISOString(),
      phone: customerData.phone || ''
    };
    
    customers.push(newCustomer);
    setDb(KEYS.CUSTOMERS, customers);
    updateSegmentsCustomerCount();
    
    // Seed signup bonus
    const transfers = getDb<PointTransfer>(KEYS.TRANSFERS);
    transfers.push({
      id: `tr-${Date.now()}`,
      customerId: newCustomer.id,
      amount: 50, // 50 sign up bonus points
      type: 'credit',
      description: 'Welcome loyalty bonus points',
      createdAt: new Date().toISOString()
    });
    setDb(KEYS.TRANSFERS, transfers);
    
    // Adjust points to 50
    newCustomer.points = 50;
    newCustomer.level = calculateLevel(50);
    setDb(KEYS.CUSTOMERS, customers);
    
    return newCustomer;
  },

  // --- EARNING RULES ---
  getRules: async () => {
    return getDb<EarningRule>(KEYS.RULES);
  },

  createRule: async (rule: Partial<EarningRule>) => {
    const rules = getDb<EarningRule>(KEYS.RULES);
    const newRule: EarningRule = {
      id: `rule-${Date.now()}`,
      name: rule.name || 'New Earning Rule',
      type: rule.type || 'points_per_dollar',
      pointsAmount: rule.pointsAmount || 1,
      sku: rule.sku || undefined,
      active: true
    };
    rules.push(newRule);
    setDb(KEYS.RULES, rules);
    return newRule;
  },

  toggleRule: async (id: string) => {
    const rules = getDb<EarningRule>(KEYS.RULES);
    const updated = rules.map(r => r.id === id ? { ...r, active: !r.active } : r);
    setDb(KEYS.RULES, updated);
    return updated.find(r => r.id === id);
  },

  // --- CAMPAIGNS (REWARDS) ---
  getCampaigns: async () => {
    return getDb<Campaign>(KEYS.CAMPAIGNS);
  },

  createCampaign: async (camp: Partial<Campaign>) => {
    const campaigns = getDb<Campaign>(KEYS.CAMPAIGNS);
    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      name: camp.name || 'New Campaign',
      shortDescription: camp.shortDescription || '',
      costInPoints: camp.costInPoints || 10,
      coupons: camp.coupons || [`COUPON-${Date.now()}`],
      claimedCoupons: [],
      active: true
    };
    campaigns.push(newCamp);
    setDb(KEYS.CAMPAIGNS, campaigns);
    return newCamp;
  },

  claimReward: async (customerId: string, campaignId: string) => {
    const customers = getDb<Customer>(KEYS.CUSTOMERS);
    const campaigns = getDb<Campaign>(KEYS.CAMPAIGNS);
    const transfers = getDb<PointTransfer>(KEYS.TRANSFERS);

    const customer = customers.find(c => c.id === customerId);
    const campaign = campaigns.find(ca => ca.id === campaignId);

    if (!customer) throw new Error('Customer not found');
    if (!campaign) throw new Error('Campaign not found');
    if (customer.points < campaign.costInPoints) throw new Error('Sufficient points balance check failed');

    // Get available coupon
    const available = campaign.coupons.filter(c => !campaign.claimedCoupons.includes(c));
    if (available.length === 0) throw new Error('No promotional codes left in active pool');

    const couponCode = available[0];
    campaign.claimedCoupons.push(couponCode);

    // Debit customer points
    customer.points -= campaign.costInPoints;
    customer.level = calculateLevel(customer.points);

    // Save transfer
    transfers.push({
      id: `tr-${Date.now()}`,
      customerId: customer.id,
      amount: campaign.costInPoints,
      type: 'debit',
      description: `Redeemed reward: ${campaign.name}`,
      createdAt: new Date().toISOString()
    });

    // Save DB
    setDb(KEYS.CUSTOMERS, customers);
    setDb(KEYS.CAMPAIGNS, campaigns);
    setDb(KEYS.TRANSFERS, transfers);
    updateSegmentsCustomerCount();

    return {
      success: true,
      couponCode,
      message: 'Reward campaign successfully redeemed.'
    };
  },

  // --- TRANSACTIONS (POS SALES) ---
  getTransactions: async () => {
    return getDb<Transaction>(KEYS.TRANSACTIONS);
  },

  getTransfers: async (customerId?: string) => {
    const transfers = getDb<PointTransfer>(KEYS.TRANSFERS);
    if (customerId) {
      return transfers.filter(t => t.customerId === customerId);
    }
    return transfers;
  },

  createTransaction: async (txData: {
    customerId: string;
    documentNumber: string;
    grossValue: number;
    items: Array<{ sku: string; name: string; price: number; quantity: number }>;
  }) => {
    const customers = getDb<Customer>(KEYS.CUSTOMERS);
    const rules = getDb<EarningRule>(KEYS.RULES).filter(r => r.active);
    const transactions = getDb<Transaction>(KEYS.TRANSACTIONS);
    const transfers = getDb<PointTransfer>(KEYS.TRANSFERS);

    let customer = customers.find(c => c.id === txData.customerId);
    
    // Auto-create customer if missing
    if (!customer) {
      customer = {
        id: txData.customerId,
        username: `guest_${txData.customerId}@openloyalty.io`,
        email: `guest_${txData.customerId}@openloyalty.io`,
        firstName: 'Loyal',
        lastName: 'Guest',
        points: 0,
        level: 'Bronze',
        joinedAt: new Date().toISOString()
      };
      customers.push(customer);
    }

    // Evaluate active earning rules
    let pointsAwarded = 0;
    
    // 1. Spend base points rule
    const baseRule = rules.find(r => r.type === 'points_per_dollar');
    if (baseRule) {
      pointsAwarded += txData.grossValue * baseRule.pointsAmount;
    }

    // 2. SKU specific rules
    rules.forEach(rule => {
      if (rule.type === 'product_sku' && rule.sku) {
        const matches = txData.items.filter(it => it.sku === rule.sku);
        const quantity = matches.reduce((sum, it) => sum + it.quantity, 0);
        pointsAwarded += quantity * rule.pointsAmount;
      }
    });

    // Credit customer wallet
    customer.points += pointsAwarded;
    customer.level = calculateLevel(customer.points);

    // Save transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      customerId: customer.id,
      customerName: `${customer.firstName} ${customer.lastName}`,
      documentNumber: txData.documentNumber,
      grossValue: txData.grossValue,
      pointsAwarded,
      items: txData.items,
      createdAt: new Date().toISOString()
    };

    transactions.push(newTx);
    setDb(KEYS.TRANSACTIONS, transactions);

    // Add Transfer
    transfers.push({
      id: `tr-${Date.now()}`,
      customerId: customer.id,
      amount: pointsAwarded,
      type: 'credit',
      description: `Points earned for transaction ${txData.documentNumber}`,
      createdAt: new Date().toISOString()
    });
    setDb(KEYS.TRANSFERS, transfers);
    setDb(KEYS.CUSTOMERS, customers);
    updateSegmentsCustomerCount();

    return {
      transaction: newTx,
      pointsAwarded,
      newBalance: customer.points,
      level: customer.level
    };
  },

  // --- SEGMENTS ---
  getSegments: async () => {
    updateSegmentsCustomerCount();
    return getDb<Segment>(KEYS.SEGMENTS);
  },

  // --- SELLERS / POS ---
  getSellers: async () => {
    return getDb<Seller>(KEYS.SELLERS);
  },

  createSeller: async (sellerData: Partial<Seller>) => {
    const sellers = getDb<Seller>(KEYS.SELLERS);
    const newSeller: Seller = {
      id: `seller-${Date.now()}`,
      username: sellerData.username || 'unknown',
      password: sellerData.password || 'open',
      name: sellerData.name || 'Anonymous POS',
      posLocation: sellerData.posLocation || 'Main Store',
      joinedAt: new Date().toISOString(),
      active: true
    };
    sellers.push(newSeller);
    setDb(KEYS.SELLERS, sellers);
    return newSeller;
  },

  toggleSeller: async (id: string) => {
    const sellers = getDb<Seller>(KEYS.SELLERS);
    const updated = sellers.map(s => s.id === id ? { ...s, active: !s.active } : s);
    setDb(KEYS.SELLERS, updated);
    return updated.find(s => s.id === id);
  }
};
