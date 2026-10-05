import React, { useState } from 'react';
import { MOCK_REVENUE_CHART } from '../../data/mockData';

export const RevenueChart: React.FC = () => {
  const [activeRange, setActiveRange] = useState<'Today' | 'Weekly' | 'Monthly'>('Today');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const maxRevenue = Math.max(...MOCK_REVENUE_CHART.map((d) => d.revenue));

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl ghost-border shadow-level-1 flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-headline text-lg font-bold text-on-surface">Revenue & Order Velocity</h3>
            <span className="px-2 py-0.5 rounded-full bg-secondary-fixed/60 text-secondary font-label text-[11px] font-bold">
              +18.2% vs avg
            </span>
          </div>
          <p className="font-body text-xs text-on-surface-variant mt-1">
            Real-time hourly transaction volume and completed platform orders.
          </p>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-full border border-surface-container">
          {(['Today', 'Weekly', 'Monthly'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`px-3 py-1 rounded-full font-label text-xs font-semibold transition-all ${
                activeRange === range
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="relative pt-6 pb-2">
        {/* Y-Axis Guideline values */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
          <div className="border-b border-dashed border-surface-container flex justify-between text-[10px] text-outline">
            <span>$20k</span>
          </div>
          <div className="border-b border-dashed border-surface-container flex justify-between text-[10px] text-outline">
            <span>$15k</span>
          </div>
          <div className="border-b border-dashed border-surface-container flex justify-between text-[10px] text-outline">
            <span>$10k</span>
          </div>
          <div className="border-b border-dashed border-surface-container flex justify-between text-[10px] text-outline">
            <span>$5k</span>
          </div>
          <div className="border-b border-surface-container text-[10px] text-outline">
            <span>$0</span>
          </div>
        </div>

        {/* Dynamic Interactive SVG / CSS Bars */}
        <div className="relative h-56 flex items-end justify-between gap-2 sm:gap-4 px-2 z-10">
          {MOCK_REVENUE_CHART.map((item, index) => {
            const heightPercent = Math.round((item.revenue / (maxRevenue * 1.15)) * 100);
            const isHovered = hoveredBar === index;

            return (
              <div
                key={item.time}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Tooltip on Hover */}
                {isHovered && (
                  <div className="absolute -top-12 z-30 bg-inverse-surface text-inverse-on-surface px-3 py-1.5 rounded-lg text-xs font-label shadow-level-3 pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                    <p className="font-bold text-white">${item.revenue.toLocaleString()}</p>
                    <p className="text-[10px] text-surface-container-high">{item.orders} orders @ {item.time}</p>
                  </div>
                )}

                {/* Animated Rising Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[48px] rounded-t-md transition-all duration-500 ease-out flex flex-col justify-between p-1 relative overflow-hidden ${
                    isHovered
                      ? 'bg-gradient-to-t from-primary to-primary-bright shadow-glow-primary scale-x-105'
                      : 'bg-gradient-to-t from-primary/80 to-primary-container group-hover:from-primary group-hover:to-primary-bright'
                  }`}
                >
                  <div className="w-full h-1 rounded-full bg-white/40 mb-auto" />
                </div>

                {/* X-Axis Label */}
                <span
                  className={`font-label text-[11px] mt-2 transition-colors ${
                    isHovered ? 'text-primary font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart Footer Summary Metrics */}
      <div className="grid grid-cols-3 gap-4 pt-4 mt-2 border-t border-surface-container">
        <div className="text-center sm:text-left">
          <span className="font-label text-[11px] text-on-surface-variant uppercase">Peak Hourly Rate</span>
          <p className="font-headline text-base font-bold text-on-surface">$18,900/hr</p>
        </div>
        <div className="text-center sm:text-left">
          <span className="font-label text-[11px] text-on-surface-variant uppercase">Avg Order Value</span>
          <p className="font-headline text-base font-bold text-on-surface">$34.20</p>
        </div>
        <div className="text-center sm:text-left">
          <span className="font-label text-[11px] text-on-surface-variant uppercase">Fulfilled Orders</span>
          <p className="font-headline text-base font-bold text-secondary">3,425 today</p>
        </div>
      </div>
    </div>
  );
};
