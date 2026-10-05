import React from 'react';
import { MOCK_RESTAURANTS } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

export const TopRestaurantsList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl ghost-border shadow-level-1 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-headline text-lg font-bold text-on-surface">Top Performing Kitchens</h3>
          <p className="font-body text-xs text-on-surface-variant mt-0.5">
            Ranked by revenue generation, rating & customer loyalty.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/restaurants')}
          className="font-label text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          View All
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>

      <div className="space-y-3 my-2">
        {MOCK_RESTAURANTS.map((rest, index) => (
          <div
            key={rest.id}
            onClick={() => navigate('/admin/restaurants')}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer border border-transparent hover:border-surface-container group"
          >
            {/* Left: Rank, Image & Details */}
            <div className="flex items-center gap-3">
              <span className="w-6 font-headline font-bold text-xs text-on-surface-variant/70 text-center">
                #{index + 1}
              </span>

              <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                <img
                  src={rest.image}
                  alt={rest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div>
                <h4 className="font-headline text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                  {rest.name}
                </h4>
                <p className="font-body text-[11px] text-on-surface-variant truncate max-w-[160px] sm:max-w-[200px]">
                  {rest.cuisine}
                </p>
              </div>
            </div>

            {/* Right: Metrics */}
            <div className="text-right flex items-center gap-4">
              <div className="hidden sm:block">
                <span className="font-label text-xs font-bold text-on-surface block">
                  ${rest.revenue.toLocaleString()}
                </span>
                <span className="font-label text-[10px] text-secondary font-semibold">
                  +{rest.growth}%
                </span>
              </div>

              <div className="flex items-center gap-1 bg-tertiary-fixed/60 text-tertiary px-2 py-1 rounded-full font-label text-xs font-bold shrink-0">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                {rest.rating}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-surface-container flex items-center justify-between font-label text-xs text-on-surface-variant">
        <span>Average preparation speed</span>
        <span className="font-bold text-on-surface">22 mins</span>
      </div>
    </div>
  );
};
