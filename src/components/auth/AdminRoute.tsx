import React from 'react';
import { RoleProtectedRoute } from './RoleProtectedRoute';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  return <RoleProtectedRoute allowedRoles={['ADMIN']}>{children}</RoleProtectedRoute>;
};
