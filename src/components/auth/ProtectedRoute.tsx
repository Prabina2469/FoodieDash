import React from 'react';
import { RoleProtectedRoute } from './RoleProtectedRoute';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return <RoleProtectedRoute>{children}</RoleProtectedRoute>;
};
