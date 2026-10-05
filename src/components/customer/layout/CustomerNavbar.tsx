import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { useLocation } from '../../../context/LocationContext';
import { useNotifications } from '../../../context/NotificationContext';
import { useWishlist } from '../../../context/WishlistContext';

export const CustomerNavbar: React.FC = () => {
  const { isAuthenticated, userProfile, role, logout } = useAuth();
  const { itemCount } = useCart();
  const { currentLocation, setIsLocationModalOpen } = useLocation();
  const { unreadCount, notifications, markAsRead } = useNotifications();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotificationsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: 'home' },
    { to: '/offers', label: 'Offers', icon: 'local_offer' },
    { to: '/orders', label: 'Orders', icon: 'receipt_long', protected: true },
    { to: '/wishlist', label: 'Wishlist', icon: 'favorite', badge: wishlist.length > 0 ? wishlist.length : undefined },
  ];

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-surface-container transition-all">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left Side: Brand Logo & Delivery Location Picker */}
        <div className="flex items-center gap-6 shrink-0">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-primary-bright flex items-center justify-center text-white shadow-glow-primary group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                restaurant
              </span>
            </div>
            <div>
              <span className="text-2xl font-display font-extrabold text-primary tracking-tight">
                FoodieDash
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-label font-bold text-secondary uppercase bg-secondary-fixed/60 px-1.5 py-0.5 rounded">
                Express
              </span>
            </div>
          </Link>

          {/* Deliver to Location Picker Button */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="hidden md:flex items-center gap-2 text-left px-3 py-1.5 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-surface-container/60 transition-all max-w-[220px]"
            title="Change Delivery Location"
          >
            <span className="material-symbols-outlined text-primary text-[20px] shrink-0">
              location_on
            </span>
            <div className="overflow-hidden leading-tight">
              <span className="block text-[10px] font-label uppercase tracking-wider text-on-surface-variant font-bold">
                Deliver to
              </span>
              <span className="block text-xs font-headline font-bold text-on-surface truncate">
                {currentLocation.label || 'Select location'}
              </span>
            </div>
            <span className="material-symbols-outlined text-outline text-[16px]">
              expand_more
            </span>
          </button>
        </div>

        {/* Middle: Universal Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg hidden lg:block">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for restaurants, dishes, biryani, pizza or burgers..."
              className="w-full pl-10 pr-10 py-2.5 bg-surface-container-low/80 border border-surface-container rounded-full text-sm font-body text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </form>

        {/* Right Side: Navigation Links, Cart, Notifications, Auth Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-xl font-label text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-fixed text-primary font-bold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-semibold'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                    {link.badge !== undefined && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full bg-primary text-white text-[10px] font-extrabold">
                        {link.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Cart Button with Counter */}
          <Link
            to="/cart"
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface transition-all active:scale-95 group"
            aria-label="View Cart"
          >
            <div className="relative">
              <span className="material-symbols-outlined text-primary text-[22px] group-hover:scale-110 transition-transform">
                shopping_bag
              </span>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-headline font-bold text-xs text-on-surface">
              Cart
            </span>
          </Link>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotificationsMenu(!showNotificationsMenu);
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-error ring-2 ring-white" />
              )}
            </button>

            {showNotificationsMenu && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-surface-container-lowest rounded-3xl shadow-level-3 ghost-border p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                  <div className="flex items-center gap-2">
                    <h4 className="font-headline font-bold text-sm text-on-surface">Notifications</h4>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-bold text-[11px]">
                        {unreadCount} New
                      </span>
                    )}
                  </div>
                  <Link
                    to="/notifications"
                    onClick={() => setShowNotificationsMenu(false)}
                    className="text-xs text-primary font-label font-bold hover:underline"
                  >
                    View All
                  </Link>
                </div>

                <div className="divide-y divide-surface-container/50 max-h-80 overflow-y-auto mt-2">
                  {notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`p-3 rounded-2xl hover:bg-surface-container-low transition-colors cursor-pointer flex gap-3 ${
                        !n.isRead ? 'bg-primary-fixed/15' : ''
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-surface-container-low shrink-0 h-fit">
                        <span className="material-symbols-outlined text-[18px] text-primary">
                          {n.type === 'ORDER_CONFIRMED' ? 'check_circle' : n.type === 'OUT_FOR_DELIVERY' ? 'delivery_dining' : 'notifications'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-label text-xs font-bold text-on-surface">{n.title}</p>
                        <p className="font-body text-xs text-on-surface-variant mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                        <span className="font-label text-[10px] text-outline mt-1 block">
                          {n.createdAt}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Account / Sign In */}
          {isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotificationsMenu(false);
                }}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-surface-container transition-colors"
              >
                <img
                  src={
                    userProfile?.profileImage ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={userProfile?.name || 'Customer'}
                  className="w-9 h-9 rounded-full object-cover ghost-border ring-2 ring-primary/20"
                />
                <div className="text-left hidden lg:block leading-tight pr-1">
                  <p className="font-label text-xs font-bold text-on-surface truncate max-w-[100px]">
                    {userProfile?.name || 'My Account'}
                  </p>
                  <span className="font-label text-[10px] text-primary font-bold">
                    {role}
                  </span>
                </div>
                <span className="material-symbols-outlined text-outline text-[16px] hidden sm:block">
                  expand_more
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-surface-container-lowest rounded-3xl shadow-level-3 ghost-border p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-surface-container">
                    <p className="font-label text-sm font-bold text-on-surface">{userProfile?.name}</p>
                    <p className="font-body text-xs text-on-surface-variant truncate">{userProfile?.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-label font-bold px-2 py-0.5 rounded-full bg-primary-fixed text-primary">
                      Role: {role}
                    </span>
                  </div>

                  <div className="py-2 space-y-0.5">
                    {/* Admin Console shortcut for admin users */}
                    {role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setShowProfileMenu(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-label font-bold text-white bg-gradient-to-r from-primary to-primary-bright hover:shadow-glow-primary transition-all mb-1"
                      >
                        <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                        Admin Operations Console
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-label text-on-surface hover:bg-surface-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-outline">person</span>
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-label text-on-surface hover:bg-surface-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-outline">receipt_long</span>
                      Orders & Reorder
                    </Link>
                    <Link
                      to="/addresses"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-label text-on-surface hover:bg-surface-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-outline">home_pin</span>
                      Saved Addresses
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-label text-on-surface hover:bg-surface-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-outline">favorite</span>
                      Favorite Restaurants & Dishes
                    </Link>
                    <Link
                      to="/payments"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-label text-on-surface hover:bg-surface-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-outline">credit_card</span>
                      Payment Transactions
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-surface-container">
                    <button
                      onClick={async () => {
                        setShowProfileMenu(false);
                        await logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-label text-error hover:bg-error-container/40 transition-colors font-bold text-left"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label text-xs font-bold transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="hidden sm:inline-block px-4 py-2 rounded-2xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container shadow-sm active:scale-95 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
