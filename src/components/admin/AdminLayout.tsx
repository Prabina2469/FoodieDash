import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { MOCK_ORDERS, Order } from '../../data/mockData';

export interface AdminOutletContextType {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  onAddNewOrder: (newOrder: Order) => void;
  globalSearch: string;
}

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [globalSearch, setGlobalSearch] = useState('');

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleAddNewOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col antialiased selection:bg-primary-fixed selection:text-primary">
      {/* Left Navigation Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Application Content Wrapper */}
      <div className="lg:pl-72 flex flex-col flex-1 min-h-screen transition-all duration-300">
        {/* Top Sticky Header */}
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          searchTerm={globalSearch}
          onSearchChange={setGlobalSearch}
        />

        {/* Admin Content Canvas */}
        <main className="flex-1 p-4 md:p-8 max-w-[1400px] w-full mx-auto">
          <Outlet context={{ orders, onUpdateOrderStatus: handleUpdateOrderStatus, onAddNewOrder: handleAddNewOrder, globalSearch }} />
        </main>

        {/* Minimal Platform Footer */}
        <footer className="py-4 px-6 md:px-8 border-t border-surface-container text-xs font-body text-on-surface-variant flex flex-col sm:flex-row justify-between items-center gap-2 bg-surface-container-lowest/50">
          <span>© 2026 FoodieDash Platform Operations. All systems active.</span>
          <div className="flex gap-4 font-label text-[11px] font-semibold">
            <span className="text-secondary flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              Cluster: US-East-1 (NY-Ops)
            </span>
            <span className="text-outline">API v2.4.8</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
