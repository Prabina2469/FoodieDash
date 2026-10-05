import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { RestaurantCard } from '../../components/customer/common/RestaurantCard';
import { FoodCard } from '../../components/customer/common/FoodCard';

export const WishlistView: React.FC = () => {
  const { wishlist, loading, removeWishlistEntry } = useWishlist();
  const [activeTab, setActiveTab] = useState<'restaurants' | 'dishes'>('restaurants');

  const restaurants = wishlist.filter((w) => w.restaurant).map((w) => w.restaurant!);
  const dishes = wishlist.filter((w) => w.menuItem).map((w) => ({
    entry: w,
    item: w.menuItem!,
    restaurant: { id: w.restaurantId || w.menuItem!.restaurantId || 1, name: 'FoodieDash Partner Kitchen' }
  }));

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
      {/* Header */}
      <div className="space-y-2">
        <nav className="flex items-center gap-2 text-xs font-label text-outline">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-on-surface font-bold">Wishlist</span>
        </nav>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-on-surface">
          My Saved Favorites ❤️
        </h1>
        <p className="font-body text-xs sm:text-sm text-on-surface-variant">
          Your bookmarked culinary spots and crave-worthy artisan dishes
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-container pb-3">
        <button
          onClick={() => setActiveTab('restaurants')}
          className={`px-4 py-2 rounded-2xl font-label text-xs font-bold transition-all ${
            activeTab === 'restaurants'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
          }`}
        >
          Favorite Restaurants ({restaurants.length})
        </button>
        <button
          onClick={() => setActiveTab('dishes')}
          className={`px-4 py-2 rounded-2xl font-label text-xs font-bold transition-all ${
            activeTab === 'dishes'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
          }`}
        >
          Saved Dishes ({dishes.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-56 bg-surface-container-low rounded-3xl" />
          ))}
        </div>
      ) : activeTab === 'restaurants' ? (
        restaurants.length === 0 ? (
          <div className="p-16 rounded-3xl bg-surface-container-lowest ghost-border text-center space-y-4 max-w-md mx-auto">
            <span className="material-symbols-outlined text-outline text-[48px]">favorite_border</span>
            <h3 className="font-headline font-bold text-lg text-on-surface">No saved restaurants</h3>
            <p className="font-body text-xs text-on-surface-variant">
              Click the heart icon on any restaurant card to save your favorite dining spots.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-label text-xs font-bold"
            >
              Explore Restaurants
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        )
      ) : dishes.length === 0 ? (
        <div className="p-16 rounded-3xl bg-surface-container-lowest ghost-border text-center space-y-4 max-w-md mx-auto">
          <span className="material-symbols-outlined text-outline text-[48px]">bookmark_border</span>
          <h3 className="font-headline font-bold text-lg text-on-surface">No saved dishes</h3>
          <p className="font-body text-xs text-on-surface-variant">
            Save individual dishes from restaurant menus to order them with one click.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-label text-xs font-bold"
          >
            Find Dishes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {dishes.map(({ entry, item, restaurant }) => (
            <FoodCard key={item.id} item={item} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
};
