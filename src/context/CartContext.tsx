import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import { CartItem, MenuItem, MenuItemCustomization, Coupon } from '../types';

export const PLATFORM_COUPONS: Coupon[] = [
  {
    code: 'FOODIE20',
    title: '20% OFF Everything',
    description: 'Get 20% off on all orders above $25 (Max discount $12)',
    discountType: 'PERCENT',
    discountValue: 20,
    minOrderValue: 25,
    maxDiscount: 12,
    expiresAt: '2026-12-31'
  },
  {
    code: 'FLAT10',
    title: 'Flat $10 OFF',
    description: 'Enjoy $10 instant discount on orders above $35',
    discountType: 'FLAT',
    discountValue: 10,
    minOrderValue: 35,
    expiresAt: '2026-12-31'
  },
  {
    code: 'FREEDEL',
    title: 'Free Delivery',
    description: 'Zero delivery charges on your delicious feast (Orders above $20)',
    discountType: 'FREE_DELIVERY',
    discountValue: 2.99,
    minOrderValue: 20,
    expiresAt: '2026-12-31'
  },
  {
    code: 'WELCOME30',
    title: 'New Customer Welcome',
    description: '30% off on your first FoodieDash order (Max discount $15)',
    discountType: 'PERCENT',
    discountValue: 30,
    minOrderValue: 20,
    maxDiscount: 15,
    expiresAt: '2026-12-31'
  }
];

