import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Address } from '../types';
import { useAuth } from './AuthContext';
import { userService } from '../services/userService';

export interface LocationState {
  label: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

interface LocationContextType {
  currentLocation: LocationState;
  savedAddresses: Address[];
  isLocationModalOpen: boolean;
  isDetectingLocation: boolean;
  locationError: string | null;
  setIsLocationModalOpen: (open: boolean) => void;
  selectLocation: (location: Partial<LocationState>) => void;
  selectSavedAddress: (address: Address) => void;
  detectCurrentGpsLocation: () => Promise<void>;
  refreshAddresses: () => Promise<void>;
}

const DEFAULT_LOCATION: LocationState = {
  label: 'Midtown Manhattan',
  streetAddress: '350 5th Avenue, Suite 2100',
  city: 'New York',
  state: 'NY',
  zipCode: '10118',
  latitude: 40.7484,
  longitude: -73.9857
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<LocationState>(() => {
    try {
      const saved = localStorage.getItem('foodiedash_location');
      return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('foodiedash_location', JSON.stringify(currentLocation));
  }, [currentLocation]);

  const refreshAddresses = async () => {
    if (isAuthenticated) {
      try {
        const addresses = await userService.getMyAddresses();
        setSavedAddresses(addresses || []);
        const defaultAddr = addresses.find((a) => a.isDefault);
        if (defaultAddr) {
          selectSavedAddress(defaultAddr);
        }
      } catch (err) {
        console.warn('Could not fetch user addresses:', err);
      }
    } else {
      setSavedAddresses([]);
    }
  };

  useEffect(() => {
    refreshAddresses();
  }, [isAuthenticated]);

  const selectLocation = (location: Partial<LocationState>) => {
    setCurrentLocation((prev) => ({
      ...prev,
      ...location
    }));
    setIsLocationModalOpen(false);
  };

  const selectSavedAddress = (address: Address) => {
    setCurrentLocation({
      label: address.label || 'Saved Address',
      streetAddress: address.streetAddress + (address.aptSuite ? `, ${address.aptSuite}` : ''),
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      latitude: 40.7128,
      longitude: -74.006
    });
    setIsLocationModalOpen(false);
  };

  const detectCurrentGpsLocation = async (): Promise<void> => {
    setIsDetectingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setIsDetectingLocation(false);
      return;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCurrentLocation({
            label: 'Current Location (GPS)',
            streetAddress: `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° W`,
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            latitude: lat,
            longitude: lng
          });
          setIsDetectingLocation(false);
          setIsLocationModalOpen(false);
          resolve();
        },
        (error) => {
          console.warn('Geolocation lookup notice:', error.message);
          // Graceful fallback to default delivery hub
          setCurrentLocation(DEFAULT_LOCATION);
          setLocationError('Location permission was denied or timed out. Defaulted to NYC delivery hub.');
          setIsDetectingLocation(false);
          resolve();
        },
        { timeout: 8000, enableHighAccuracy: false }
      );
    });
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        savedAddresses,
        isLocationModalOpen,
        isDetectingLocation,
        locationError,
        setIsLocationModalOpen,
        selectLocation,
        selectSavedAddress,
        detectCurrentGpsLocation,
        refreshAddresses
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
