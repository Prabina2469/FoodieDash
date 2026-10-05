import React from 'react';
import { MOCK_KPIS, MOCK_ORDERS, Order } from '../data/mockData';
import { KPICard } from '../components/common/KPICard';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { OrderStatusChart } from '../components/dashboard/OrderStatusChart';
import { RecentOrdersTable } from '../components/dashboard/RecentOrdersTable';
import { TopRestaurantsList } from '../components/dashboard/TopRestaurantsList';
import { LiveDeliveriesWidget } from '../components/dashboard/LiveDeliveriesWidget';
import { useNavigate } from 'react-router-dom';

import { AiOperationsWidget } from '../components/dashboard/AiOperationsWidget';

interface DashboardViewProps {
  orders: Order[];
  onUpdateOrderStatus?: (orderId: string, status: Order['status']) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  orders = MOCK_ORDERS,
  onUpdateOrderStatus,
}) => {
  const navigate = useNavigate();

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome & Overview Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest to-primary-fixed/20 p-6 md:p-8 rounded-2xl ghost-border relative overflow-hidden shadow-level-1">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-label text-xs uppercase tracking-wider text-primary font-bold px-2 py-0.5 rounded-full bg-primary-fixed">
              Operations Center
            </span>
            <span className="font-body text-xs text-on-surface-variant">• {currentDate}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-on-background tracking-tight">
            Welcome back, Prabina 👋
          </h1>
          <p className="font-body text-xs md:text-sm text-on-surface-variant max-w-xl">
            Platform throughput is running <span className="text-secondary font-semibold">18.2% above baseline</span> today with 94 active delivery couriers en route.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/admin/analytics')}
            className="px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container font-label text-xs font-bold transition-all flex items-center gap-2 border border-surface-container"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Daily Report
          </button>
          <button
            onClick={() => navigate('/admin/orders')}
            className="px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-container font-label text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
            Live Order Feed
          </button>
        </div>
      </section>

      {/* 4 Bento KPI Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          title="Total Orders Today"
          value={MOCK_KPIS.totalOrders.display}
          trend={MOCK_KPIS.totalOrders.trend}
          isPositive={MOCK_KPIS.totalOrders.isPositive}
          subtitle={MOCK_KPIS.totalOrders.subtitle}
          icon="receipt_long"
          accentColor="primary"
        />
        <KPICard
          title="Gross Platform Revenue"
          value={MOCK_KPIS.revenue.display}
          trend={MOCK_KPIS.revenue.trend}
          isPositive={MOCK_KPIS.revenue.isPositive}
          subtitle={MOCK_KPIS.revenue.subtitle}
          icon="attach_money"
          accentColor="secondary"
        />
        <KPICard
          title="Active Customers"
          value={MOCK_KPIS.activeCustomers.display}
          trend={MOCK_KPIS.activeCustomers.trend}
          isPositive={MOCK_KPIS.activeCustomers.isPositive}
          subtitle={MOCK_KPIS.activeCustomers.subtitle}
          icon="group"
          accentColor="tertiary"
        />
        <KPICard
          title="Courier Fleet Status"
          value={MOCK_KPIS.deliveryPartners.display}
          trend={MOCK_KPIS.deliveryPartners.trend}
          isPositive={MOCK_KPIS.deliveryPartners.isPositive}
          subtitle={MOCK_KPIS.deliveryPartners.subtitle}
          icon="two_wheeler"
          accentColor="secondary"
        />
      </section>

      {/* Spring AI Operations Assistant Widget */}
      <section>
        <AiOperationsWidget />
      </section>

      {/* Charts Section: Revenue Velocity + Order Pipeline */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 xl:col-span-8">
          <RevenueChart />
        </div>
        <div className="lg:col-span-5 xl:col-span-4">
          <OrderStatusChart />
        </div>
      </section>

      {/* Recent Orders Live Table */}
      <section>
        <RecentOrdersTable
          orders={orders}
          onUpdateOrderStatus={onUpdateOrderStatus}
        />
      </section>

      {/* Bottom Grid: Top Restaurants & Live Deliveries */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <TopRestaurantsList />
        </div>
        <div className="lg:col-span-6">
          <LiveDeliveriesWidget />
        </div>
      </section>
    </div>
  );
};
