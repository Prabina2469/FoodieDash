import React from 'react';
import { Link } from 'react-router-dom';

export const CustomerFooter: React.FC = () => {
  return (
    <footer className="bg-surface-container-lowest border-t border-surface-container text-on-surface-variant pt-12 pb-24 md:pb-12 transition-all">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-surface-container">
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-primary-bright flex items-center justify-center text-white shadow-glow-primary">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  restaurant
                </span>
              </div>
              <span className="text-2xl font-display font-extrabold text-primary tracking-tight">
                FoodieDash
              </span>
            </Link>

            <p className="font-body text-sm text-on-surface-variant max-w-sm leading-relaxed">
              Discover artisan dishes, top-rated local dining establishments, and crave-worthy comfort food delivered in under 30 minutes with our sustainable electric fleet.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed text-secondary font-label text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span>Microservices Fleet Active</span>
              </div>
            </div>
          </div>

          {/* Col 2: Popular Cuisines */}
          <div>
            <h4 className="font-headline font-bold text-sm text-on-surface mb-3">Popular Cuisines</h4>
            <ul className="space-y-2 text-xs font-body">
              <li>
                <Link to="/search?q=Italian" className="hover:text-primary transition-colors">Italian & Pasta</Link>
              </li>
              <li>
                <Link to="/search?q=Biryani" className="hover:text-primary transition-colors">Royal Dum Biryani</Link>
              </li>
              <li>
                <Link to="/search?q=Burgers" className="hover:text-primary transition-colors">Smash Burgers & Shakes</Link>
              </li>
              <li>
                <Link to="/search?q=Japanese" className="hover:text-primary transition-colors">Japanese Ramen & Sushi</Link>
              </li>
              <li>
                <Link to="/search?q=Chinese" className="hover:text-primary transition-colors">Dim Sum & Dan Dan Noodles</Link>
              </li>
              <li>
                <Link to="/search?q=Healthy" className="hover:text-primary transition-colors">Organic Quinoa Bowls</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="font-headline font-bold text-sm text-on-surface mb-3">Customer Hub</h4>
            <ul className="space-y-2 text-xs font-body">
              <li>
                <Link to="/offers" className="hover:text-primary transition-colors">Exclusive Offers & Coupons</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-primary transition-colors">Track Active Orders</Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-primary transition-colors">Saved Favorite Places</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-primary transition-colors">My Profile & Settings</Link>
              </li>
              <li>
                <Link to="/addresses" className="hover:text-primary transition-colors">Manage Delivery Addresses</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform */}
          <div>
            <h4 className="font-headline font-bold text-sm text-on-surface mb-3">Platform Operations</h4>
            <ul className="space-y-2 text-xs font-body">
              <li>
                <Link to="/admin" className="text-primary font-bold hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
                  Admin Console
                </Link>
              </li>
              <li>
                <span className="text-on-surface-variant/70">Spring Boot Microservices :8080</span>
              </li>
              <li>
                <span className="text-on-surface-variant/70">Eureka Discovery :8761</span>
              </li>
              <li>
                <span className="text-on-surface-variant/70">Firebase JWT Authentication</span>
              </li>
              <li>
                <span className="text-on-surface-variant/70">Spring AI Intelligence Service</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-body text-outline">
          <p>© 2026 FoodieDash Technologies Inc. All rights reserved.</p>
          <div className="flex gap-6 font-label text-[11px] font-semibold">
            <span>Privacy Policy</span>
            <span>Terms of Delivery</span>
            <span>Cookie Settings</span>
            <span className="text-secondary font-bold">100% Carbon Neutral Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
