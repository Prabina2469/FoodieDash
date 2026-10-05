import React, { useState } from 'react';
import { MenuItem } from '../../../types';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { CustomizationModal } from './CustomizationModal';

interface FoodCardProps {
  item: MenuItem;
  restaurant: { id: number; name: string };
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, restaurant }) => {
  const { addItem, updateQuantity, getMenuItemQuantity } = useCart();
  const { isMenuItemWishlisted, toggleMenuItemWishlist } = useWishlist();
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

  const quantity = getMenuItemQuantity(item.id);
  const isWishlisted = isMenuItemWishlisted(item.id);

  // Fallback food image if item has none
  const defaultImage = item.isVeg
    ? 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&auto=format&fit=crop&q=80';

  const imageUrl = item.image || defaultImage;

  const handleAddClick = () => {
    // If item is customizable, open customization dialog
    if (item.customizable || item.price > 12) {
      setShowCustomizeModal(true);
    } else {
      addItem(item, restaurant, 1);
    }
  };

  return (
    <>
      <div className="group relative bg-surface-container-lowest rounded-3xl p-4 sm:p-5 ghost-border shadow-level-1 hover:shadow-level-2 transition-all duration-300 flex flex-col sm:flex-row justify-between gap-4">
        {/* Left Side: Details */}
        <div className="flex-1 flex flex-col justify-between pr-0 sm:pr-2">
          <div>
            {/* Veg / Non-Veg badge + Bestseller */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`w-4 h-4 rounded-sm flex items-center justify-center border shrink-0 ${
                  item.isVeg ? 'border-secondary' : 'border-primary'
                }`}
                title={item.isVeg ? 'Pure Vegetarian' : 'Non-Vegetarian'}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.isVeg ? 'bg-secondary' : 'bg-primary'
                  }`}
                />
              </span>

              {item.isBestseller && (
                <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-tertiary font-label text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">local_fire_department</span>
                  Bestseller
                </span>
              )}

              {item.categoryName && (
                <span className="text-[11px] font-label text-on-surface-variant/80 font-medium">
                  • {item.categoryName}
                </span>
              )}
            </div>

            {/* Dish Name */}
            <h4 className="font-headline font-bold text-base sm:text-lg text-on-surface group-hover:text-primary transition-colors">
              {item.name}
            </h4>

            {/* Price */}
            <div className="flex items-baseline gap-2 mt-1 mb-2">
              <span className="font-headline font-extrabold text-base sm:text-lg text-on-surface">
                ${item.price.toFixed(2)}
              </span>
            </div>

            {/* Description */}
            <p className="font-body text-xs text-on-surface-variant line-clamp-2 sm:line-clamp-3 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Rating or customizable hint */}
          <div className="mt-3 flex items-center gap-3">
            <span className="text-[11px] font-label text-outline flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <span className="font-bold text-on-surface">4.8</span> (120+)
            </span>
            <button
              onClick={() => setShowCustomizeModal(true)}
              className="text-[11px] font-label font-bold text-primary hover:underline"
            >
              Customise ⚙️
            </button>
          </div>
        </div>

        {/* Right Side: Image & Action CTA */}
        <div className="relative flex sm:flex-col items-center justify-between sm:justify-start gap-3 shrink-0">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-surface-container-low shadow-sm">
            <img
              src={imageUrl}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMenuItemWishlist(item, restaurant.id);
              }}
              className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all shadow-sm ${
                isWishlisted
                  ? 'bg-primary text-white scale-110'
                  : 'bg-white/80 hover:bg-white text-on-surface-variant hover:text-primary'
              }`}
              title={isWishlisted ? 'Remove from favorites' : 'Add to favorites'}
            >
              <span
                className="material-symbols-outlined text-[16px] block"
                style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
            </button>
          </div>

          {/* ADD / Quantity Modifier Button */}
          <div className="relative sm:-mt-6 z-10">
            {quantity > 0 ? (
              <div className="flex items-center gap-2 bg-primary text-white rounded-xl px-2 py-1.5 shadow-md font-label text-xs font-bold ring-2 ring-white">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-black/20 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">remove</span>
                </button>
                <span className="px-1 text-sm font-extrabold">{quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-black/20 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddClick}
                className="px-6 py-2 rounded-xl bg-surface-container-lowest text-primary font-label text-xs font-extrabold uppercase tracking-wider border-2 border-primary/30 hover:border-primary hover:bg-primary hover:text-white shadow-sm active:scale-95 transition-all duration-200"
              >
                + ADD
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Customization Dialog */}
      <CustomizationModal
        item={item}
        isOpen={showCustomizeModal}
        onClose={() => setShowCustomizeModal(false)}
        onAddToCart={(itm, qty, cust) => addItem(itm, restaurant, qty, cust)}
      />
    </>
  );
};
