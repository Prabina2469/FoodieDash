import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { useWishlist } from '../../../context/WishlistContext';

export const MobileNavbar: React.FC = () => {
  const { itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const { wishlist } = useWishlist();

  const items = [
    { to: '/', label: 'Home', icon: 'home' },
    { to: '/search', label: 'Search', icon: 'search' },
    { to: '/orders', label: 'Orders', icon: 'receipt_long' },
    { to: '/wishlist', label: 'Wishlist', icon: 'favorite', badge: wishlist.length > 0 ? wishlist.length : undefined },
    { to: '/cart', label: 'Cart', icon: 'shopping_bag', badge: itemCount > 0 ? itemCount : undefined },
    { to: isAuthenticated ? '/profile' : '/login', label: isAuthenticated ? 'Profile' : 'Sign In', icon: 'person' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-lg border-t border-surface-container px-2 py-1.5 shadow-level-3">
      <nav className="flex items-center justify-around">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-3 rounded-2xl transition-all relative ${
                isActive
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <span
                    className="material-symbols-outlined text-[24px]"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-extrabold flex items-center justify-center ring-2 ring-surface">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-label mt-0.5 tracking-tight">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
