/* e:\claude_repos\trigital\openloyalty-master\frontend-react\src\App.tsx */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from './components/Toast';
import { UnifiedHub } from './pages/UnifiedHub';
import { Login } from './pages/Login';

// Layouts
import { AdminLayout, CustomerLayout, SellerLayout } from './layouts/Layouts';

// Admin Cockpit Pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminCustomers } from './pages/admin/Customers';
import { AdminSellers } from './pages/admin/Sellers';
import { AdminEarningRules } from './pages/admin/EarningRules';
import { AdminCampaigns } from './pages/admin/Campaigns';
import { AdminSegments } from './pages/admin/Segments';

// Customer Cockpit Pages
import { CustomerDashboard } from './pages/customer/Dashboard';
import { CustomerCatalog } from './pages/customer/Catalog';
import { CustomerTransactions } from './pages/customer/Transactions';

// Seller POS Pages
import { SellerTerminal } from './pages/seller/Terminal';
import { SellerTransactions } from './pages/seller/Transactions';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Core Shell Routes */}
          <Route path="/" element={<UnifiedHub />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="sellers" element={<AdminSellers />} />
            <Route path="rules" element={<AdminEarningRules />} />
            <Route path="campaigns" element={<AdminCampaigns />} />
            <Route path="segments" element={<AdminSegments />} />
          </Route>

          {/* Customer Portal Routes */}
          <Route path="/customer" element={<CustomerLayout />}>
            <Route index element={<CustomerDashboard />} />
            <Route path="catalog" element={<CustomerCatalog />} />
            <Route path="transactions" element={<CustomerTransactions />} />
          </Route>

          {/* POS Terminal Routes */}
          <Route path="/seller" element={<SellerLayout />}>
            <Route index element={<SellerTerminal />} />
            <Route path="transactions" element={<SellerTransactions />} />
          </Route>

          {/* Wildcard redirect back to Dashboard Hub */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      
      {/* Toast Alert Center */}
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
