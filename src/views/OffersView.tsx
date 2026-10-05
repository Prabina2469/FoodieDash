import React, { useState } from 'react';
import { MOCK_OFFERS, OfferCampaign } from '../data/mockData';
import { Badge } from '../components/common/Badge';

export const OffersView: React.FC = () => {
  const [offers, setOffers] = useState<OfferCampaign[]>(MOCK_OFFERS);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [discount, setDiscount] = useState('');
  const [minSpend, setMinSpend] = useState('30');
  const [limit, setLimit] = useState('1000');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discount) return;

    const newOffer: OfferCampaign = {
      id: `off-${Date.now()}`,
      code: code.toUpperCase(),
      title: title || `${discount} Promo`,
      discount,
      discountType: 'PERCENTAGE',
      minSpend: parseFloat(minSpend) || 20,
      usageCount: 0,
      usageLimit: parseInt(limit) || 1000,
      expiresAt: 'Dec 31, 2026',
      status: 'Active',
      targetAudience: 'All Users',
    };

    setOffers([newOffer, ...offers]);
    setShowCreateModal(false);
    setCode('');
    setTitle('');
    setDiscount('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-container">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-background">
            Offers, Coupons & Promotions
          </h1>
          <p className="font-body text-xs md:text-sm text-on-surface-variant mt-1">
            Create discount vouchers, free delivery campaigns, and track usage redemption rates.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container transition-all shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          Create Campaign
        </button>
      </div>

      {/* Offers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {offers.map((offer) => {
          const usagePercent = Math.round((offer.usageCount / offer.usageLimit) * 100);

          return (
            <div
              key={offer.id}
              className="p-6 rounded-2xl bg-surface-container-lowest ghost-border shadow-level-1 flex flex-col justify-between space-y-4 hover:shadow-level-2 transition-all relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-tertiary-fixed text-primary font-bold">
                  <span className="material-symbols-outlined text-[24px]">local_offer</span>
                </div>
                <Badge status={offer.status} size="sm" />
              </div>

              <div>
                <span className="font-mono text-sm font-extrabold text-primary bg-primary-fixed/50 px-2.5 py-1 rounded-md tracking-wider">
                  {offer.code}
                </span>
                <h3 className="font-headline text-lg font-bold text-on-surface mt-2">{offer.title}</h3>
                <p className="font-body text-xs text-on-surface-variant mt-1">
                  {offer.discount} on minimum spend of ${offer.minSpend}
                </p>
              </div>

              {/* Progress bar of usage */}
              <div className="space-y-1 pt-2 border-t border-surface-container">
                <div className="flex justify-between text-[11px] font-label text-on-surface-variant">
                  <span>Redemptions</span>
                  <span className="font-bold text-on-surface">
                    {offer.usageCount} / {offer.usageLimit} ({usagePercent}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
                <span className="text-[10px] text-outline block pt-1">Expires: {offer.expiresAt}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-level-3 ghost-border p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-surface-container">
              <h3 className="font-headline text-lg font-bold text-on-surface">New Campaign Voucher</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 font-body text-xs">
              <div>
                <label className="font-label font-bold text-on-surface-variant block mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER25"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-surface-container rounded-lg uppercase font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-label font-bold text-on-surface-variant block mb-1">Campaign Title</label>
                <input
                  type="text"
                  placeholder="e.g. Summer Weekend Special"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-surface-container rounded-lg"
                />
              </div>

              <div>
                <label className="font-label font-bold text-on-surface-variant block mb-1">Discount Text</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 25% OFF or $10 OFF"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-surface-container rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-label font-bold text-on-surface-variant block mb-1">Min Spend ($)</label>
                  <input
                    type="number"
                    value={minSpend}
                    onChange={(e) => setMinSpend(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-surface-container rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-label font-bold text-on-surface-variant block mb-1">Max Redemptions</label>
                  <input
                    type="number"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-surface-container rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-label text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container"
                >
                  Launch Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
