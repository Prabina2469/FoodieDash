import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';

export const ProfileView: React.FC = () => {
  const { userProfile, role, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(userProfile?.name || '');
  const [phone, setPhone] = useState(userProfile?.phoneNumber || '');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    try {
      await userService.updateMyProfile({
        name: name.trim(),
        phoneNumber: phone.trim() || undefined
      });
      await refreshProfile();
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-32">
      {/* Header */}
      <div className="space-y-2">
        <nav className="flex items-center gap-2 text-xs font-label text-outline">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-on-surface font-bold">My Account</span>
        </nav>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-on-surface">
          Customer Profile & Settings
        </h1>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 ghost-border shadow-level-1 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative">
            <img
              src={
                userProfile?.profileImage ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
              }
              alt={userProfile?.name || 'Customer Profile'}
              className="w-20 h-20 rounded-3xl object-cover ghost-border ring-4 ring-primary/20"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary border-2 border-white flex items-center justify-center text-[10px] text-white">
              ✓
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="font-headline font-bold text-xl text-on-surface">
              {userProfile?.name || 'FoodieDash Member'}
            </h2>
            <p className="font-body text-xs text-on-surface-variant">
              {userProfile?.email}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-label text-[11px] font-bold">
                Role: {role}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-secondary font-label text-[11px] font-bold">
                Status: Active
              </span>
            </div>
          </div>
        </div>

        {/* Action Logout */}
        <button
          onClick={async () => {
            await logout();
            navigate('/login');
          }}
          className="px-4 py-2 rounded-xl text-error hover:bg-error-container/40 font-label text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Log Out
        </button>
      </div>

      {/* Admin shortcut if ADMIN role */}
      {role === 'ADMIN' && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-primary-fixed/60 via-primary-fixed to-primary-fixed-dim/60 border border-primary/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-base text-primary">
                FoodieDash Admin & Operations Console
              </h3>
              <p className="font-body text-xs text-on-surface-variant">
                You have platform admin privileges to manage orders, live fleet dispatch, restaurant catalog, and payments.
              </p>
            </div>
          </div>
          <Link
            to="/admin"
            className="px-6 py-3 rounded-2xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container shadow-glow-primary shrink-0 transition-all"
          >
            Open Admin Dashboard →
          </Link>
        </div>
      )}

      {/* Account Navigation Shortcuts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/addresses"
          className="p-5 rounded-3xl bg-surface-container-lowest ghost-border shadow-sm hover:shadow-level-2 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">home_pin</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                Saved Addresses
              </h4>
              <p className="font-body text-[11px] text-on-surface-variant">Manage delivery spots</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">
            chevron_right
          </span>
        </Link>

        <Link
          to="/orders"
          className="p-5 rounded-3xl bg-surface-container-lowest ghost-border shadow-sm hover:shadow-level-2 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-secondary-fixed text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                My Orders
              </h4>
              <p className="font-body text-[11px] text-on-surface-variant">Active & past receipts</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">
            chevron_right
          </span>
        </Link>

        <Link
          to="/wishlist"
          className="p-5 rounded-3xl bg-surface-container-lowest ghost-border shadow-sm hover:shadow-level-2 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">favorite</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                Favorites
              </h4>
              <p className="font-body text-[11px] text-on-surface-variant">Saved restaurants & food</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">
            chevron_right
          </span>
        </Link>

        <Link
          to="/payments"
          className="p-5 rounded-3xl bg-surface-container-lowest ghost-border shadow-sm hover:shadow-level-2 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-tertiary-fixed text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">credit_card</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                Payment History
              </h4>
              <p className="font-body text-[11px] text-on-surface-variant">Past transactions</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">
            chevron_right
          </span>
        </Link>

        <Link
          to="/notifications"
          className="p-5 rounded-3xl bg-surface-container-lowest ghost-border shadow-sm hover:shadow-level-2 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-surface-container-low text-on-surface flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                Notifications
              </h4>
              <p className="font-body text-[11px] text-on-surface-variant">Order updates & alerts</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">
            chevron_right
          </span>
        </Link>

        <Link
          to="/offers"
          className="p-5 rounded-3xl bg-surface-container-lowest ghost-border shadow-sm hover:shadow-level-2 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">local_offer</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                Coupons & Offers
              </h4>
              <p className="font-body text-[11px] text-on-surface-variant">Discounts and promotions</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">
            chevron_right
          </span>
        </Link>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 ghost-border shadow-sm space-y-6">
        <h3 className="font-headline font-bold text-base text-on-surface border-b border-surface-container pb-3">
          Personal Information
        </h3>

        {successMsg && (
          <p className="text-xs font-body text-secondary bg-secondary-fixed/40 p-3 rounded-2xl border border-secondary/30">
            ✓ {successMsg}
          </p>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-xl">
          <div className="space-y-1">
            <label className="text-xs font-label font-bold text-on-surface">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 rounded-2xl bg-surface-container-low border border-surface-container text-xs font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-label font-bold text-on-surface">Email Address</label>
            <input
              type="email"
              value={userProfile?.email || ''}
              disabled
              className="w-full p-3 rounded-2xl bg-surface-container-low border border-surface-container text-xs font-body text-on-surface-variant opacity-75 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-label font-bold text-on-surface">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full p-3 rounded-2xl bg-surface-container-low border border-surface-container text-xs font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-2xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container shadow-sm active:scale-95 transition-all"
          >
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};
