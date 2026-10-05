import React, { useState } from 'react';
import { MOCK_ORDER_STATUS_DISTRIBUTION } from '../../data/mockData';

export const OrderStatusChart: React.FC = () => {
  const [hoveredStatus, setHoveredStatus] = useState<string | null>(null);

  const totalOrders = MOCK_ORDER_STATUS_DISTRIBUTION.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl ghost-border shadow-level-1 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-headline text-lg font-bold text-on-surface">Order Fulfillment Status</h3>
          <p className="font-body text-xs text-on-surface-variant mt-0.5">
            Real-time pipeline breakdown of current active lifecycle.
          </p>
        </div>
        <span className="material-symbols-outlined text-outline">pie_chart</span>
      </div>

      {/* Visual Ring & Center Metric */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 my-4">
        {/* SVG Donut Ring */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Base Circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#eeeef0"
              strokeWidth="14"
            />
            {/* Segments calculation */}
            {(() => {
              let cumulativePercent = 0;
              return MOCK_ORDER_STATUS_DISTRIBUTION.map((status) => {
                const strokeDasharray = `${status.percentage * 2.512} ${100 * 2.512}`;
                const strokeDashoffset = -cumulativePercent * 2.512;
                cumulativePercent += status.percentage;

                const isHovered = hoveredStatus === status.name;

                return (
                  <circle
                    key={status.name}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={status.color}
                    strokeWidth={isHovered ? '17' : '14'}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredStatus(status.name)}
                    onMouseLeave={() => setHoveredStatus(null)}
                  />
                );
              });
            })()}
          </svg>

          {/* Center Metric Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="font-headline text-2xl font-extrabold text-on-background">
              {hoveredStatus
                ? `${MOCK_ORDER_STATUS_DISTRIBUTION.find((s) => s.name === hoveredStatus)?.percentage}%`
                : `${(totalOrders / 1000).toFixed(1)}k`}
            </span>
            <span className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
              {hoveredStatus || 'Total Orders'}
            </span>
          </div>
        </div>

        {/* Legend / Status Breakdown List */}
        <div className="flex-1 w-full space-y-2">
          {MOCK_ORDER_STATUS_DISTRIBUTION.map((item) => (
            <div
              key={item.name}
              onMouseEnter={() => setHoveredStatus(item.name)}
              onMouseLeave={() => setHoveredStatus(null)}
              className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${hoveredStatus === item.name ? 'bg-surface-container-low' : 'hover:bg-surface-container-low/50'
                }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-label text-xs font-semibold text-on-surface">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-body text-xs text-on-surface-variant font-medium">
                  {item.count.toLocaleString()}
                </span>
                <span className="font-label text-xs font-bold text-on-surface w-8 text-right">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Operational Efficiency Footnote */}
      <div className="pt-3 border-t border-surface-container flex items-center justify-between font-body text-xs text-on-surface-variant">
        <span className="flex items-center gap-1 text-secondary font-medium">
          <span className="material-symbols-outlined text-[16px]">verified</span>
          98.2% on-time fulfillment
        </span>
        <span className="text-outline">Live Sync: 5s ago</span>
      </div>
    </div>
  );
};