interface CartContextType {
  items: CartItem[];
  restaurantId: number | null;
  restaurantName: string | null;
  itemCount: number;
  itemTotal: number;
  deliveryFee: number;
  platformFee: number;
  tax: number;
  discount: number;
  grandTotal: number;
  appliedCoupon: Coupon | null;
  couponError: string | null;
  loading: boolean;
  addItem: (item: MenuItem, restaurant: { id: number; name: string }, quantity?: number, customization?: MenuItemCustomization) => Promise<boolean>;
  updateQuantity: (menuItemId: number, deltaOrQuantity: number, isAbsolute?: boolean) => Promise<void>;
  removeItem: (menuItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  getMenuItemQuantity: (menuItemId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('foodiedash_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [restaurantId, setRestaurantId] = useState<number | null>(() => {
    const saved = localStorage.getItem('foodiedash_cart_restaurant_id');
    return saved ? Number(saved) : null;
  });
  const [restaurantName, setRestaurantName] = useState<string | null>(() => {
    return localStorage.getItem('foodiedash_cart_restaurant_name') || null;
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('foodiedash_cart', JSON.stringify(items));
    if (restaurantId !== null) {
      localStorage.setItem('foodiedash_cart_restaurant_id', String(restaurantId));
    } else {
      localStorage.removeItem('foodiedash_cart_restaurant_id');
    }
    if (restaurantName) {
      localStorage.setItem('foodiedash_cart_restaurant_name', restaurantName);
    } else {
      localStorage.removeItem('foodiedash_cart_restaurant_name');
    }
  }, [items, restaurantId, restaurantName]);

  // Load from backend cart if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const syncBackendCart = async () => {
        setLoading(true);
        try {
          const backendCart = await cartService.getCart();
          if (backendCart && backendCart.items && backendCart.items.length > 0) {
            setItems(backendCart.items);
            if (backendCart.restaurantId) {
              setRestaurantId(backendCart.restaurantId);
            }
          }
        } catch (err) {
          console.warn('Backend cart load fallback:', err);
        } finally {
          setLoading(false);
        }
      };
      syncBackendCart();
    }
  }, [isAuthenticated]);

  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const itemTotal = items.reduce((acc, i) => acc + (i.price * i.quantity), 0);

  // Delivery & Platform Fees
  const standardDeliveryFee = itemTotal >= 35 ? 0 : 2.99;
  const platformFee = items.length > 0 ? 1.50 : 0;
  const tax = Number((itemTotal * 0.08).toFixed(2));

  // Discount calculation
  let discount = 0;
  let deliveryFee = standardDeliveryFee;

  if (appliedCoupon && itemTotal >= appliedCoupon.minOrderValue) {
    if (appliedCoupon.discountType === 'PERCENT') {
      let val = (itemTotal * appliedCoupon.discountValue) / 100;
      if (appliedCoupon.maxDiscount && val > appliedCoupon.maxDiscount) {
        val = appliedCoupon.maxDiscount;
      }
      discount = Number(val.toFixed(2));
    } else if (appliedCoupon.discountType === 'FLAT') {
      discount = appliedCoupon.discountValue;
    } else if (appliedCoupon.discountType === 'FREE_DELIVERY') {
      deliveryFee = 0;
      discount = standardDeliveryFee;
    }
  }

  const grandTotal = Math.max(0, Number((itemTotal + deliveryFee + platformFee + tax - (appliedCoupon?.discountType === 'FREE_DELIVERY' ? 0 : discount)).toFixed(2)));

  const addItem = async (
    menuItem: MenuItem,
    restaurant: { id: number; name: string },
    quantity = 1,
    customization?: MenuItemCustomization
  ): Promise<boolean> => {
    // If cart has items from different restaurant, confirm replacement
    if (items.length > 0 && restaurantId !== null && restaurantId !== restaurant.id) {
      const confirmReset = window.confirm(
        `Your cart contains dishes from "${restaurantName || 'another restaurant'}". Would you like to reset your cart to add items from "${restaurant.name}"?`
      );
      if (!confirmReset) return false;
      await clearCart();
    }

    setRestaurantId(restaurant.id);
    setRestaurantName(restaurant.name);

    // Calculate item unit price with customizations
    let unitPrice = menuItem.price;
    if (customization?.sizePrice) {
      unitPrice += customization.sizePrice;
    }
    if (customization?.addOns) {
      const addOnsTotal = customization.addOns.reduce((sum, a) => sum + a.price, 0);
      unitPrice += addOnsTotal;
    }

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.menuItemId === menuItem.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          subTotal: Number((newQty * unitPrice).toFixed(2)),
          customization: customization || updated[existingIndex].customization
        };
        return updated;
      } else {
        const newItem: CartItem = {
          menuItemId: menuItem.id,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          itemName: menuItem.name,
          quantity: quantity,
          price: unitPrice,
          subTotal: Number((quantity * unitPrice).toFixed(2)),
          isVeg: menuItem.isVeg,
          image: menuItem.image,
          customization
        };
        return [...prev, newItem];
      }
    });

    if (isAuthenticated) {
      try {
        await cartService.addItem({
          menuItemId: menuItem.id,
          restaurantId: restaurant.id,
          quantity,
          itemName: menuItem.name,
          price: unitPrice
        });
      } catch (err) {
        console.warn('Backend cart item sync note:', err);
      }
    }

    return true;
  };

  const updateQuantity = async (menuItemId: number, deltaOrQuantity: number, isAbsolute = false) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.menuItemId === menuItemId) {
            const newQty = isAbsolute ? deltaOrQuantity : item.quantity + deltaOrQuantity;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              subTotal: Number((newQty * item.price).toFixed(2))
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });

    const currentItem = items.find((i) => i.menuItemId === menuItemId);
    const newQty = isAbsolute ? deltaOrQuantity : (currentItem?.quantity || 0) + deltaOrQuantity;

    if (isAuthenticated && currentItem?.id) {
      try {
        if (newQty <= 0) {
          await cartService.removeItem(currentItem.id);
        } else {
          await cartService.updateItemQuantity(currentItem.id, { quantity: newQty });
        }
      } catch (e) {
        console.warn('Cart backend quantity update note:', e);
      }
    }

    if (items.length <= 1 && newQty <= 0) {
      setRestaurantId(null);
      setRestaurantName(null);
      setAppliedCoupon(null);
    }
  };

  const removeItem = async (menuItemId: number) => {
    const itemToRemove = items.find((i) => i.menuItemId === menuItemId);
    setItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId));

    if (items.length <= 1) {
      setRestaurantId(null);
      setRestaurantName(null);
      setAppliedCoupon(null);
    }

    if (isAuthenticated && itemToRemove?.id) {
      try {
        await cartService.removeItem(itemToRemove.id);
      } catch (e) {
        console.warn('Backend removeItem note:', e);
      }
    }
  };

  const clearCart = async () => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantName(null);
    setAppliedCoupon(null);
    localStorage.removeItem('foodiedash_cart');
    localStorage.removeItem('foodiedash_cart_restaurant_id');
    localStorage.removeItem('foodiedash_cart_restaurant_name');

    if (isAuthenticated) {
      try {
        await cartService.clearCart();
      } catch (e) {
        console.warn('Backend clearCart note:', e);
      }
    }
  };

  const applyCoupon = (code: string): boolean => {
    setCouponError(null);
    const found = PLATFORM_COUPONS.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      setCouponError('Invalid promo code. Please check and try again.');
      return false;
    }
    if (itemTotal < found.minOrderValue) {
      setCouponError(`Add $${(found.minOrderValue - itemTotal).toFixed(2)} more to apply "${found.code}"`);
      return false;
    }
    setAppliedCoupon(found);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const getMenuItemQuantity = (menuItemId: number): number => {
    const item = items.find((i) => i.menuItemId === menuItemId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantId,
        restaurantName,
        itemCount,
        itemTotal,
        deliveryFee,
        platformFee,
        tax,
        discount,
        grandTotal,
        appliedCoupon,
        couponError,
        loading,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        getMenuItemQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
