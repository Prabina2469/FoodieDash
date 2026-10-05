import React, { useState } from 'react';

export const SettingsView: React.FC = () => {
  const [platformName, setPlatformName] = useState('FoodieDash Global');
  const [supportEmail, setSupportEmail] = useState('support@foodiedash.io');
  const [baseDeliveryFee, setBaseDeliveryFee] = useState('4.50');
  const [platformCommission, setPlatformCommission] = useState('15');
  const [autoAssignRiders, setAutoAssignRiders] = useState(true);
  const [surgePricing, setSurgePricing] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-4 border-b border-surface-container">
        <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-background">
          Platform Configuration & Business Rules
        </h1>
        <p className="font-body text-xs md:text-sm text-on-surface-variant mt-1">
          Configure commission take rates, automated dispatch logic, customer fees, and system webhooks.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-secondary-fixed/50 border border-secondary/30 text-secondary font-label text-xs font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          Configuration preferences successfully saved and propagated across active clusters.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Business Identity */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl ghost-border shadow-level-1 space-y-4">
          <h3 className="font-headline font-bold text-base text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">store</span>
            Brand & Operations Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-body text-xs">
            <div>
              <label className="font-label font-bold text-on-surface-variant block mb-1">
                Platform Name
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-surface-container rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="font-label font-bold text-on-surface-variant block mb-1">
                Operations Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-surface-container rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Fee Architecture & Take Rate */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl ghost-border shadow-level-1 space-y-4">
          <h3 className="font-headline font-bold text-base text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">monetization_on</span>
            Fee Architecture & Merchant Commissions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-body text-xs">
            <div>
              <label className="font-label font-bold text-on-surface-variant block mb-1">
                Default Base Delivery Fee ($)
              </label>
              <input
                type="number"
                step="0.10"
                value={baseDeliveryFee}
                onChange={(e) => setBaseDeliveryFee(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-surface-container rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="font-label font-bold text-on-surface-variant block mb-1">
                Platform Commission Take Rate (%)
              </label>
              <input
                type="number"
                value={platformCommission}
                onChange={(e) => setPlatformCommission(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-surface-container rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Automated Dispatch Engine */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl ghost-border shadow-level-1 space-y-4">
          <h3 className="font-headline font-bold text-base text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">smart_toy</span>
            Automated Fleet Dispatch & Surge Triggers
          </h3>

          <div className="space-y-3 font-body text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors">
              <div>
                <span className="font-label text-xs font-bold text-on-surface block">
                  Automated Proximity Dispatch
                </span>
                <span className="text-on-surface-variant text-[11px]">
                  Automatically assign the nearest available online courier when an order enters Preparing status.
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoAssignRiders}
                onChange={(e) => setAutoAssignRiders(e.target.checked)}
                className="w-5 h-5 rounded text-primary focus:ring-primary"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors">
              <div>
                <span className="font-label text-xs font-bold text-on-surface block">
                  Dynamic Bad Weather & High-Demand Surge Pricing
                </span>
                <span className="text-on-surface-variant text-[11px]">
                  Apply an adaptive 1.2x - 1.5x multiplier to delivery fees during peak rush periods.
                </span>
              </div>
              <input
                type="checkbox"
                checked={surgePricing}
                onChange={(e) => setSurgePricing(e.target.checked)}
                className="w-5 h-5 rounded text-primary focus:ring-primary"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container shadow-sm transition-all"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
