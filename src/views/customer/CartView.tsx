import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart, PLATFORM_COUPONS } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const CartView: React.FC = () => {
  const {
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
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
    }
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-primary-fixed/40 flex items-center justify-center mx-auto text-primary">
          <span className="material-symbols-outlined text-[48px]">shopping_bag</span>
        </div>
        <div className="space-y-2">
          <h2 className="font-display font-bold text-2xl text-on-surface">
            Your Cart is Empty
          </h2>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant max-w-xs mx-auto leading-relaxed">
            Looks like you haven't added any delicious food yet. Explore premier local restaurants and fill your cart!
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-primary text-white font-label text-sm font-bold hover:bg-primary-container shadow-glow-primary active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">explore</span>
          Discover Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-label text-outline">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        {restaurantId && (
          <>
            <Link to={`/restaurants/${restaurantId}`} className="hover:text-primary transition-colors">
              {restaurantName || 'Restaurant'}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-on-surface font-bold">Cart ({itemCount} items)</span>
      </nav>

      <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-on-surface">
        Review Your Food Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-7 space-y-6">
          {/* Restaurant Banner Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-5 ghost-border shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">restaurant</span>
              </div>
              <div>
                <span className="font-label text-xs uppercase tracking-wider text-outline">Ordering from</span>
                <h3 className="font-headline font-bold text-base sm:text-lg text-on-surface">
                  {restaurantName || 'FoodieDash Partner Kitchen'}
                </h3>
              </div>
            </div>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your entire cart?')) {
                  clearCart();
                }
              }}
              className="text-xs font-label text-error font-bold hover:underline p-1"
            >
              Clear Cart
            </button>
          </div>

          {/* Cart Item Cards */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 ghost-border shadow-sm divide-y divide-surface-container">
            {items.map((item) => (
              <div key={item.menuItemId} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  {/* Veg / Non-veg dot */}
                  <span
                    className={`w-4 h-4 rounded-sm flex items-center justify-center border shrink-0 mt-1 ${
                      item.isVeg ? 'border-secondary' : 'border-primary'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.isVeg ? 'bg-secondary' : 'bg-primary'
                      }`}
                    />
                  </span>

                  <div className="space-y-1">
                    <h4 className="font-headline font-bold text-sm sm:text-base text-on-surface">
                      {item.itemName}
                    </h4>

                    {/* Customizations display */}
                    {item.customization && (
                      <div className="text-[11px] font-body text-on-surface-variant space-y-0.5">
                        {item.customization.size && (
                          <span className="inline-block bg-surface-container-low px-2 py-0.5 rounded mr-1">
                            Size: {item.customization.size}
                          </span>
                        )}
                        {item.customization.addOns && item.customization.addOns.length > 0 && (
                          <span className="inline-block bg-surface-container-low px-2 py-0.5 rounded mr-1">
                            Addons: {item.customization.addOns.map((a) => a.name).join(', ')}
                          </span>
                        )}
                        {item.customization.instructions && (
                          <p className="italic text-outline">Note: {item.customization.instructions}</p>
                        )}
                      </div>
                    )}

                    <span className="font-label text-xs font-bold text-on-surface block">
                      ${item.price.toFixed(2)} each
                    </span>
                  </div>
                </div>

                {/* Quantity Controls & Subtotal */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 bg-surface-container-low rounded-xl px-2 py-1 shadow-sm font-label text-xs font-bold">
                    <button
                      onClick={() => updateQuantity(item.menuItemId, -1)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">remove</span>
                    </button>
                    <span className="px-1.5 text-xs font-bold text-on-surface">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.menuItemId, 1)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </button>
                  </div>

                  <span className="font-headline font-bold text-sm text-on-surface">
                    ${item.subTotal.toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeItem(item.menuItemId)}
                    className="text-[11px] text-outline hover:text-error transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cooking and Delivery Instructions */}
          <div className="bg-surface-container-lowest rounded-3xl p-5 ghost-border shadow-sm flex items-center gap-3 text-xs font-body text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-[22px]">contactless</span>
            <div>
              <span className="font-headline font-bold text-on-surface block">100% Contactless Delivery</span>
              <span>Rider will leave the packaged insulated food package at your doorstep.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Coupons & Bill Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          {/* Coupon Redemption Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 ghost-border shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-[20px]">local_offer</span>
              <h3 className="font-headline font-bold text-sm text-on-surface">Coupons & Promo Codes</h3>
            </div>

            {appliedCoupon ? (
              <div className="p-3.5 rounded-2xl bg-secondary-fixed/40 border border-secondary/30 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-xs text-secondary block">
                    {appliedCoupon.code} APPLIED!
                  </span>
                  <span className="font-body text-xs text-on-surface-variant">
                    {appliedCoupon.title}
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-label font-bold text-error hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter code (e.g. FOODIE20)"
                  className="flex-1 px-4 py-2.5 bg-surface-container-low border border-surface-container rounded-2xl text-xs font-mono font-bold uppercase placeholder:font-body placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container shadow-sm active:scale-95 transition-all"
                >
                  Apply
                </button>
              </form>
            )}

            {couponError && (
              <p className="text-xs text-error font-body bg-error-container/30 p-2 rounded-xl">
                {couponError}
              </p>
            )}

            {/* Quick Available Coupons Chips */}
            {!appliedCoupon && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-label text-outline font-semibold uppercase tracking-wider block">
                  Available Offers
                </span>
                <div className="space-y-1.5">
                  {PLATFORM_COUPONS.slice(0, 3).map((cpn) => (
                    <button
                      key={cpn.code}
                      onClick={() => applyCoupon(cpn.code)}
                      className="w-full p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container/60 text-left flex items-center justify-between text-xs transition-colors group"
                    >
                      <span className="font-mono font-bold text-primary">{cpn.code}</span>
                      <span className="font-body text-on-surface-variant truncate max-w-[180px]">{cpn.title}</span>
                      <span className="font-label font-bold text-primary group-hover:underline">Apply</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bill Summary Breakdown Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 ghost-border shadow-level-1 space-y-4">
            <h3 className="font-headline font-bold text-sm text-on-surface border-b border-surface-container pb-3">
              Bill Summary
            </h3>

            <div className="space-y-2.5 text-xs font-body text-on-surface-variant">
              <div className="flex justify-between">
                <span>Item Total</span>
                <span className="font-medium text-on-surface">${itemTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                {deliveryFee === 0 ? (
                  <span className="text-secondary font-bold">FREE</span>
                ) : (
                  <span className="font-medium text-on-surface">${deliveryFee.toFixed(2)}</span>
                )}
              </div>

              <div className="flex justify-between">
                <span>Platform Operations Fee</span>
                <span className="font-medium text-on-surface">${platformFee.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Govt. Taxes & Restaurant Charges (8%)</span>
                <span className="font-medium text-on-surface">${tax.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-secondary font-bold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-surface-container flex justify-between items-baseline text-sm sm:text-base font-headline font-extrabold text-on-surface">
                <span>Grand Total</span>
                <span className="text-lg text-primary">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Checkout Button */}
            <div className="pt-3 space-y-2">
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-4 px-6 rounded-2xl bg-primary text-white font-label text-sm font-bold hover:bg-primary-container shadow-glow-primary active:scale-98 transition-all flex items-center justify-between"
              >
                <span>Proceed to Checkout</span>
                <span>${grandTotal.toFixed(2)} →</span>
              </button>

              <Link
                to={restaurantId ? `/restaurants/${restaurantId}` : '/'}
                className="w-full block text-center py-2 text-xs font-label text-on-surface-variant hover:text-primary font-semibold"
              >
                + Add more items from menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
