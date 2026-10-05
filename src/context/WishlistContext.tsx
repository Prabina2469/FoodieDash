import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { restaurantService } from '../services/restaurantService';
import { useAuth } from './AuthContext';
import { Restaurant, MenuItem } from '../types';

export interface WishlistEntry {
  id?: number;
  restaurantId?: number;
  menuItemId?: number;
  restaurant?: Restaurant;
  menuItem?: MenuItem;
}

interface WishlistContextType {
  wishlist: WishlistEntry[];
  wishlistRestaurantIds: Set<number>;
  wishlistMenuItemIds: Set<number>;
  toggleRestaurantWishlist: (restaurant: Restaurant) => Promise<void>;
  toggleMenuItemWishlist: (menuItem: MenuItem, restaurantId: number) => Promise<void>;
  isRestaurantWishlisted: (restaurantId: number) => boolean;
  isMenuItemWishlisted: (menuItemId: number) => boolean;
  removeWishlistEntry: (entryId: number, restaurantId?: number, menuItemId?: number) => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistEntry[]>(() => {
    try {
      const saved = localStorage.getItem('foodiedash_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('foodiedash_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchWishlist = async () => {
        try {
          setLoading(true);
          const backendWishlist = await restaurantService.getUserWishlist();
          if (Array.isArray(backendWishlist) && backendWishlist.length > 0) {
            setWishlist(backendWishlist);
          }
        } catch (err) {
          console.warn('Backend wishlist fetch note:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const wishlistRestaurantIds = new Set(
    wishlist.map((w) => w.restaurantId || w.restaurant?.id).filter(Boolean) as number[]
  );

  const wishlistMenuItemIds = new Set(
    wishlist.map((w) => w.menuItemId || w.menuItem?.id).filter(Boolean) as number[]
  );

  const isRestaurantWishlisted = (restaurantId: number) => wishlistRestaurantIds.has(restaurantId);
  const isMenuItemWishlisted = (menuItemId: number) => wishlistMenuItemIds.has(menuItemId);

  const toggleRestaurantWishlist = async (restaurant: Restaurant) => {
    const isPresent = isRestaurantWishlisted(restaurant.id);
    if (isPresent) {
      const entry = wishlist.find((w) => (w.restaurantId === restaurant.id || w.restaurant?.id === restaurant.id));
      setWishlist((prev) => prev.filter((w) => !(w.restaurantId === restaurant.id || w.restaurant?.id === restaurant.id)));
      if (isAuthenticated && entry?.id) {
        try {
          await restaurantService.removeFromWishlist(entry.id);
        } catch (e) {
          console.warn('Remove restaurant wishlist note:', e);
        }
      }
    } else {
      const newEntry: WishlistEntry = {
        restaurantId: restaurant.id,
        restaurant: restaurant
      };
      setWishlist((prev) => [...prev, newEntry]);
      if (isAuthenticated) {
        try {
          const res = await restaurantService.addRestaurantToWishlist(restaurant.id);
          if (res?.id) {
            setWishlist((prev) => prev.map((w) => (w.restaurantId === restaurant.id ? { ...w, id: res.id } : w)));
          }
        } catch (e) {
          console.warn('Add restaurant wishlist note:', e);
        }
      }
    }
  };

  const toggleMenuItemWishlist = async (menuItem: MenuItem, restaurantId: number) => {
    const isPresent = isMenuItemWishlisted(menuItem.id);
    if (isPresent) {
      const entry = wishlist.find((w) => (w.menuItemId === menuItem.id || w.menuItem?.id === menuItem.id));
      setWishlist((prev) => prev.filter((w) => !(w.menuItemId === menuItem.id || w.menuItem?.id === menuItem.id)));
      if (isAuthenticated && entry?.id) {
        try {
          await restaurantService.removeFromWishlist(entry.id);
        } catch (e) {
          console.warn('Remove menu item wishlist note:', e);
        }
      }
    } else {
      const newEntry: WishlistEntry = {
        menuItemId: menuItem.id,
        restaurantId: restaurantId,
        menuItem: menuItem
      };
      setWishlist((prev) => [...prev, newEntry]);
      if (isAuthenticated) {
        try {
          const res = await restaurantService.addMenuItemToWishlist(menuItem.id);
          if (res?.id) {
            setWishlist((prev) => prev.map((w) => (w.menuItemId === menuItem.id ? { ...w, id: res.id } : w)));
          }
        } catch (e) {
          console.warn('Add menu item wishlist note:', e);
        }
      }
    }
  };

  const removeWishlistEntry = async (entryId: number, restaurantId?: number, menuItemId?: number) => {
    setWishlist((prev) => prev.filter((w) => {
      if (w.id && w.id === entryId) return false;
      if (restaurantId && (w.restaurantId === restaurantId || w.restaurant?.id === restaurantId)) return false;
      if (menuItemId && (w.menuItemId === menuItemId || w.menuItem?.id === menuItemId)) return false;
      return true;
    }));

    if (isAuthenticated && entryId) {
      try {
        await restaurantService.removeFromWishlist(entryId);
      } catch (e) {
        console.warn('Remove wishlist entry note:', e);
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistRestaurantIds,
        wishlistMenuItemIds,
        toggleRestaurantWishlist,
        toggleMenuItemWishlist,
        isRestaurantWishlisted,
        isMenuItemWishlisted,
        removeWishlistEntry,
        loading
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
