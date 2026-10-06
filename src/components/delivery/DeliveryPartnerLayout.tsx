import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const DeliveryPartnerLayout: React.FC = () => {
  const { userProfile, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-body">
      {/* Delivery Header */}
      <header className="sticky top-0 z-40 bg-surface-container-lowest/80 backdrop-blur-md border-b border-surface-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link to="/delivery" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-500 flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  two_wheeler
                </span>
              </div>
              <div>
                <span className="font-display font-extrabold text-lg text-on-surface tracking-tight block leading-tight">
                  FoodieDash
                </span>
                <span className="text-[10px] font-label font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block -mt-0.5">
                  Delivery Fleet Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-label font-bold text-on-surface-variant">
            <Link to="/delivery" className="text-primary hover:text-primary transition-colors">
              Dispatch Console
            </Link>
            <span className="text-outline/40">|</span>
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">restaurant</span>
              Customer Storefront
            </Link>
          </nav>

          {/* User Info & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-label font-bold text-on-surface">
                {userProfile?.name || 'Delivery Partner'}
              </span>
              <span className="text-[10px] font-label font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                {role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="py-1.5 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label text-xs font-semibold transition-all flex items-center gap-1.5"
              title="Sign Out"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Delivery Footer */}
      <footer className="border-t border-surface-container bg-surface-container-lowest/50 py-4 text-center text-xs text-on-surface-variant font-label">
        FoodieDash Fleet Operations &bull; Authoritative Role: <span className="font-bold text-cyan-600">{role}</span>
      </footer>
    </div>
  );
};
