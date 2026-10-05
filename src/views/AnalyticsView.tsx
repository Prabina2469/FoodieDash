import React from 'react';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { OrderStatusChart } from '../components/dashboard/OrderStatusChart';

export const AnalyticsView: React.FC = () => {
  const downloadCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Time,Revenue,Orders\n' +
      '08:00,2400,84\n10:00,4200,145\n12:00,12800,480\n14:00,9500,360\n16:00,6100,210\n18:00,16400,620\n20:00,18900,740\n22:00,11200,410';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'foodiedash_analytics_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-container">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-background">
            Analytics, Insights & Forecasting
          </h1>
          <p className="font-body text-xs md:text-sm text-on-surface-variant mt-1">
            Deep performance reports, order velocity, peak kitchen throughput, and Core SLA metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={downloadCSV}
            className="px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container font-label text-xs font-bold transition-all border border-surface-container flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export CSV
          </button>
          <button
            onClick={() => alert('PDF analytics summary report generated!')}
            className="px-4 py-2.5 rounded-xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container transition-all shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            Export PDF
          </button>
        </div>
      </div>

      {/* 4 Operations KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-surface-container-lowest ghost-border shadow-level-1 space-y-2">
          <span className="font-label text-xs uppercase text-on-surface-variant font-bold">Avg Delivery Time</span>
          <p className="font-headline text-3xl font-bold text-on-surface">24 <span className="text-sm font-normal text-on-surface-variant">mins</span></p>
          <span className="font-label text-xs text-secondary font-semibold">12% faster than last month</span>
        </div>
        <div className="p-6 rounded-2xl bg-surface-container-lowest ghost-border shadow-level-1 space-y-2">
          <span className="font-label text-xs uppercase text-on-surface-variant font-bold">Customer Retention</span>
          <p className="font-headline text-3xl font-bold text-on-surface">76.4%</p>
          <span className="font-label text-xs text-on-surface-variant">90-day repeat cohort</span>
        </div>
        <div className="p-6 rounded-2xl bg-surface-container-lowest ghost-border shadow-level-1 space-y-2">
          <span className="font-label text-xs uppercase text-on-surface-variant font-bold">Peak Order Velocity</span>
          <p className="font-headline text-3xl font-bold text-primary">1,248 /hr</p>
          <span className="font-label text-xs text-on-surface-variant">Peak between 19:00 - 21:00</span>
        </div>
        <div className="p-6 rounded-2xl bg-surface-container-lowest ghost-border shadow-level-1 space-y-2">
          <span className="font-label text-xs uppercase text-on-surface-variant font-bold">Cancellation Rate</span>
          <p className="font-headline text-3xl font-bold text-secondary">0.9%</p>
          <span className="font-label text-xs text-secondary font-semibold">Industry benchmark &lt; 2.5%</span>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <RevenueChart />
        </div>
        <div className="lg:col-span-4">
          <OrderStatusChart />
        </div>
      </div>
    </div>
  );
};
