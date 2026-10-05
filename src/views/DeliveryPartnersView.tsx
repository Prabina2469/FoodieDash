import React, { useState } from 'react';
import { MOCK_DELIVERY_PARTNERS, DeliveryPartner } from '../data/mockData';
import { Badge } from '../components/common/Badge';

export const DeliveryPartnersView: React.FC = () => {
  const [partners] = useState<DeliveryPartner[]>(MOCK_DELIVERY_PARTNERS);
  const [filterVehicle, setFilterVehicle] = useState<string>('All');

  const filteredPartners = partners.filter(
    (p) => filterVehicle === 'All' || p.vehicle === filterVehicle
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-container">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-background">
            Delivery Fleet Operations
          </h1>
          <p className="font-body text-xs md:text-sm text-on-surface-variant mt-1">
            Real-time courier dispatch status, live battery levels, and earnings tracking.
          </p>
        </div>

        <button
          onClick={() => alert('New courier onboarding modal opened.')}
          className="px-4 py-2.5 rounded-xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container transition-all shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Onboard Courier
        </button>
      </div>

      {/* Fleet Status Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl ghost-border">
          <span className="font-label text-xs uppercase text-on-surface-variant">Active Fleet</span>
          <p className="font-headline text-2xl font-bold text-on-surface mt-1">{partners.length} Drivers</p>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl ghost-border">
          <span className="font-label text-xs uppercase text-on-surface-variant">Delivering Right Now</span>
          <p className="font-headline text-2xl font-bold text-primary mt-1">
            {partners.filter((p) => p.status === 'Delivering').length}
          </p>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl ghost-border">
          <span className="font-label text-xs uppercase text-on-surface-variant">Available / Idle</span>
          <p className="font-headline text-2xl font-bold text-secondary mt-1">
            {partners.filter((p) => p.status === 'Online').length}
          </p>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl ghost-border">
          <span className="font-label text-xs uppercase text-on-surface-variant">Fleet Avg Rating</span>
          <p className="font-headline text-2xl font-bold text-tertiary mt-1">★ 4.91</p>
        </div>
      </div>

      {/* Simulated Live Fleet Map / Route Heatmap */}
      <div className="bg-gradient-to-r from-surface-container-lowest via-surface-container-low to-surface-container-lowest p-6 rounded-2xl ghost-border shadow-level-1 relative overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">map</span>
            <h3 className="font-headline font-bold text-base text-on-surface">Manhattan Live Courier Heatmap</h3>
          </div>
          <span className="font-label text-xs text-secondary font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
            GPS Satellite Linked
          </span>
        </div>

        <div className="h-44 rounded-xl bg-surface-container-highest/60 border border-surface-container flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#b51c00_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="text-center space-y-1 relative z-10">
            <span className="material-symbols-outlined text-[36px] text-primary">navigation</span>
            <p className="font-label text-xs font-bold text-on-surface">Interactive Route Optimization Engine</p>
            <p className="font-body text-[11px] text-on-surface-variant">Zone 1 (Midtown): 98% On-Time • Zone 2 (Downtown): 95% On-Time</p>
          </div>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-headline text-lg font-bold text-on-surface">Registered Fleet Personnel</h3>
          <div className="flex gap-1.5">
            {['All', 'Motorbike', 'Scooter', 'E-Bike'].map((veh) => (
              <button
                key={veh}
                onClick={() => setFilterVehicle(veh)}
                className={`px-3 py-1 rounded-lg font-label text-xs font-semibold ${
                  filterVehicle === veh ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant'
                }`}
              >
                {veh}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredPartners.map((partner) => (
            <div
              key={partner.id}
              className="p-5 rounded-2xl bg-surface-container-lowest ghost-border shadow-level-1 space-y-4 hover:shadow-level-2 transition-all"
            >
              <div className="flex items-center justify-between">
                <img
                  src={partner.avatar}
                  alt={partner.name}
                  className="w-12 h-12 rounded-full object-cover ghost-border"
                />
                <Badge status={partner.status} size="sm" />
              </div>

              <div>
                <h4 className="font-headline font-bold text-sm text-on-surface">{partner.name}</h4>
                <p className="font-body text-xs text-on-surface-variant mt-0.5">{partner.phone}</p>
                <p className="font-label text-[11px] text-primary font-bold mt-1">Vehicle: {partner.vehicle}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-surface-container-low text-xs space-y-1 font-body text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Current Zone:</span>
                  <span className="font-medium text-on-surface truncate max-w-[120px]">{partner.currentLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span>Battery / Fuel:</span>
                  <span className="font-medium text-secondary">{partner.batteryOrFuel}</span>
                </div>
                <div className="flex justify-between">
                  <span>Earnings Today:</span>
                  <span className="font-bold text-on-surface">${partner.earningsToday.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
