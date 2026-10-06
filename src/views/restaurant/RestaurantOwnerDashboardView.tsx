import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const RestaurantOwnerDashboardView: React.FC = () => {
  const { userProfile, role } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600/10 via-amber-500/5 to-transparent p-6 sm:p-8 rounded-3xl border border-amber-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-label text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Kitchen Live & Accepting Orders
            </span>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-on-surface">
              Welcome, {userProfile?.name || 'Partner Kitchen'}
            </h1>
            <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
              FoodieDash Restaurant Management & Kitchen Dispatch Portal
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-surface-container-lowest ghost-border text-center shadow-sm">
              <span className="text-[10px] font-label font-bold text-outline uppercase block">Role Status</span>
              <span className="text-xs font-label font-extrabold text-amber-600 dark:text-amber-400">{role}</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-surface-container-lowest ghost-border text-center shadow-sm">
              <span className="text-[10px] font-label font-bold text-outline uppercase block">Backend Auth</span>
              <span className="text-xs font-label font-extrabold text-green-600 dark:text-green-400">VERIFIED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Access Boundary Confirmation Card */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest ghost-border shadow-level-1 space-y-4">
        <div className="flex items-center gap-3 text-on-surface">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">verified_user</span>
          </div>
          <div>
            <h2 className="font-headline font-bold text-base">Step 2 Architecture: Role Access Boundary</h2>
            <p className="text-xs font-body text-on-surface-variant">
              Role permissions strictly enforced via backend user profile and RoleProtectedRoute guards
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-label font-bold text-on-surface">Restaurant Portal (/restaurant-owner)</span>
              <span className="text-xs font-bold text-green-600">ALLOWED</span>
            </div>
            <p className="text-[11px] font-body text-on-surface-variant">
              Full operational access granted for RESTAURANT_OWNER session
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-label font-bold text-on-surface">Admin Console (/admin)</span>
              <span className="text-xs font-bold text-error">RESTRICTED</span>
            </div>
            <p className="text-[11px] font-body text-on-surface-variant">
              Administrative functions denied to restaurant owners
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-label font-bold text-on-surface">Delivery Console (/delivery)</span>
              <span className="text-xs font-bold text-error">RESTRICTED</span>
            </div>
            <p className="text-[11px] font-body text-on-surface-variant">
              Courier operations segregated to delivery partner accounts
            </p>
          </div>
        </div>
      </div>

      {/* Operational KPI Placeholders for Role Foundation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-surface-container-lowest ghost-border shadow-level-1 space-y-2">
          <div className="flex justify-between items-center text-outline">
            <span className="text-xs font-label font-bold uppercase tracking-wider">Active Orders</span>
            <span className="material-symbols-outlined text-[20px] text-amber-600">receipt_long</span>
          </div>
          <p className="text-2xl font-display font-extrabold text-on-surface">0</p>
          <p className="text-[11px] text-on-surface-variant">Ready for kitchen prep</p>
        </div>

        <div className="p-5 rounded-3xl bg-surface-container-lowest ghost-border shadow-level-1 space-y-2">
          <div className="flex justify-between items-center text-outline">
            <span className="text-xs font-label font-bold uppercase tracking-wider">Menu Dishes</span>
            <span className="material-symbols-outlined text-[20px] text-primary">restaurant_menu</span>
          </div>
          <p className="text-2xl font-display font-extrabold text-on-surface">Active</p>
          <p className="text-[11px] text-on-surface-variant">Catalog synchronized</p>
        </div>

        <div className="p-5 rounded-3xl bg-surface-container-lowest ghost-border shadow-level-1 space-y-2">
          <div className="flex justify-between items-center text-outline">
            <span className="text-xs font-label font-bold uppercase tracking-wider">Today's Revenue</span>
            <span className="material-symbols-outlined text-[20px] text-green-600">payments</span>
          </div>
          <p className="text-2xl font-display font-extrabold text-on-surface">$0.00</p>
          <p className="text-[11px] text-on-surface-variant">Direct merchant payouts</p>
        </div>

        <div className="p-5 rounded-3xl bg-surface-container-lowest ghost-border shadow-level-1 space-y-2">
          <div className="flex justify-between items-center text-outline">
            <span className="text-xs font-label font-bold uppercase tracking-wider">Store Rating</span>
            <span className="material-symbols-outlined text-[20px] text-amber-500">star</span>
          </div>
          <p className="text-2xl font-display font-extrabold text-on-surface">4.9 ★</p>
          <p className="text-[11px] text-on-surface-variant">Top-tier partner kitchen</p>
        </div>
      </div>
    </div>
  );
};
