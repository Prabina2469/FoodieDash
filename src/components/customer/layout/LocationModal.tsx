import React, { useState } from 'react';
import { useLocation } from '../../../context/LocationContext';
import { useAuth } from '../../../context/AuthContext';

const POPULAR_AREAS = [
  { label: 'Midtown Manhattan', street: '350 5th Avenue, Suite 2100', city: 'New York', state: 'NY', zipCode: '10118' },
  { label: 'SoHo & Mercer St', street: '142 Mercer St', city: 'New York', state: 'NY', zipCode: '10012' },
  { label: 'Upper East Side', street: '1040 5th Avenue', city: 'New York', state: 'NY', zipCode: '10028' },
  { label: 'Greenwich Village', street: '88 E 10th St', city: 'New York', state: 'NY', zipCode: '10003' },
  { label: 'Brooklyn DUMBO', street: '55 Water St', city: 'Brooklyn', state: 'NY', zipCode: '11201' },
  { label: 'Financial District', street: '88 Greenwich St', city: 'New York', state: 'NY', zipCode: '10006' }
];

export const LocationModal: React.FC = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    selectLocation,
    selectSavedAddress,
    detectCurrentGpsLocation,
    isDetectingLocation,
    savedAddresses,
    locationError
  } = useLocation();

  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isLocationModalOpen) return null;

  const filteredAreas = POPULAR_AREAS.filter(
    (area) =>
      area.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.street.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl shadow-level-3 ghost-border overflow-hidden max-h-[85vh] flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-container">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-[24px]">
              location_on
            </span>
            <h3 className="font-headline font-bold text-lg text-on-surface">
              Select Delivery Location
            </h3>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Location Search Bar */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for area, street, or landmark..."
              className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-surface-container rounded-2xl text-sm font-body text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
            />
          </div>

          {/* GPS Quick Detect CTA */}
          <button
            onClick={() => detectCurrentGpsLocation()}
            disabled={isDetectingLocation}
            className="w-full p-4 rounded-2xl bg-primary-fixed/30 hover:bg-primary-fixed/50 border border-primary/20 text-left flex items-center gap-3 transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
              <span className={`material-symbols-outlined text-[20px] ${isDetectingLocation ? 'animate-spin' : ''}`}>
                {isDetectingLocation ? 'refresh' : 'my_location'}
              </span>
            </div>
            <div>
              <span className="font-label text-sm font-bold text-primary block">
                {isDetectingLocation ? 'Detecting your coordinates...' : 'Use my current location'}
              </span>
              <span className="font-body text-xs text-on-surface-variant">
                Using browser GPS for precision doorstep delivery
              </span>
            </div>
          </button>

          {locationError && (
            <p className="text-xs text-error font-body bg-error-container/30 p-2.5 rounded-xl border border-error/20">
              {locationError}
            </p>
          )}

          {/* Saved Addresses (for Authenticated Users) */}
          {isAuthenticated && savedAddresses.length > 0 && (
            <div>
              <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-outline mb-3">
                Saved Delivery Addresses
              </h4>
              <div className="space-y-2">
                {savedAddresses.map((addr) => (
                  <button
                    key={addr.id || addr.streetAddress}
                    onClick={() => selectSavedAddress(addr)}
                    className="w-full p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-surface-container text-left flex items-start gap-3 transition-all"
                  >
                    <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                      {addr.label === 'Work' ? 'business' : addr.label === 'Home' ? 'home' : 'pin_drop'}
                    </span>
                    <div>
                      <span className="font-label text-xs font-bold text-on-surface flex items-center gap-2">
                        {addr.label}
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-secondary text-[10px]">
                            Default
                          </span>
                        )}
                      </span>
                      <p className="font-body text-xs text-on-surface-variant mt-0.5 line-clamp-1">
                        {addr.streetAddress}{addr.aptSuite ? `, ${addr.aptSuite}` : ''}, {addr.city}, {addr.state}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Areas in City */}
          <div>
            <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-outline mb-3">
              Popular Delivery Hubs
            </h4>
            <div className="space-y-2">
              {filteredAreas.map((area) => (
                <button
                  key={area.label}
                  onClick={() => selectLocation(area)}
                  className="w-full p-3 rounded-2xl hover:bg-surface-container-low border border-transparent hover:border-surface-container text-left flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-outline group-hover:text-primary text-[20px] transition-colors">
                      location_city
                    </span>
                    <div>
                      <p className="font-label text-xs sm:text-sm font-bold text-on-surface">
                        {area.label}
                      </p>
                      <p className="font-body text-[11px] text-on-surface-variant">
                        {area.street}, {area.city}, {area.state} {area.zipCode}
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">
                    arrow_forward_ios
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
