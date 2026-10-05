import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { restaurantService } from '../../services/restaurantService';
import { aiService, AiQuickSummaryResponse } from '../../services/aiService';
import { Restaurant } from '../../types';
import { useLocation } from '../../context/LocationContext';
import { CategoryPill } from '../../components/customer/common/CategoryPill';
import { RestaurantCard } from '../../components/customer/common/RestaurantCard';

export const FOOD_CATEGORIES = [
  { id: 'pizza', name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80', count: '14' },
  { id: 'burgers', name: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80', count: '18' },
  { id: 'biryani', name: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80', count: '12' },
  { id: 'chinese', name: 'Chinese', image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=300&auto=format&fit=crop&q=80', count: '16' },
  { id: 'north-indian', name: 'North Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&auto=format&fit=crop&q=80', count: '20' },
  { id: 'south-indian', name: 'South Indian', image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=300&auto=format&fit=crop&q=80', count: '10' },
  { id: 'healthy', name: 'Healthy', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=80', count: '15' },
  { id: 'mexican', name: 'Mexican', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&auto=format&fit=crop&q=80', count: '9' },
  { id: 'desserts', name: 'Desserts', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=80', count: '22' },
  { id: 'coffee', name: 'Coffee', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=80', count: '11' },
  { id: 'breakfast', name: 'Breakfast', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=300&auto=format&fit=crop&q=80', count: '13' },
  { id: 'chicken', name: 'Chicken', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300&auto=format&fit=crop&q=80', count: '25' },
  { id: 'fast-food', name: 'Fast Food', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=300&auto=format&fit=crop&q=80', count: '30' },
];

export const CustomerHomeView: React.FC = () => {
  const navigate = useNavigate();
  const { currentLocation, setIsLocationModalOpen } = useLocation();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchHeroText, setSearchHeroText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'veg' | 'rating' | 'fast' | 'offers'>('all');
  const [aiInsight, setAiInsight] = useState<AiQuickSummaryResponse | null>(null);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await restaurantService.getAllRestaurants();
      setRestaurants(data);
    } catch (err: any) {
      console.warn('Backend restaurant fetch error:', err);
      setError('Unable to load restaurants from service. Please check API Gateway status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
    aiService.getQuickInsights().then((res) => setAiInsight(res)).catch(() => {});
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchHeroText.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchHeroText.trim())}`);
    } else {
      navigate('/search');
    }
  };

  // Filter restaurants
  const filteredRestaurants = restaurants.filter((r) => {
    if (selectedCategory) {
      const matchCategory =
        r.cuisine.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        r.name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        r.menuItems?.some((m) =>
          m.categoryName?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          m.name.toLowerCase().includes(selectedCategory.toLowerCase())
        );
      if (!matchCategory) return false;
    }

    if (activeFilter === 'veg') {
      return r.menuItems?.some((m) => m.isVeg);
    }
    if (activeFilter === 'rating') {
      return r.rating >= 4.7;
    }
    if (activeFilter === 'fast') {
      return r.prepTime?.includes('15') || r.prepTime?.includes('20') || r.id % 2 === 0;
    }
    if (activeFilter === 'offers') {
      return r.id % 2 === 0;
    }
    return true;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-fixed/40 via-surface-container-low to-background pt-8 pb-16 px-4 sm:px-6 lg:px-8 border-b border-surface-container/60">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-lowest border border-surface-container shadow-sm">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="font-label text-xs font-bold text-on-surface">
                ⚡ 25-Min Delivery Guarantee Across NYC
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-on-surface tracking-tight leading-[1.1]">
                Good food. <br />
                <span className="bg-gradient-to-r from-primary to-primary-bright bg-clip-text text-transparent">
                  Delivered fast.
                </span>
              </h1>
              <p className="font-body text-base sm:text-lg text-on-surface-variant max-w-xl leading-relaxed">
                Discover delicious food from top-rated restaurants near you. Handcrafted burgers, royal dum biryani, artisan pasta, and fresh ramen.
              </p>
            </div>

            {/* Location Selector Bar */}
            <div className="flex items-center gap-3 p-2 bg-surface-container-lowest rounded-2xl ghost-border shadow-level-1 max-w-xl">
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-left text-xs font-headline font-bold text-on-surface transition-all shrink-0"
              >
                <span className="material-symbols-outlined text-primary text-[18px]">
                  location_on
                </span>
                <span className="truncate max-w-[160px]">
                  {currentLocation.label}
                </span>
                <span className="material-symbols-outlined text-outline text-[16px]">
                  expand_more
                </span>
              </button>

              {/* Quick Search Form */}
              <form onSubmit={handleHeroSearch} className="flex-1 relative">
                <input
                  type="text"
                  value={searchHeroText}
                  onChange={(e) => setSearchHeroText(e.target.value)}
                  placeholder="Search restaurants, dishes or cuisines..."
                  className="w-full pl-3 pr-8 py-2 bg-transparent text-sm font-body text-on-surface placeholder:text-on-surface-variant focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-primary text-white hover:bg-primary-container transition-all"
                  aria-label="Search"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </form>
            </div>

            {/* Hero Quick CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  const target = document.getElementById('restaurant-discovery');
                  target?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-2xl bg-primary text-white font-label text-sm font-bold hover:bg-primary-container shadow-glow-primary active:scale-95 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">explore</span>
                Explore Restaurants
              </button>
              <Link
                to="/offers"
                className="px-6 py-3.5 rounded-2xl bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label text-sm font-bold ghost-border shadow-sm active:scale-95 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px] text-tertiary">local_offer</span>
                View Offers & Discounts
              </Link>
            </div>
          </div>

          {/* Right Hero Visual Cards */}
          <div className="lg:col-span-5 relative hidden md:block">
            <div className="relative mx-auto w-full max-w-md aspect-square">
              {/* Main Center Image */}
              <div className="w-full h-full rounded-3xl overflow-hidden ghost-border shadow-level-3">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80"
                  alt="Delicious Food Spread"
                  className="w-full h-full object-cover animate-soft-pulse"
                />
              </div>

              {/* Floating Badge 1: Top Rated */}
              <div className="absolute -top-4 -left-4 p-3.5 bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl shadow-level-2 ghost-border flex items-center gap-3 animate-bounce duration-1000">
                <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                </div>
                <div>
                  <span className="font-label text-xs font-bold text-on-surface block">4.9 Star Cuisines</span>
                  <span className="font-body text-[11px] text-on-surface-variant">Top chef reviewed</span>
                </div>
              </div>

              {/* Floating Badge 2: Fast Courier */}
              <div className="absolute -bottom-4 -right-4 p-3.5 bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl shadow-level-2 ghost-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">two_wheeler</span>
                </div>
                <div>
                  <span className="font-label text-xs font-bold text-on-surface block">Ultra Fast Fleet</span>
                  <span className="font-body text-[11px] text-secondary font-bold">~22 mins average</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. AI RECOMMENDATION BANNER */}
      {aiInsight && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-primary-fixed/40 via-surface-container-low to-tertiary-fixed/30 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary to-primary-bright flex items-center justify-center text-white shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[22px]">smart_toy</span>
              </div>
              <div>
                <span className="font-label text-xs font-extrabold uppercase tracking-wider text-primary block">
                  FoodieDash Spring AI Intelligence
                </span>
                <p className="font-body text-xs sm:text-sm font-medium text-on-surface mt-0.5">
                  {aiInsight.topRecommendation}
                </p>
              </div>
            </div>
            <Link
              to="/offers"
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-label font-bold hover:bg-primary-container shrink-0 shadow-sm transition-all"
            >
              Claim Today's Deals
            </Link>
          </div>
        </section>
      )}

      {/* 3. FOOD CATEGORIES DISCOVERY */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline font-bold text-xl sm:text-2xl text-on-surface">
              What are you craving today?
            </h2>
            <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-0.5">
              Explore curated cuisines from local artisan kitchens
            </p>
          </div>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-label font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
              Clear Category Filter
            </button>
          )}
        </div>

        {/* Scrollable Categories Strip */}
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 hide-scrollbar">
          {FOOD_CATEGORIES.map((cat) => (
            <CategoryPill
              key={cat.id}
              id={cat.id}
              name={cat.name}
              image={cat.image}
              count={cat.count}
              isSelected={selectedCategory === cat.name}
              onClick={() => {
                if (selectedCategory === cat.name) {
                  setSelectedCategory(null);
                } else {
                  setSelectedCategory(cat.name);
                }
              }}
            />
          ))}
        </div>
      </section>

      {/* 4. FEATURED PROMO COUPONS STRIP */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-3xl bg-gradient-to-br from-primary-fixed to-primary-fixed-dim/60 border border-primary/20 text-on-surface flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-label font-extrabold uppercase tracking-wider text-primary">
                Limited Time Promo
              </span>
              <h3 className="font-headline font-extrabold text-lg sm:text-xl text-primary mt-1">
                20% OFF Everything
              </h3>
              <p className="font-body text-xs text-on-surface-variant mt-1">
                Use code <span className="font-bold text-on-surface">FOODIE20</span> on orders above $25.
              </p>
            </div>
            <Link
              to="/offers"
              className="mt-3 text-xs font-label font-bold text-primary hover:underline flex items-center gap-1"
            >
              Redeem in Offers →
            </Link>
          </div>

          <div className="p-4 rounded-3xl bg-gradient-to-br from-secondary-fixed to-secondary-fixed-dim/60 border border-secondary/20 text-on-surface flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-label font-extrabold uppercase tracking-wider text-secondary">
                Free Shipping
              </span>
              <h3 className="font-headline font-extrabold text-lg sm:text-xl text-secondary mt-1">
                Zero Delivery Charges
              </h3>
              <p className="font-body text-xs text-on-surface-variant mt-1">
                Use code <span className="font-bold text-on-surface">FREEDEL</span> on orders over $20.
              </p>
            </div>
            <Link
              to="/offers"
              className="mt-3 text-xs font-label font-bold text-secondary hover:underline flex items-center gap-1"
            >
              View Free Delivery Places →
            </Link>
          </div>

          <div className="p-4 rounded-3xl bg-gradient-to-br from-tertiary-fixed to-tertiary-fixed-dim/60 border border-tertiary/20 text-on-surface flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-label font-extrabold uppercase tracking-wider text-tertiary">
                Direct Savings
              </span>
              <h3 className="font-headline font-extrabold text-lg sm:text-xl text-tertiary mt-1">
                Flat $10 Instant Off
              </h3>
              <p className="font-body text-xs text-on-surface-variant mt-1">
                Use code <span className="font-bold text-on-surface">FLAT10</span> on orders above $35.
              </p>
            </div>
            <Link
              to="/offers"
              className="mt-3 text-xs font-label font-bold text-tertiary hover:underline flex items-center gap-1"
            >
              Explore Menu Deals →
            </Link>
          </div>

          <div className="p-4 rounded-3xl bg-surface-container-lowest border border-surface-container text-on-surface flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-label font-extrabold uppercase tracking-wider text-primary">
                New User Special
              </span>
              <h3 className="font-headline font-extrabold text-lg sm:text-xl text-on-surface mt-1">
                30% Welcome Bonus
              </h3>
              <p className="font-body text-xs text-on-surface-variant mt-1">
                Use code <span className="font-bold text-primary">WELCOME30</span> on your first order.
              </p>
            </div>
            <Link
              to="/signup"
              className="mt-3 text-xs font-label font-bold text-primary hover:underline flex items-center gap-1"
            >
              Sign Up & Claim →
            </Link>
          </div>
        </div>
      </section>

      {/* 5. RESTAURANT DISCOVERY & FILTERS */}
      <section id="restaurant-discovery" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-headline font-bold text-2xl text-on-surface">
              {selectedCategory ? `${selectedCategory} Restaurants` : 'Restaurants with online food delivery in New York'}
            </h2>
            <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-0.5">
              Showing {filteredRestaurants.length} verified culinary kitchens ready to prepare your meal
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-label font-bold transition-all ${
                activeFilter === 'all'
                  ? 'bg-on-surface text-white shadow-sm'
                  : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
              }`}
            >
              All Places
            </button>
            <button
              onClick={() => setActiveFilter('rating')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-label font-bold flex items-center gap-1 transition-all ${
                activeFilter === 'rating'
                  ? 'bg-secondary text-white shadow-sm'
                  : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              Ratings 4.7+
            </button>
            <button
              onClick={() => setActiveFilter('fast')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-label font-bold flex items-center gap-1 transition-all ${
                activeFilter === 'fast'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              Fast Delivery (&lt;30 min)
            </button>
            <button
              onClick={() => setActiveFilter('veg')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-label font-bold flex items-center gap-1 transition-all ${
                activeFilter === 'veg'
                  ? 'bg-secondary text-white shadow-sm'
                  : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-secondary-bright" />
              Pure Veg / Options
            </button>
            <button
              onClick={() => setActiveFilter('offers')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-label font-bold flex items-center gap-1 transition-all ${
                activeFilter === 'offers'
                  ? 'bg-tertiary text-white shadow-sm'
                  : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">local_offer</span>
              Special Offers
            </button>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-surface-container-lowest rounded-3xl overflow-hidden ghost-border p-4 space-y-3 animate-pulse"
              >
                <div className="w-full aspect-[16/10] bg-surface-container-low rounded-2xl" />
                <div className="h-5 bg-surface-container-low rounded w-3/4" />
                <div className="h-4 bg-surface-container-low rounded w-1/2" />
                <div className="h-4 bg-surface-container-low rounded w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-8 rounded-3xl bg-error-container/30 border border-error/20 text-center max-w-lg mx-auto space-y-4">
            <span className="material-symbols-outlined text-error text-[40px]">
              cloud_off
            </span>
            <h3 className="font-headline font-bold text-lg text-on-surface">
              Unable to load restaurants
            </h3>
            <p className="font-body text-xs text-on-surface-variant">
              {error}
            </p>
            <button
              onClick={fetchCatalog}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredRestaurants.length === 0 && (
          <div className="p-12 rounded-3xl bg-surface-container-lowest ghost-border text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center mx-auto text-outline">
              <span className="material-symbols-outlined text-[32px]">restaurant</span>
            </div>
            <h3 className="font-headline font-bold text-lg text-on-surface">
              No matching restaurants found
            </h3>
            <p className="font-body text-xs text-on-surface-variant leading-relaxed">
              We couldn't find any places matching your current filter. Try clearing your filters or search for another dish.
            </p>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setActiveFilter('all');
              }}
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Restaurants Grid */}
        {!loading && !error && filteredRestaurants.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
