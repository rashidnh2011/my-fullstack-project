import { AuthProvider } from './auth/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './page/login';
import MainLayout from './layouts/MainLayout';
import Dashboard from './page/dashboard/Dashboard';
import { ProtectedRoute } from './auth/ProtectedRoute';
import SupplierManagement from './page/supplier-managment';
import CustomerManagement from './page/customer-management';
import WarehouseMaster from './page/warehouse-master';
import InventoryMaster from './page/inventory-master';

// Import all your page components
import ASNManagement from './page/dashboard/inbound/ASNManagement';
import Receiving from './page/dashboard/inbound/Receiving';
import OrderProcessing from './page/dashboard/outbound/OrderProcessing';
import Shipping from './page/dashboard/outbound/Shipping';
import SalesDashboard from './page/SalesDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
                    
          {/* Protected routes with sidebar */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              {/* Dashboard home */}
              <Route path="/dashboard" element={<Dashboard />} />
              
              
              {/* Inbound routes */}
              <Route path="/inbound/asn" element={<ASNManagement />} />
              <Route path="/inbound/receiving" element={<Receiving />} />
              
              {/* Outbound routes */}
              <Route path="/outbound/orders" element={<OrderProcessing />} />
              <Route path="/outbound/shipping" element={<Shipping />} />
              
              {/* ✅ Supplier Page - now inside layout & protected */}
              <Route path="/supplier-management" element={<SupplierManagement />} />
              
              {/* ✅ Customer Page - now inside layout & protected */}
              <Route path="/customer-management" element={<CustomerManagement />} />

              <Route path='/warehouse-master' element={<WarehouseMaster />} />

              <Route path='/inventory-master' element={<InventoryMaster />} />
 
              {/* Add redirect from root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

            </Route>
          </Route>
          
          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;