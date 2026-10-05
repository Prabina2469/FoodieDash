import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, role, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-label text-sm text-on-surface-variant font-semibold">Authenticating platform admin session...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to login with admin redirect
  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/admin" replace />;
  }

  // If logged in, but not an ADMIN, show access denied
  if (role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-3xl ghost-border shadow-level-2 text-center">
          <div className="w-16 h-16 rounded-2xl bg-error-container text-error mx-auto flex items-center justify-center mb-5">
            <span className="material-symbols-outlined text-[36px]">security</span>
          </div>
          <h2 className="text-xl font-headline font-bold text-on-surface">Admin Authorization Required</h2>
          <p className="text-sm font-body text-on-surface-variant mt-2 leading-relaxed">
            Your current account role is <span className="font-bold text-primary">{role}</span>. The FoodieDash Operations & Admin Console is restricted to authorized platform administrators.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/"
              className="w-full py-3 px-4 rounded-xl bg-primary text-white font-label text-sm font-bold hover:bg-primary-container transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">restaurant</span>
              Go to Customer Storefront
            </Link>
            <button
              onClick={() => logout()}
              className="w-full py-2.5 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label text-xs font-semibold transition-all"
            >
              Switch Account / Sign In as Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
