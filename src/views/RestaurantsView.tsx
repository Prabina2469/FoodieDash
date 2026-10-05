import React, { useState } from 'react';
import { MOCK_RESTAURANTS, Restaurant } from '../data/mockData';
import { Badge, DietaryTag } from '../components/common/Badge';

export const RestaurantsView: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(MOCK_RESTAURANTS[0]);
  const [activeTab, setActiveTab] = useState<'Overview' | 'Menu' | 'Settings'>('Overview');
  const [activeCategory, setActiveCategory] = useState<string>('Appetizers');

  const toggleRestaurantStatus = (id: string) => {
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextStatus = r.status === 'Active' ? 'Closed' : 'Active';
          return { ...r, status: nextStatus };
        }
        return r;
      })
    );
    if (selectedRestaurant?.id === id) {
      setSelectedRestaurant((prev) =>
        prev ? { ...prev, status: prev.status === 'Active' ? 'Closed' : 'Active' } : null
      );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-container">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-background">
            Restaurant Partners & Kitchens
          </h1>
          <p className="font-body text-xs md:text-sm text-on-surface-variant mt-1">
            Manage partner vendor stores, menus, preparation times, and live status.
          </p>
        </div>

        <button
          onClick={() => alert('New restaurant onboarding flow opened.')}
          className="px-4 py-2.5 rounded-xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container transition-all shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add_business</span>
          Onboard Restaurant
        </button>
      </div>

      {/* Selected Restaurant Hero & Tabs */}
      {selectedRestaurant && (
        <div className="bg-surface-container-lowest p-6 rounded-2xl ghost-border shadow-level-1 space-y-6">
          {/* Restaurant Banner & Actions */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-surface-container">
            <div className="flex items-center gap-4">
              <img
                src={selectedRestaurant.image}
                alt={selectedRestaurant.name}
                className="w-20 h-20 rounded-2xl object-cover ghost-border shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl md:text-2xl font-headline font-bold text-on-surface">
                    {selectedRestaurant.name}
                  </h2>
                  <Badge status={selectedRestaurant.status} />
                </div>
                <p className="font-body text-xs text-on-surface-variant">
                  {selectedRestaurant.address} • {selectedRestaurant.cuisine}
                </p>
                <div className="flex items-center gap-4 text-xs font-label text-on-surface-variant pt-1">
                  <span className="flex items-center gap-1 text-tertiary font-bold">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    {selectedRestaurant.rating} ({selectedRestaurant.reviewCount} Reviews)
                  </span>
                  <span>• Prep Speed: {selectedRestaurant.prepTime}</span>
                </div>
              </div>
            </div>

            {/* Status Switcher & Actions */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
              <button
                onClick={() => toggleRestaurantStatus(selectedRestaurant.id)}
                className={`px-4 py-2 rounded-xl font-label text-xs font-bold transition-all ${
                  selectedRestaurant.status === 'Active'
                    ? 'bg-secondary-fixed text-secondary hover:bg-secondary-container'
                    : 'bg-error-container text-error hover:bg-error-container/80'
                }`}
              >
                {selectedRestaurant.status === 'Active' ? 'Store is Open' : 'Store is Closed'}
              </button>

              <button
                onClick={() => alert('Settings updated.')}
                className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant transition-colors"
                title="Store Settings"
              >
                <span className="material-symbols-outlined text-[20px]">settings</span>
              </button>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-2">
            {(['Overview', 'Menu', 'Settings'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full font-label text-xs font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-surface-container-low/70 ghost-border space-y-1">
                <span className="font-label text-xs uppercase text-on-surface-variant">Lifetime Revenue</span>
                <p className="font-headline text-2xl font-bold text-on-surface">
                  ${selectedRestaurant.revenue.toLocaleString()}
                </p>
                <span className="font-label text-xs text-secondary font-semibold">
                  +{selectedRestaurant.growth}% monthly growth
                </span>
              </div>
              <div className="p-4 rounded-xl bg-surface-container-low/70 ghost-border space-y-1">
                <span className="font-label text-xs uppercase text-on-surface-variant">Completed Orders</span>
                <p className="font-headline text-2xl font-bold text-on-surface">
                  {selectedRestaurant.totalOrders.toLocaleString()}
                </p>
                <span className="font-label text-xs text-outline font-medium">99.1% fulfillment rate</span>
              </div>
              <div className="p-4 rounded-xl bg-surface-container-low/70 ghost-border space-y-1">
                <span className="font-label text-xs uppercase text-on-surface-variant">Customer Satisfaction</span>
                <p className="font-headline text-2xl font-bold text-tertiary">
                  {selectedRestaurant.rating} / 5.0
                </p>
                <span className="font-label text-xs text-outline font-medium">Based on 524 verified reviews</span>
              </div>
            </div>
          )}

          {/* Tab 2: Menu Management */}
          {activeTab === 'Menu' && (
            <div className="space-y-6 pt-2">
              {/* Categories Bar */}
              <div className="flex flex-wrap gap-2 pb-2 border-b border-surface-container">
                {['Appetizers', 'Main Courses', 'Desserts', 'Beverages'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-lg font-label text-xs font-semibold transition-all ${
                      activeCategory === cat
                        ? 'bg-primary-container text-white font-bold'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Items List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedRestaurant.menuCategories[0]?.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-xl bg-surface-container-low/50 border border-surface-container hover:shadow-sm transition-all"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DietaryTag isVeg={item.isVeg} />
                            <h4 className="font-headline text-sm font-bold text-on-surface">{item.name}</h4>
                          </div>
                          <span className="font-headline text-sm font-bold text-primary">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="font-body text-xs text-on-surface-variant line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-surface-container">
                        <span className="font-label text-[11px] text-secondary font-bold">
                          {item.isBestseller ? '★ Bestseller' : 'Standard'}
                        </span>
                        <button
                          onClick={() => alert(`Editing item ${item.name}`)}
                          className="font-label text-xs font-bold text-primary hover:underline"
                        >
                          Edit Item
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Settings */}
          {activeTab === 'Settings' && (
            <div className="max-w-xl space-y-4 pt-2 font-body text-xs">
              <div>
                <label className="font-label font-bold text-on-surface-variant block mb-1">Kitchen Address</label>
                <input
                  type="text"
                  defaultValue={selectedRestaurant.address}
                  className="w-full px-3 py-2 bg-surface-container-low border border-surface-container rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="font-label font-bold text-on-surface-variant block mb-1">Standard Prep Window</label>
                <input
                  type="text"
                  defaultValue={selectedRestaurant.prepTime}
                  className="w-full px-3 py-2 bg-surface-container-low border border-surface-container rounded-lg text-xs"
                />
              </div>
              <button
                onClick={() => alert('Settings saved!')}
                className="px-4 py-2 rounded-xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      )}

      {/* Grid of All Restaurants */}
      <div className="space-y-4">
        <h3 className="font-headline text-lg font-bold text-on-surface">All Partner Locations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {restaurants.map((rest) => (
            <div
              key={rest.id}
              onClick={() => setSelectedRestaurant(rest)}
              className={`p-4 rounded-xl bg-surface-container-lowest ghost-border cursor-pointer transition-all hover:shadow-level-2 group ${
                selectedRestaurant?.id === rest.id ? 'ring-2 ring-primary shadow-level-2' : ''
              }`}
            >
              <div className="relative h-36 rounded-lg overflow-hidden mb-3">
                <img
                  src={rest.image}
                  alt={rest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <Badge status={rest.status} size="sm" />
                </div>
              </div>

              <h4 className="font-headline font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                {rest.name}
              </h4>
              <p className="font-body text-xs text-on-surface-variant truncate mt-0.5">{rest.cuisine}</p>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-container text-xs font-label">
                <span className="font-bold text-on-surface">${rest.revenue.toLocaleString()}</span>
                <span className="flex items-center gap-1 text-tertiary font-bold">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  {rest.rating}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
