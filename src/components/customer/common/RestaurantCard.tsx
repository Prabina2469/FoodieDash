import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Restaurant } from '../../../types';
import { useWishlist } from '../../../context/WishlistContext';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

// Curated high quality food photography fallbacks
const CUISINE_IMAGES: Record<string, string> = {
  'Italian': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
  'Japanese': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80',
  'Biryani & Mughlai': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
  'Burgers & Fast Food': 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
  'Chinese & Asian': 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop&q=80',
  'Mexican & Street Food': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80',
  'Healthy & Salads': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
  'Desserts & Coffee': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80'
};

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const navigate = useNavigate();
  const { isRestaurantWishlisted, toggleRestaurantWishlist } = useWishlist();

  const isWishlisted = isRestaurantWishlisted(restaurant.id);

  // Dynamic image based on cuisine
  const imageUrl =
    restaurant.image ||
    CUISINE_IMAGES[restaurant.cuisine] ||
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80';

  const deliveryTime = restaurant.deliveryTime || restaurant.prepTime || '25-30 min';
  const distance = restaurant.distance || '1.8 km';
  const priceForTwo = restaurant.priceForTwo || 25;
  const offerText = restaurant.offerText || (restaurant.id % 2 === 0 ? '20% OFF UP TO $10' : 'FREE DELIVERY');

  return (
    <div
      onClick={() => navigate(`/restaurants/${restaurant.id}`)}
      className="group relative bg-surface-container-lowest rounded-3xl overflow-hidden ghost-border shadow-level-1 hover:shadow-level-3 transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-container-low">
        <img
          src={imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          loading="lazy"
        />

        {/* Gradient Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges: Offer / Featured / Status */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            {restaurant.isOpen ? (
              <span className="px-2.5 py-1 rounded-full bg-secondary text-white font-label text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Open
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-error text-white font-label text-[10px] font-bold uppercase tracking-wider shadow-sm">
                Closed
              </span>
            )}
          </div>

          {/* Bookmark / Wishlist Icon */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleRestaurantWishlist(restaurant);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
              isWishlisted
                ? 'bg-primary text-white scale-110'
                : 'bg-black/40 hover:bg-black/60 text-white'
            }`}
            title={isWishlisted ? 'Saved to Favorites' : 'Save to Favorites'}
          >
            <span
              className="material-symbols-outlined text-[18px] block"
              style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </button>
        </div>

        {/* Bottom Image Ribbon: Promo Offer */}
        {offerText && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-white">
            <span className="material-symbols-outlined text-[18px] text-tertiary-bright">
              local_offer
            </span>
            <span className="font-headline font-extrabold text-xs sm:text-sm tracking-tight drop-shadow-md text-white">
              {offerText}
            </span>
          </div>
        )}
      </div>

      {/* Restaurant Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Title & Rating */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-headline font-bold text-base sm:text-lg text-on-surface group-hover:text-primary transition-colors line-clamp-1">
              {restaurant.name}
            </h3>

            {/* Rating Pill */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-secondary text-white font-label text-xs font-bold shrink-0 shadow-sm">
              <span>{restaurant.rating.toFixed(1)}</span>
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
            </div>
          </div>

          {/* Cuisine & Subtitle */}
          <p className="font-body text-xs text-on-surface-variant font-medium mt-1 line-clamp-1">
            {restaurant.cuisine}
          </p>

          <p className="font-body text-[11px] text-outline mt-0.5 line-clamp-1">
            {restaurant.address}
          </p>
        </div>

        {/* Footer Meta Row: Delivery Time, Distance, Cost for Two */}
        <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between font-label text-xs text-on-surface-variant font-semibold">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-primary">
              schedule
            </span>
            <span>{deliveryTime}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-outline">
              near_me
            </span>
            <span>{distance}</span>
          </div>

          <span className="text-on-surface font-bold">
            ${priceForTwo} for two
          </span>
        </div>
      </div>
    </div>
  );
};
