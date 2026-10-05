import React, { useState } from 'react';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  searchTerm = '',
  onSearchChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { userProfile, role, logout } = useAuth();
  const navigate = useNavigate();

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 h-20 bg-surface/90 backdrop-blur-md border-b border-surface-container transition-all">
      <div className="flex items-center justify-between h-full px-4 md:px-8">
        {/* Left Side: Mobile Hamburger & Search */}
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
            aria-label="Open Navigation Menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>

          {/* Search Bar */}
          <div className="relative w-full max-w-md hidden sm:block">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search orders, restaurants, riders, customers..."
              className="w-full pl-10 pr-10 py-2.5 bg-surface-container-low/70 border border-surface-container rounded-full text-sm font-body text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange?.('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Storefront shortcut, Operational Status, Quick Actions, Notifications, Profile */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Customer Storefront direct button */}
          <Link
            to="/"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label text-xs font-bold border border-surface-container transition-all"
            title="Open Customer Food Delivery App"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">
              storefront
            </span>
            <span>Customer App</span>
          </Link>

          {/* Live System Status Pill */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-fixed/50 border border-secondary/20 font-label text-xs text-secondary font-semibold">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span>Live Sync Active</span>
          </div>

          {/* Quick Create / Action Button */}
          <button
            onClick={() => navigate('/admin/orders')}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white font-label text-xs font-bold hover:bg-primary-container active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Live Dispatch</span>
          </button>

          {/* Notifications Trigger & Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2.5 rounded-full bg-surface-container-low hover:bg-surface-container hover:text-primary text-on-surface-variant transition-colors"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-error ring-2 ring-white" />
              )}
            </button>

            {/* Notifications Dropdown Drawer */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-surface-container-lowest rounded-2xl shadow-level-3 ghost-border p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                  <div className="flex items-center gap-2">
                    <h4 className="font-headline font-bold text-sm text-on-surface">Notifications</h4>
                    <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-bold text-[11px]">
                      {unreadCount} New
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/admin/notifications');
                    }}
                    className="text-xs text-primary font-label font-bold hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="divide-y divide-surface-container/50 max-h-80 overflow-y-auto mt-2">
                  {MOCK_NOTIFICATIONS.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer flex gap-3 ${
                        notif.unread ? 'bg-primary-fixed/20' : ''
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-surface-container-low shrink-0 h-fit">
                        <span className="material-symbols-outlined text-[18px] text-primary">
                          {notif.type === 'alert' ? 'warning' : notif.type === 'order' ? 'receipt' : 'info'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-label text-xs font-bold text-on-surface">{notif.title}</p>
                        <p className="font-body text-xs text-on-surface-variant mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                        <span className="font-label text-[10px] text-outline mt-1 block">
                          {notif.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu Trigger & Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2.5 p-1 rounded-full hover:bg-surface-container transition-colors"
            >
              <img
                src={
                  userProfile?.profileImage ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                }
                alt="Admin Profile"
                className="w-9 h-9 rounded-full object-cover ghost-border"
              />
              <div className="text-left hidden md:block leading-tight pr-1">
                <p className="font-label text-xs font-bold text-on-surface">{userProfile?.name || 'Alex Carter'}</p>
                <p className="font-body text-[11px] text-on-surface-variant">{role || 'Superadmin'}</p>
              </div>
              <span className="material-symbols-outlined text-outline text-[18px] hidden md:block">
                expand_more
              </span>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-surface-container-lowest rounded-2xl shadow-level-3 ghost-border p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-surface-container">
                  <p className="font-label text-xs font-bold text-on-surface">{userProfile?.name || 'Alex Carter'}</p>
                  <p className="font-body text-xs text-on-surface-variant truncate">{userProfile?.email || 'admin@foodiedash.io'}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-label text-primary hover:bg-primary-fixed/20 transition-colors text-left font-bold"
                  >
                    <span className="material-symbols-outlined text-[18px]">storefront</span>
                    Customer Storefront
                  </Link>
                  <button
                    onClick={() => {
                      navigate('/admin/settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-label text-on-surface hover:bg-surface-container transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    Profile Settings
                  </button>
                  <button
                    onClick={() => {
                      navigate('/admin/analytics');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-label text-on-surface hover:bg-surface-container transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[18px]">query_stats</span>
                    System Analytics
                  </button>
                </div>
                <div className="pt-1 border-t border-surface-container">
                  <button
                    onClick={async () => {
                      setShowProfileMenu(false);
                      await logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-label text-error hover:bg-error-container/40 transition-colors text-left font-bold"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
