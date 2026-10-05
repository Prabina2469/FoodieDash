import React from 'react';
import { MOCK_LIVE_DELIVERIES } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

export const LiveDeliveriesWidget: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl ghost-border shadow-level-1 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-headline text-lg font-bold text-on-surface">Active Fleet Deliveries</h3>
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label text-[11px] font-bold">
              {MOCK_LIVE_DELIVERIES.length} En Route
            </span>
          </div>
          <p className="font-body text-xs text-on-surface-variant mt-0.5">
            Real-time GPS tracking of couriers in transit.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/delivery-partners')}
          className="font-label text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          Fleet Map
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>

      {/* Deliveries List */}
      <div className="space-y-3.5 my-2">
        {MOCK_LIVE_DELIVERIES.map((delivery) => (
          <div
            key={delivery.id}
            onClick={() => navigate('/admin/delivery-partners')}
            className="p-4 rounded-xl bg-surface-container-low/60 hover:bg-surface-container-low transition-all cursor-pointer border border-surface-container/70 space-y-3"
          >
            {/* Top row: Rider info + ETA */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={delivery.riderAvatar}
                  alt={delivery.riderName}
                  className="w-10 h-10 rounded-full object-cover ghost-border"
                />
                <div>
                  <h4 className="font-label text-sm font-bold text-on-surface flex items-center gap-1.5">
                    {delivery.riderName}
                    <span className="font-body text-[10px] text-outline font-normal">
                      • {delivery.vehicle}
                    </span>
                  </h4>
                  <p className="font-body text-xs text-on-surface-variant truncate max-w-[170px]">
                    Order #{delivery.orderId} • ${delivery.orderValue.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-headline text-sm font-bold text-primary block">
                  {delivery.etaMinutes} mins
                </span>
                <span className="font-label text-[10px] uppercase font-bold text-outline">
                  {delivery.status}
                </span>
              </div>
            </div>

            {/* Path: Restaurant -> Customer */}
            <div className="flex items-center gap-2 text-xs font-body text-on-surface-variant bg-surface-container-lowest/80 p-2 rounded-lg border border-surface-container">
              <span className="material-symbols-outlined text-[16px] text-primary shrink-0">storefront</span>
              <span className="truncate max-w-[100px] font-medium text-on-surface">{delivery.restaurant}</span>
              <span className="material-symbols-outlined text-[14px] text-outline shrink-0">arrow_forward</span>
              <span className="material-symbols-outlined text-[16px] text-secondary shrink-0">home</span>
              <span className="truncate flex-1 font-medium text-on-surface">{delivery.destination}</span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full"
                  style={{ width: `${delivery.progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-label text-outline font-medium">
                <span>Picked up</span>
                <span>{delivery.progressPercent}% completed</span>
                <span>Dropoff</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fleet health summary footer */}
      <div className="pt-3 border-t border-surface-container flex items-center justify-between font-body text-xs text-on-surface-variant">
        <span className="flex items-center gap-1.5 text-secondary font-medium">
          <span className="w-2 h-2 rounded-full bg-secondary" />
          156 total couriers online
        </span>
        <span className="text-outline">Avg Delivery: 24 mins</span>
      </div>
    </div>
  );
};
