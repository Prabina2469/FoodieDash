import React from 'react';
import { Outlet } from 'react-router-dom';
import { CustomerNavbar } from './CustomerNavbar';
import { CustomerFooter } from './CustomerFooter';
import { MobileNavbar } from './MobileNavbar';
import { LocationModal } from './LocationModal';

export const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col antialiased selection:bg-primary-fixed selection:text-primary">
      {/* Top Sticky Customer Header */}
      <CustomerNavbar />

      {/* Delivery Location Selector Modal */}
      <LocationModal />

      {/* Main Page Body Canvas */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Desktop / Mobile Platform Footer */}
      <CustomerFooter />

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileNavbar />
    </div>
  );
};
