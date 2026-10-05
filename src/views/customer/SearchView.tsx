import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { restaurantService } from '../../services/restaurantService';
import { Restaurant, MenuItem } from '../../types';
import { RestaurantCard } from '../../components/customer/common/RestaurantCard';
import { FoodCard } from '../../components/customer/common/FoodCard';

const POPULAR_SEARCH_TERMS = [
  'Biryani',
  'Truffle Pasta',
  'Ramen',
  'Smash Burger',
  'Dim Sum',
  'Tacos',
  'Healthy Bowl',
  'Lava Cake',
  'Pizza',
  'Salad'
];

export const SearchView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'restaurants' | 'dishes'>('all');
  const [vegOnly, setVegOnly] = useState(false);
  const [topRatedOnly, setTopRatedOnly] = useState(false);

  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const data = await restaurantService.getAllRestaurants();
        setRestaurants(data);
      } catch (err) {
        console.warn('Search restaurant catalog load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val.trim() });
    } else {
      setSearchParams({});
    }
  };

  // Collect all dishes across all restaurants with restaurant reference
  const allDishes: Array<{ item: MenuItem; restaurant: { id: number; name: string } }> = [];
  restaurants.forEach((r) => {
    if (r.menuItems) {
      r.menuItems.forEach((m) => {
        allDishes.push({ item: m, restaurant: { id: r.id, name: r.name } });
      });
    }
  });

  const query = searchQuery.toLowerCase().trim();

  // Filter restaurants
  const matchedRestaurants = restaurants.filter((r) => {
    if (topRatedOnly && r.rating < 4.7) return false;
    if (vegOnly && !r.menuItems?.some((m) => m.isVeg)) return false;
    if (!query) return true;

    const matchName = r.name.toLowerCase().includes(query);
    const matchCuisine = r.cuisine.toLowerCase().includes(query);
    const matchDish = r.menuItems?.some((m) => m.name.toLowerCase().includes(query) || m.description?.toLowerCase().includes(query));
    return matchName || matchCuisine || matchDish;
  });

  // Filter dishes
  const matchedDishes = allDishes.filter(({ item, restaurant }) => {
    if (vegOnly && !item.isVeg) return false;
    if (!query) return true;

    const matchName = item.name.toLowerCase().includes(query);
    const matchDesc = item.description?.toLowerCase().includes(query);
    const matchCategory = item.categoryName?.toLowerCase().includes(query);
    const matchRest = restaurant.name.toLowerCase().includes(query);
    return matchName || matchDesc || matchCategory || matchRest;
  });

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Bar Header */}
      <div className="max-w-2xl mx-auto space-y-4 text-center">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-on-surface">
          Search FoodieDash
        </h1>

        {/* Search Input Box */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-[24px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search for restaurants, dishes, biryani, burgers or pizza..."
            autoFocus
            className="w-full pl-12 pr-10 py-4 bg-surface-container-lowest border-2 border-primary/30 focus:border-primary rounded-3xl text-sm sm:text-base font-body text-on-surface placeholder:text-on-surface-variant shadow-level-1 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-1 rounded-full"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>

        {/* Popular Search Suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="text-xs font-label text-outline font-semibold">Popular:</span>
          {POPULAR_SEARCH_TERMS.map((term) => (
            <button
              key={term}
              onClick={() => handleSearchChange(term)}
              className={`px-3 py-1 rounded-full text-xs font-label font-bold transition-all ${
                query === term.toLowerCase()
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
              }`}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Tab Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-surface-container pb-4">
        {/* Result Category Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-2xl font-label text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-on-surface text-white'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`px-4 py-2 rounded-2xl font-label text-xs font-bold transition-all ${
              activeTab === 'restaurants'
                ? 'bg-primary text-white'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
            }`}
          >
            Restaurants ({matchedRestaurants.length})
          </button>
          <button
            onClick={() => setActiveTab('dishes')}
            className={`px-4 py-2 rounded-2xl font-label text-xs font-bold transition-all ${
              activeTab === 'dishes'
                ? 'bg-primary text-white'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
            }`}
          >
            Dishes ({matchedDishes.length})
          </button>
        </div>

        {/* Secondary Filter Toggles */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-surface-container-low hover:bg-surface-container cursor-pointer select-none text-xs font-label font-bold border border-surface-container">
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={(e) => setVegOnly(e.target.checked)}
              className="accent-secondary w-4 h-4 rounded"
            />
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              Veg Only
            </span>
          </label>

          <label className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-surface-container-low hover:bg-surface-container cursor-pointer select-none text-xs font-label font-bold border border-surface-container">
            <input
              type="checkbox"
              checked={topRatedOnly}
              onChange={(e) => setTopRatedOnly(e.target.checked)}
              className="accent-secondary w-4 h-4 rounded"
            />
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              4.7+ Rated
            </span>
          </label>
        </div>
      </div>

      {/* Results Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-48 bg-surface-container-low rounded-3xl" />
          ))}
        </div>
      ) : matchedRestaurants.length === 0 && matchedDishes.length === 0 ? (
        <div className="p-16 rounded-3xl bg-surface-container-lowest ghost-border text-center max-w-md mx-auto space-y-4">
          <span className="material-symbols-outlined text-outline text-[48px]">
            search_off
          </span>
          <h3 className="font-headline font-bold text-lg text-on-surface">No results found for "{searchQuery}"</h3>
          <p className="font-body text-xs text-on-surface-variant leading-relaxed">
            Try searching for something else like Biryani, Ramen, Truffle Pasta, or Smash Burgers.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setVegOnly(false);
              setTopRatedOnly(false);
            }}
            className="px-6 py-2.5 rounded-xl bg-primary text-white font-label text-xs font-bold"
          >
            Reset Search
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Section 1: Restaurants */}
          {(activeTab === 'all' || activeTab === 'restaurants') && matchedRestaurants.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-headline font-bold text-xl text-on-surface flex items-center gap-2">
                  <span>Matching Restaurants</span>
                  <span className="text-xs font-label text-outline font-normal">({matchedRestaurants.length})</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {matchedRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Dishes */}
          {(activeTab === 'all' || activeTab === 'dishes') && matchedDishes.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-headline font-bold text-xl text-on-surface flex items-center gap-2">
                  <span>Matching Dishes</span>
                  <span className="text-xs font-label text-outline font-normal">({matchedDishes.length})</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {matchedDishes.map(({ item, restaurant }) => (
                  <FoodCard key={`${restaurant.id}-${item.id}`} item={item} restaurant={restaurant} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
