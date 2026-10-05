import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface NavItem {
  to: string;
  label: string;
  icon: string;
  badge?: string | number;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const mainNavItems: NavItem[] = [
    { to: '/admin', label: 'Dashboard', icon: 'dashboard' },
    { to: '/admin/orders', label: 'Orders', icon: 'receipt_long', badge: '1.2k', badgeColor: 'bg-primary-container text-white' },
    { to: '/admin/restaurants', label: 'Restaurants', icon: 'restaurant' },
    { to: '/admin/customers', label: 'Customers', icon: 'group' },
    { to: '/admin/delivery-partners', label: 'Delivery Fleet', icon: 'two_wheeler', badge: '94 live', badgeColor: 'bg-secondary-fixed text-secondary' },
    { to: '/admin/payments', label: 'Payments', icon: 'account_balance_wallet' },
    { to: '/admin/offers', label: 'Offers & Coupons', icon: 'local_offer' },
    { to: '/admin/reviews', label: 'Reviews', icon: 'star', badge: '3', badgeColor: 'bg-tertiary-fixed text-tertiary' },
    { to: '/admin/analytics', label: 'Analytics', icon: 'analytics' },
    { to: '/admin/notifications', label: 'Notifications', icon: 'notifications', badge: '2', badgeColor: 'bg-error text-white' },
    { to: '/admin/settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Main Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-surface-container-lowest border-r border-surface-container flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-20 flex items-center justify-between px-6 border-b border-surface-container">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary-bright flex items-center justify-center text-white shadow-glow-primary">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  restaurant_menu
                </span>
              </div>
              <div>
                <div className="text-xl font-display font-extrabold text-primary tracking-tight flex items-center gap-1.5">
                  FoodieDash
                </div>
                <span className="font-label text-[10px] text-on-surface-variant font-semibold tracking-wider uppercase px-1.5 py-0.5 bg-surface-container-low rounded">
                  Admin Console
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-240px)]">
            <div className="px-3 py-1.5 font-label text-[11px] uppercase tracking-wider text-on-surface-variant/70 font-bold">
              Main Operations
            </div>

            {mainNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-label text-sm transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary text-white font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <span
                        className={`material-symbols-outlined text-[20px] transition-colors ${
                          isActive ? 'text-white' : 'text-on-surface-variant group-hover:text-primary'
                        }`}
                        style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Sidebar Footer — Switch to Customer Storefront & Status */}
        <div className="p-4 border-t border-surface-container bg-surface-container-low/40 space-y-3">
          {/* Quick link to customer storefront */}
          <NavLink
            to="/"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-surface-container-lowest hover:bg-primary hover:text-white text-on-surface border border-surface-container font-label text-xs font-bold transition-all shadow-sm group"
          >
            <span className="material-symbols-outlined text-[18px] text-primary group-hover:text-white">
              storefront
            </span>
            <span>Customer Food Delivery</span>
          </NavLink>

          <div className="bg-surface-container-lowest p-3 rounded-xl ghost-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Admin Avatar"
                  className="w-9 h-9 rounded-full object-cover ghost-border"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary border-2 border-white" />
              </div>
              <div className="leading-tight">
                <p className="font-label text-xs font-bold text-on-surface">Alex Carter</p>
                <p className="font-body text-[11px] text-on-surface-variant">Operations Director</p>
              </div>
            </div>

            <NavLink
              to="/admin/settings"
              className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container-low transition-colors"
              title="Settings"
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};
