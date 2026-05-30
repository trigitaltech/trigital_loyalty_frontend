/* e:\claude_repos\trigital\openloyalty-master\frontend-react\src\services\mockData.ts */

export interface EarningRule {
  id: string;
  name: string;
  type: 'points_per_dollar' | 'product_sku';
  pointsAmount: number;
  sku?: string;
  active: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  shortDescription: string;
  costInPoints: number;
  coupons: string[];
  claimedCoupons: string[];
  active: boolean;
}

export interface Customer {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  points: number;
  level: 'Bronze' | 'Silver' | 'Gold';
  joinedAt: string;
  phone?: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  documentNumber: string;
  grossValue: number;
  pointsAwarded: number;
  items: Array<{ sku: string; name: string; price: number; quantity: number }>;
  createdAt: string;
}

export interface PointTransfer {
  id: string;
  customerId: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  createdAt: string;
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  minPoints: number;
  customerCount: number;
}

export const INITIAL_EARNING_RULES: EarningRule[] = [
  {
    id: 'rule-1',
    name: 'Standard Spend Rule',
    type: 'points_per_dollar',
    pointsAmount: 2,
    active: true
  },
  {
    id: 'rule-2',
    name: 'SKU Premium Widget Bonus',
    type: 'product_sku',
    pointsAmount: 50,
    sku: 'SKU-PREMIUM',
    active: true
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    name: 'Ten Dollar Gift Card',
    shortDescription: 'Redeem using 100 points',
    costInPoints: 100,
    coupons: ['GIFT-10-A', 'GIFT-10-B', 'GIFT-10-C'],
    claimedCoupons: [],
    active: true
  },
  {
    id: 'camp-2',
    name: 'VIP Premium Cap',
    shortDescription: 'Redeem using 250 points',
    costInPoints: 250,
    coupons: ['CAP-VIP-1', 'CAP-VIP-2'],
    claimedCoupons: [],
    active: true
  },
  {
    id: 'camp-3',
    name: 'Free Starbucks Coffee',
    shortDescription: 'Redeem using 50 points',
    coupons: ['COFFEE-FREE-01', 'COFFEE-FREE-02'],
    claimedCoupons: [],
    costInPoints: 50,
    active: true
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: '8f3b20cd-9d18-498c-8f19-3543d8a5712e',
    username: 'dev@openloyalty.io',
    email: 'dev@openloyalty.io',
    firstName: 'Dev',
    lastName: 'Participant',
    points: 380,
    level: 'Silver',
    joinedAt: '2026-01-15T12:00:00Z',
    phone: '+1 (555) 019-2834'
  },
  {
    id: 'cust-2',
    username: 'jane.doe@example.com',
    email: 'jane.doe@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
    points: 120,
    level: 'Bronze',
    joinedAt: '2026-03-22T09:30:00Z',
    phone: '+1 (555) 014-9988'
  },
  {
    id: 'cust-3',
    username: 'alex.smith@example.com',
    email: 'alex.smith@example.com',
    firstName: 'Alex',
    lastName: 'Smith',
    points: 750,
    level: 'Gold',
    joinedAt: '2025-11-05T14:45:00Z',
    phone: '+1 (555) 012-7711'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    customerId: '8f3b20cd-9d18-498c-8f19-3543d8a5712e',
    customerName: 'Dev Participant',
    documentNumber: 'REC-2026-0001',
    grossValue: 100,
    pointsAwarded: 200,
    items: [
      { sku: 'SKU-NORMAL', name: 'Basic Widget', price: 100, quantity: 1 }
    ],
    createdAt: '2026-05-20T10:15:00Z'
  },
  {
    id: 'tx-2',
    customerId: 'cust-2',
    customerName: 'Jane Doe',
    documentNumber: 'REC-2026-0002',
    grossValue: 60,
    pointsAwarded: 120,
    items: [
      { sku: 'SKU-NORMAL', name: 'Basic Widget', price: 30, quantity: 2 }
    ],
    createdAt: '2026-05-22T15:30:00Z'
  },
  {
    id: 'tx-3',
    customerId: 'cust-3',
    customerName: 'Alex Smith',
    documentNumber: 'REC-2026-0003',
    grossValue: 350,
    pointsAwarded: 750,
    items: [
      { sku: 'SKU-NORMAL', name: 'Basic Widget', price: 100, quantity: 3 },
      { sku: 'SKU-PREMIUM', name: 'Premium Widget', price: 50, quantity: 1 }
    ],
    createdAt: '2026-05-25T11:00:00Z'
  }
];

export const INITIAL_TRANSFERS: PointTransfer[] = [
  {
    id: 'tr-1',
    customerId: '8f3b20cd-9d18-498c-8f19-3543d8a5712e',
    amount: 200,
    type: 'credit',
    description: 'Points earned for transaction REC-2026-0001',
    createdAt: '2026-05-20T10:15:00Z'
  },
  {
    id: 'tr-2',
    customerId: '8f3b20cd-9d18-498c-8f19-3543d8a5712e',
    amount: 180,
    type: 'credit',
    description: 'Sign-up loyalty bonus',
    createdAt: '2026-01-15T12:05:00Z'
  },
  {
    id: 'tr-3',
    customerId: 'cust-2',
    amount: 120,
    type: 'credit',
    description: 'Points earned for transaction REC-2026-0002',
    createdAt: '2026-05-22T15:30:00Z'
  },
  {
    id: 'tr-4',
    customerId: 'cust-3',
    amount: 700,
    type: 'credit',
    description: 'Points earned for transaction REC-2026-0003',
    createdAt: '2026-05-25T11:00:00Z'
  },
  {
    id: 'tr-5',
    customerId: 'cust-3',
    amount: 50,
    type: 'credit',
    description: 'SKU-PREMIUM promotional reward',
    createdAt: '2026-05-25T11:00:00Z'
  }
];

export const INITIAL_SEGMENTS: Segment[] = [
  {
    id: 'seg-1',
    name: 'Silver Active Shoppers',
    description: 'Members with active points balances greater than 200.',
    minPoints: 200,
    customerCount: 2
  },
  {
    id: 'seg-2',
    name: 'High Rollers / Gold Tier',
    description: 'VIP members with active points balances greater than 500.',
    minPoints: 500,
    customerCount: 1
  }
];

export interface Seller {
  id: string;
  username: string;
  password?: string;
  name: string;
  posLocation: string;
  joinedAt: string;
  active: boolean;
}

export const INITIAL_SELLERS: Seller[] = [
  {
    id: 'seller-1',
    username: 'seller',
    password: 'open',
    name: 'Default Cashier',
    posLocation: 'Surya HQ Flagship',
    joinedAt: '2026-05-01T08:00:00Z',
    active: true
  },
  {
    id: 'seller-2',
    username: 'surya_cashier_1',
    password: 'open',
    name: 'Rohan Sharma',
    posLocation: 'Surya Outlet North',
    joinedAt: '2026-05-10T10:00:00Z',
    active: true
  }
];

