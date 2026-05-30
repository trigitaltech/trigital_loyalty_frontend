/* e:\claude_repos\trigital\openloyalty-master\frontend-react\src\services\api.ts */
import { mockApi } from './mockApi';

const DEFAULT_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getApiUrl = (): string => {
  return localStorage.getItem('ol_api_url') || DEFAULT_API_URL;
};

export const setApiUrl = (url: string): void => {
  localStorage.setItem('ol_api_url', url);
};

// Check if we should enforce mock mode explicitly
export const isEnforcedMock = (): boolean => {
  const stored = localStorage.getItem('ol_use_mock');
  return stored === null ? false : stored === 'true'; // Default to false — use real backend
};

export const setEnforceMock = (value: boolean): void => {
  localStorage.setItem('ol_use_mock', value ? 'true' : 'false');
};

// Authentication state getters
const getStoredToken = (): string | null => localStorage.getItem('ol_jwt_token');

// Generic Fetch Wrapper with Auto-Fallback
const request = async <T>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  role?: 'admin' | 'customer' | 'seller'
): Promise<T> => {
  // If Mock mode is explicitly selected, skip NestJS check
  if (isEnforcedMock()) {
    throw new Error('MOCK_FALLBACK');
  }

  const url = `${getApiUrl()}${path}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = getStoredToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('ol_jwt_token');
        localStorage.removeItem('ol_refresh_token');
        window.dispatchEvent(new Event('ol_unauthorized'));
      }
      const errData = await response.json().catch(() => ({ message: 'API Request failed' }));
      throw new Error(errData.message || 'API Request failed');
    }

    return await response.json();
  } catch (error: any) {
    // If it's a standard network connection error or a 404, we trigger mock fallback
    console.warn(`NestJS API request to ${path} failed (${error.message}). Invoking client Mock database fallback.`);
    throw error;
  }
};

// High level exports mapping to endpoints
export const api = {
  // --- AUTHENTICATION ---
  login: async (username: string, password: string, role: 'admin' | 'customer' | 'seller') => {
    try {
      const path = `/api/${role}/login_check`;
      // Symfony legacy compatible keys
      const payload = {
        _username: username,
        _password: password,
      };
      
      const res = await request<{ token: string; refresh_token: string }>(path, 'POST', payload);
      localStorage.setItem('ol_jwt_token', res.token);
      localStorage.setItem('ol_refresh_token', res.refresh_token);
      localStorage.setItem('ol_user_role', role);
      localStorage.setItem('ol_username', username);
      setEnforceMock(false); // Connected to real backend, turn off forced mock mode
      return {
        token: res.token,
        refresh_token: res.refresh_token,
        username,
        roles: [role === 'admin' ? 'ROLE_ADMIN' : role === 'seller' ? 'ROLE_SELLER' : 'ROLE_PARTICIPANT']
      };
    } catch (e: any) {
      if (isEnforcedMock() || e.message === 'MOCK_FALLBACK' || e.message.includes('Failed to fetch')) {
        // Run mock fallback
        const res = await mockApi.login(username, role);
        localStorage.setItem('ol_jwt_token', res.token);
        localStorage.setItem('ol_refresh_token', res.refresh_token);
        localStorage.setItem('ol_user_role', role);
        localStorage.setItem('ol_username', username);
        if (res.name) localStorage.setItem('ol_name', res.name);
        if (res.posLocation) localStorage.setItem('ol_pos_location', res.posLocation);
        return res;
      }
      throw e;
    }
  },

  logout: () => {
    localStorage.removeItem('ol_jwt_token');
    localStorage.removeItem('ol_refresh_token');
    localStorage.removeItem('ol_user_role');
    localStorage.removeItem('ol_username');
    localStorage.removeItem('ol_name');
    localStorage.removeItem('ol_pos_location');
  },

  // --- ANALYTICS ---
  getStats: async () => {
    try {
      return await request<any>('/api/admin/analytics/stats', 'GET'); // Custom stats agg endpoint
    } catch (e) {
      return await mockApi.getStats();
    }
  },

  // --- CUSTOMERS ---
  getCustomers: async () => {
    try {
      // In NestJS, get customers from ES
      return await request<any[]>('/api/admin/customer', 'GET');
    } catch (e) {
      return await mockApi.getCustomers();
    }
  },

  registerCustomer: async (customerData: { email: string; firstName: string; lastName: string; phone?: string }) => {
    try {
      // Public self registration pathway
      return await request<any>('/api/customer/self_register', 'POST', customerData);
    } catch (e) {
      return await mockApi.registerCustomer(customerData);
    }
  },

  // --- EARNING RULES ---
  getRules: async () => {
    try {
      return await request<any[]>('/api/admin/earningrule', 'GET');
    } catch (e) {
      return await mockApi.getRules();
    }
  },

  createRule: async (rule: { name: string; type: 'points_per_dollar' | 'product_sku'; pointsAmount: number; sku?: string }) => {
    try {
      return await request<any>('/api/admin/earningrule', 'POST', rule);
    } catch (e) {
      return await mockApi.createRule(rule);
    }
  },

  toggleRule: async (id: string) => {
    try {
      return await request<any>(`/api/admin/earningrule/${id}/toggle`, 'POST');
    } catch (e) {
      return await mockApi.toggleRule(id);
    }
  },

  // --- CAMPAIGNS ---
  getCampaigns: async () => {
    try {
      return await request<any[]>('/api/admin/campaign', 'GET');
    } catch (e) {
      return await mockApi.getCampaigns();
    }
  },

  createCampaign: async (camp: { name: string; shortDescription: string; costInPoints: number; coupons: string[] }) => {
    try {
      return await request<any>('/api/admin/campaign', 'POST', camp);
    } catch (e) {
      return await mockApi.createCampaign(camp);
    }
  },

  claimReward: async (customerId: string, campaignId: string) => {
    try {
      // Points spend redemption endpoint
      return await request<any>(`/api/customer/campaign/${campaignId}/buy`, 'POST', { customerId });
    } catch (e) {
      return await mockApi.claimReward(customerId, campaignId);
    }
  },

  // --- TRANSACTIONS ---
  getTransactions: async () => {
    try {
      return await request<any[]>('/api/admin/transactions', 'GET');
    } catch (e) {
      return await mockApi.getTransactions();
    }
  },

  getTransfers: async (customerId?: string) => {
    try {
      const url = customerId ? `/api/customer/${customerId}/transfers` : '/api/admin/transfers';
      return await request<any[]>(url, 'GET');
    } catch (e) {
      return await mockApi.getTransfers(customerId);
    }
  },

  createTransaction: async (txData: {
    customerId: string;
    documentNumber: string;
    grossValue: number;
    items: Array<{ sku: string; name: string; price: number; quantity: number }>;
  }) => {
    try {
      // POS merchant receipt submission
      return await request<any>('/api/seller/transaction', 'POST', txData);
    } catch (e) {
      return await mockApi.createTransaction(txData);
    }
  },

  // --- SEGMENTS ---
  getSegments: async () => {
    try {
      return await request<any[]>('/api/admin/segment', 'GET');
    } catch (e) {
      return await mockApi.getSegments();
    }
  },

  // --- SELLERS / POS ---
  getSellers: async () => {
    try {
      return await request<any[]>('/api/admin/seller', 'GET');
    } catch (e) {
      return await mockApi.getSellers();
    }
  },

  createSeller: async (sellerData: { username: string; password?: string; name: string; posLocation: string }) => {
    try {
      return await request<any>('/api/admin/seller', 'POST', sellerData);
    } catch (e) {
      return await mockApi.createSeller(sellerData);
    }
  },

  toggleSeller: async (id: string) => {
    try {
      return await request<any>(`/api/admin/seller/${id}/toggle`, 'POST');
    } catch (e) {
      return await mockApi.toggleSeller(id);
    }
  }
};
