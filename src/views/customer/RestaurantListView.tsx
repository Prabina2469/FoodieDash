import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { restaurantService } from '../../services/restaurantService';
import { Restaurant } from '../../types';
import { RestaurantCard } from '../../components/customer/common/RestaurantCard';

export const RestaurantListView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'deliveryTime' | 'priceAsc' | 'priceDesc'>('rating');
  const [vegOnly, setVegOnly] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await restaurantService.getAllRestaurants();
        setRestaurants(data);
      } catch (err) {
        console.warn('Restaurants load error:', err);
        setError('Failed to fetch restaurants.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filtered = restaurants.filter((r) => {
    if (initialCategory && !r.cuisine.toLowerCase().includes(initialCategory.toLowerCase())) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchCuisine = r.cuisine.toLowerCase().includes(q);
      const matchItem = r.menuItems?.some((m) => m.name.toLowerCase().includes(q));
      if (!matchName && !matchCuisine && !matchItem) return false;
    }
    if (vegOnly && !r.menuItems?.some((m) => m.isVeg)) {
      return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'priceAsc') return (a.priceForTwo || 25) - (b.priceForTwo || 25);
    if (sortBy === 'priceDesc') return (b.priceForTwo || 25) - (a.priceForTwo || 25);
    return 0;
  });

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb & Header */}
      <div className="space-y-2">
        <nav className="flex items-center gap-2 text-xs font-label text-outline">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-on-surface font-bold">All Restaurants</span>
        </nav>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-on-surface">
          Explore All FoodieDash Kitchens
        </h1>
        <p className="font-body text-xs sm:text-sm text-on-surface-variant">
          Hand-picked premier food partners across New York with live ordering
        </p>
      </div>

      {/* Filter and Search Controls Toolbar */}
      <div className="p-4 bg-surface-container-lowest rounded-3xl ghost-border shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search restaurants, cuisines or dishes..."
            className="w-full pl-10 pr-8 py-2.5 bg-surface-container-low border border-surface-container rounded-2xl text-xs font-body text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Filter Pills and Sorters */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-surface-container-low hover:bg-surface-container cursor-pointer select-none border border-surface-container">
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={(e) => setVegOnly(e.target.checked)}
              className="accent-secondary w-4 h-4 rounded"
            />
            <span className="font-label text-xs font-bold text-on-surface flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
              Pure Veg / Options
            </span>
          </label>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="font-label text-xs text-outline font-semibold hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2 bg-surface-container-low border border-surface-container rounded-2xl font-label text-xs font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="rating">Top Rated (⭐)</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Restaurant List Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 bg-surface-container-low rounded-3xl" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 rounded-3xl bg-error-container/30 text-center space-y-2">
          <p className="font-bold text-error text-sm">{error}</p>
        </div>
      ) : sorted.length === 0 ? (
        <div className="p-16 rounded-3xl bg-surface-container-lowest ghost-border text-center space-y-4 max-w-md mx-auto">
          <span className="material-symbols-outlined text-outline text-[40px]">restaurant</span>
          <h3 className="font-headline font-bold text-base text-on-surface">No restaurants match your search</h3>
          <p className="font-body text-xs text-on-surface-variant">Try resetting your filters or search keywords.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setVegOnly(false);
            }}
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-label text-xs font-bold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sorted.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
};
