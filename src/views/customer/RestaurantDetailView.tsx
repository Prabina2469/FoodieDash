import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { restaurantService } from '../../services/restaurantService';
import { Restaurant, MenuItem } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { FoodCard } from '../../components/customer/common/FoodCard';

export const RestaurantDetailView: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const { isRestaurantWishlisted, toggleRestaurantWishlist } = useWishlist();
  const { itemCount, grandTotal, restaurantId: cartRestId } = useCart();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [menuSearch, setMenuSearch] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('All');

  const id = Number(restaurantId);

  useEffect(() => {
    const loadRestaurant = async () => {
      if (!id || isNaN(id)) {
        setError('Invalid restaurant ID');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const [restData, menuData] = await Promise.all([
          restaurantService.getRestaurantById(id),
          restaurantService.getRestaurantMenu(id)
        ]);
        setRestaurant(restData);
        setMenuItems(menuData || restData.menuItems || []);
      } catch (err: any) {
        console.warn('Failed to load restaurant from backend:', err);
        setError('Unable to load restaurant details. The establishment may be temporarily unavailable.');
      } finally {
        setLoading(false);
      }
    };
    loadRestaurant();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
        <div className="h-64 bg-surface-container-low rounded-3xl" />
        <div className="h-10 bg-surface-container-low rounded-2xl w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-36 bg-surface-container-low rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <span className="material-symbols-outlined text-error text-[48px]">
          restaurant_menu
        </span>
        <h2 className="font-headline font-bold text-xl text-on-surface">Restaurant Not Available</h2>
        <p className="font-body text-xs text-on-surface-variant">{error || 'Restaurant not found'}</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container transition-all"
        >
          Explore Other Restaurants
        </button>
      </div>
    );
  }

  const isWishlisted = isRestaurantWishlisted(restaurant.id);

  // Group menu items into categories
  const categories = Array.from(
    new Set(menuItems.map((item) => item.categoryName || 'Chef Specials'))
  );

  // Filter menu items
  const filteredItems = menuItems.filter((item) => {
    if (vegOnly && !item.isVeg) return false;
    if (selectedCategoryTab !== 'All' && (item.categoryName || 'Chef Specials') !== selectedCategoryTab) {
      return false;
    }
    if (menuSearch.trim()) {
      const matchName = item.name.toLowerCase().includes(menuSearch.toLowerCase());
      const matchDesc = item.description?.toLowerCase().includes(menuSearch.toLowerCase());
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  const isCartFromThisRestaurant = cartRestId === restaurant.id && itemCount > 0;

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-label text-outline">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link to="/restaurants" className="hover:text-primary transition-colors">Restaurants</Link>
        <span>/</span>
        <span className="text-on-surface font-bold truncate max-w-[200px]">{restaurant.name}</span>
      </nav>

      {/* 1. RESTAURANT HERO HEADER BANNER */}
      <div className="relative bg-surface-container-lowest rounded-3xl p-6 sm:p-8 ghost-border shadow-level-2 overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-on-surface tracking-tight">
                {restaurant.name}
              </h1>
              {restaurant.isOpen ? (
                <span className="px-3 py-1 rounded-full bg-secondary-fixed text-secondary font-label text-xs font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  Accepting Orders
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-error-container text-error font-label text-xs font-bold">
                  Currently Closed
                </span>
              )}
            </div>

            <p className="font-body text-sm text-on-surface-variant font-medium">
              {restaurant.cuisine}
            </p>

            <div className="flex items-center gap-2 text-xs font-body text-outline">
              <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
              <span>{restaurant.address}</span>
              {restaurant.phone && <span>• {restaurant.phone}</span>}
            </div>

            {/* Quick Metrics Badge Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-6 font-label text-xs font-bold text-on-surface">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-white shadow-sm">
                <span>{restaurant.rating.toFixed(1)}</span>
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-white/80 font-normal">({restaurant.reviewCount || 480}+ ratings)</span>
              </div>

              <div className="flex items-center gap-1.5 text-on-surface">
                <span className="material-symbols-outlined text-[18px] text-primary">schedule</span>
                <span>{restaurant.deliveryTime || restaurant.prepTime || '25-30 min'}</span>
              </div>

              <div className="flex items-center gap-1.5 text-on-surface">
                <span className="material-symbols-outlined text-[18px] text-outline">near_me</span>
                <span>{restaurant.distance || '1.8 km'}</span>
              </div>

              <div className="flex items-center gap-1.5 text-on-surface">
                <span className="material-symbols-outlined text-[18px] text-tertiary">payments</span>
                <span>${restaurant.priceForTwo || 25} for two</span>
              </div>
            </div>
          </div>

          {/* Action Bookmark */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <button
              onClick={() => toggleRestaurantWishlist(restaurant)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all shadow-sm font-label text-xs font-bold ${
                isWishlisted
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface-container-low hover:bg-surface-container text-on-surface border-surface-container'
              }`}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
              <span>{isWishlisted ? 'Saved' : 'Favorite'}</span>
            </button>
          </div>
        </div>

        {/* Offers Strip inside restaurant */}
        <div className="mt-6 pt-6 border-t border-surface-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-primary-fixed/30 border border-primary/20 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[22px]">local_offer</span>
            <div>
              <span className="font-headline font-bold text-xs text-primary block">20% OFF UP TO $12</span>
              <span className="font-body text-[11px] text-on-surface-variant">Use coupon FOODIE20</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-secondary-fixed/30 border border-secondary/20 flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-[22px]">local_shipping</span>
            <div>
              <span className="font-headline font-bold text-xs text-secondary block">FREE DELIVERY</span>
              <span className="font-body text-[11px] text-on-surface-variant">Orders above $20 with FREEDEL</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-tertiary-fixed/30 border border-tertiary/20 flex items-center gap-3 sm:col-span-2 lg:col-span-1">
            <span className="material-symbols-outlined text-tertiary text-[22px]">verified</span>
            <div>
              <span className="font-headline font-bold text-xs text-tertiary block">HYGIENE CERTIFIED</span>
              <span className="font-body text-[11px] text-on-surface-variant">Kitchen temperature & sanitization verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MENU CONTROLS & SEARCH */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-headline font-bold text-xl sm:text-2xl text-on-surface flex items-center gap-2">
            <span>Menu Catalog</span>
            <span className="text-xs font-label px-2.5 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant">
              {filteredItems.length} dishes
            </span>
          </h2>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Veg Only Toggle */}
            <label className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-surface-container-low hover:bg-surface-container cursor-pointer select-none border border-surface-container">
              <input
                type="checkbox"
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
                className="accent-secondary w-4 h-4 rounded"
              />
              <span className="font-label text-xs font-bold text-on-surface flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                Veg Only
              </span>
            </label>

            {/* In-Menu Search */}
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                search
              </span>
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Search dish in menu..."
                className="w-full pl-9 pr-8 py-2 bg-surface-container-low border border-surface-container rounded-2xl text-xs font-body text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
              />
              {menuSearch && (
                <button
                  onClick={() => setMenuSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
          <button
            onClick={() => setSelectedCategoryTab('All')}
            className={`px-4 py-2 rounded-2xl font-label text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategoryTab === 'All'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryTab(cat)}
              className={`px-4 py-2 rounded-2xl font-label text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategoryTab === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. MENU DISHES LIST */}
      {filteredItems.length === 0 ? (
        <div className="p-12 rounded-3xl bg-surface-container-lowest ghost-border text-center max-w-md mx-auto space-y-3">
          <span className="material-symbols-outlined text-outline text-[36px]">
            search_off
          </span>
          <h3 className="font-headline font-bold text-base text-on-surface">No dishes match your filter</h3>
          <p className="font-body text-xs text-on-surface-variant">
            Try adjusting your search query or toggling off the Veg Only filter.
          </p>
          <button
            onClick={() => {
              setVegOnly(false);
              setMenuSearch('');
              setSelectedCategoryTab('All');
            }}
            className="px-4 py-2 rounded-xl bg-primary text-white font-label text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {(selectedCategoryTab === 'All' ? categories : [selectedCategoryTab]).map((catName) => {
            const itemsInCat = filteredItems.filter((i) => (i.categoryName || 'Chef Specials') === catName);
            if (itemsInCat.length === 0) return null;

            return (
              <div key={catName} className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-surface-container">
                  <h3 className="font-headline font-extrabold text-lg sm:text-xl text-on-surface">
                    {catName}
                  </h3>
                  <span className="text-xs font-label text-outline">
                    ({itemsInCat.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {itemsInCat.map((item) => (
                    <FoodCard
                      key={item.id}
                      item={item}
                      restaurant={{ id: restaurant.id, name: restaurant.name }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. FLOATING ACTIVE CART STRIP */}
      {isCartFromThisRestaurant && (
        <div className="fixed bottom-16 md:bottom-6 left-4 right-4 max-w-2xl mx-auto z-40 animate-in slide-in-from-bottom-6">
          <div className="p-4 rounded-2xl bg-primary text-white shadow-level-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-headline font-extrabold text-base">
                {itemCount}
              </div>
              <div>
                <p className="font-headline font-extrabold text-sm sm:text-base">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} in Cart
                </p>
                <p className="font-body text-xs text-white/90">
                  Total: <span className="font-bold">${grandTotal.toFixed(2)}</span> (inc. taxes)
                </p>
              </div>
            </div>

            <Link
              to="/cart"
              className="px-5 py-2.5 rounded-xl bg-white text-primary font-label text-xs font-extrabold hover:bg-surface transition-all active:scale-95 flex items-center gap-1 shadow-sm"
            >
              <span>View Cart</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
