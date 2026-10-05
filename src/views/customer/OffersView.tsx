import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart, PLATFORM_COUPONS } from '../../context/CartContext';

export const OffersView: React.FC = () => {
  const { applyCoupon } = useCart();
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleApplyToCart = (code: string) => {
    applyCoupon(code);
    navigate('/cart');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="space-y-2">
        <nav className="flex items-center gap-2 text-xs font-label text-outline">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-on-surface font-bold">Offers & Promo Deals</span>
        </nav>
        <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-on-surface">
          Deals, Discounts & Coupons
        </h1>
        <p className="font-body text-xs sm:text-sm text-on-surface-variant">
          Save on your favorite meals with verified platform offers and partner promos
        </p>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PLATFORM_COUPONS.map((coupon) => (
          <div
            key={coupon.code}
            className="group relative bg-surface-container-lowest rounded-3xl p-6 ghost-border shadow-level-1 hover:shadow-level-3 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            {/* Top Ribbon & Icon */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">local_offer</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label text-[11px] font-bold">
                  Valid till Dec 2026
                </span>
              </div>

              <h3 className="font-headline font-extrabold text-xl text-on-surface group-hover:text-primary transition-colors">
                {coupon.title}
              </h3>
              <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
                {coupon.description}
              </p>

              <div className="mt-4 pt-4 border-t border-surface-container flex items-center gap-2 text-xs font-label text-outline">
                <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                <span>Min. Order Value: <strong className="text-on-surface">${coupon.minOrderValue}</strong></span>
              </div>
            </div>

            {/* Bottom Actions: Copy Code & Apply */}
            <div className="mt-6 pt-4 border-t border-surface-container flex items-center justify-between gap-3">
              {/* Promo Code Pill */}
              <div className="px-3.5 py-2 rounded-xl bg-surface-container-low border border-dashed border-primary/40 font-mono font-bold text-xs text-primary select-all">
                {coupon.code}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(coupon.code)}
                  className="px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label text-xs font-bold transition-all"
                >
                  {copiedCode === coupon.code ? '✓ Copied' : 'Copy'}
                </button>
                <button
                  onClick={() => handleApplyToCart(coupon.code)}
                  className="px-4 py-2 rounded-xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container shadow-sm active:scale-95 transition-all"
                >
                  Apply to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Terms and conditions */}
      <div className="p-6 rounded-3xl bg-surface-container-low border border-surface-container space-y-2 text-xs font-body text-on-surface-variant">
        <h4 className="font-headline font-bold text-sm text-on-surface">Offer Terms & Information</h4>
        <p>• Only one promo coupon can be redeemed per checkout order.</p>
        <p>• Discount is calculated on items subtotal before taxes and platform fees.</p>
        <p>• Free delivery offers apply to standard courier delivery within participating city delivery hubs.</p>
      </div>
    </div>
  );
};
