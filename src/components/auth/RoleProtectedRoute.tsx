import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, role, loading, logout } = useAuth();
  const location = useLocation();

  // 1. Prevent flashing unauthorized content while authentication/role is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-label text-sm text-on-surface-variant font-medium">
            Verifying authentication session & role permissions...
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated: Redirect to login while preserving intended return path
  if (!isAuthenticated) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${returnUrl}`} replace />;
  }

  // 3. Unauthorized Role: Present clear, friendly Access Denied experience
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    const allowedDisplay = allowedRoles.map((r) => r.replace('_', ' ')).join(' or ');
    const currentDisplay = role.replace('_', ' ');

    const getRoleDestination = (userRole: Role): { path: string; label: string; icon: string } => {
      switch (userRole) {
        case 'ADMIN':
          return { path: '/admin', label: 'Admin Console', icon: 'shield' };
        case 'RESTAURANT_OWNER':
          return { path: '/restaurant-owner', label: 'Restaurant Owner Portal', icon: 'storefront' };
        case 'DELIVERY_PARTNER':
          return { path: '/delivery', label: 'Delivery Partner Portal', icon: 'two_wheeler' };
        case 'CUSTOMER':
        default:
          return { path: '/', label: 'Customer Storefront', icon: 'restaurant' };
      }
    };

    const myPortal = getRoleDestination(role);

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-3xl ghost-border shadow-level-2 text-center space-y-5 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-error-container text-error mx-auto flex items-center justify-center">
            <span className="material-symbols-outlined text-[36px]">security</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-headline font-bold text-on-surface">
              Access Restricted
            </h2>
            <p className="text-sm font-body text-on-surface-variant leading-relaxed">
              This section is restricted to <span className="font-bold text-on-surface">{allowedDisplay}</span> accounts.
            </p>
            <div className="p-3 bg-surface-container-low rounded-xl text-xs font-body text-on-surface-variant">
              You are currently authenticated as: <span className="font-bold text-primary">{currentDisplay}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Link
              to={myPortal.path}
              className="w-full py-3 px-4 rounded-xl bg-primary text-white font-label text-sm font-bold hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-glow-primary"
            >
              <span className="material-symbols-outlined text-[18px]">{myPortal.icon}</span>
              Go to Your {myPortal.label}
            </Link>
            <button
              onClick={() => logout()}
              className="w-full py-2.5 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              Sign In with Authorized Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized
  return <>{children}</>;
};
