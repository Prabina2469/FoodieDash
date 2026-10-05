import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';

// Route Guards & Layouts
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { CustomerLayout } from './components/customer/layout/CustomerLayout';
import { AdminLayout } from './components/admin/AdminLayout';

// Customer Views
import { CustomerHomeView } from './views/customer/CustomerHomeView';
import { RestaurantListView } from './views/customer/RestaurantListView';
import { RestaurantDetailView } from './views/customer/RestaurantDetailView';
import { SearchView } from './views/customer/SearchView';
import { OffersView as CustomerOffersView } from './views/customer/OffersView';
import { CartView as CustomerCartView } from './views/customer/CartView';
import { CheckoutView } from './views/customer/CheckoutView';
import { OrderSuccessView } from './views/customer/OrderSuccessView';
import { OrderTrackingView } from './views/customer/OrderTrackingView';
import { CustomerOrdersView } from './views/customer/CustomerOrdersView';
import { OrderDetailView } from './views/customer/OrderDetailView';
import { WishlistView } from './views/customer/WishlistView';
import { ProfileView } from './views/customer/ProfileView';
import { AddressesView } from './views/customer/AddressesView';
import { CustomerPaymentsView } from './views/customer/CustomerPaymentsView';
import { CustomerNotificationsView } from './views/customer/CustomerNotificationsView';
import { LoginView } from './views/customer/LoginView';
import { SignupView } from './views/customer/SignupView';
import { VerifyOtpView } from './views/customer/VerifyOtpView';

// Admin Views (Preserved at /admin/*)
import { DashboardView as AdminDashboardView } from './views/DashboardView';
import { OrdersView as AdminOrdersView } from './views/OrdersView';
import { RestaurantsView as AdminRestaurantsView } from './views/RestaurantsView';
import { CustomersView as AdminCustomersView } from './views/CustomersView';
import { DeliveryPartnersView as AdminDeliveryPartnersView } from './views/DeliveryPartnersView';
import { PaymentsView as AdminPaymentsView } from './views/PaymentsView';
import { OffersView as AdminOffersView } from './views/OffersView';
import { ReviewsView as AdminReviewsView } from './views/ReviewsView';
import { AnalyticsView as AdminAnalyticsView } from './views/AnalyticsView';
import { NotificationsView as AdminNotificationsView } from './views/NotificationsView';
import { SettingsView as AdminSettingsView } from './views/SettingsView';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <WishlistProvider>
              <NotificationProvider>
                <Routes>
                  {/* =======================================================
                      CUSTOMER STOREFRONT ROUTES (Root / )
                      ======================================================= */}
                  <Route element={<CustomerLayout />}>
                    {/* Public Customer Routes */}
                    <Route path="/" element={<CustomerHomeView />} />
                    <Route path="/login" element={<LoginView />} />
                    <Route path="/signup" element={<SignupView />} />
                    <Route path="/verify-otp" element={<VerifyOtpView />} />
                    <Route path="/restaurants" element={<RestaurantListView />} />
                    <Route path="/restaurants/:restaurantId" element={<RestaurantDetailView />} />
                    <Route path="/search" element={<SearchView />} />
                    <Route path="/offers" element={<CustomerOffersView />} />
                    <Route path="/cart" element={<CustomerCartView />} />

                    {/* Protected Customer Routes (Requires Firebase Authenticated Session) */}
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <CheckoutView />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/order-success/:orderId"
                      element={
                        <ProtectedRoute>
                          <OrderSuccessView />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/orders"
                      element={
                        <ProtectedRoute>
                          <CustomerOrdersView />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/orders/:orderId"
                      element={
                        <ProtectedRoute>
                          <OrderDetailView />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/orders/:orderId/track"
                      element={
                        <ProtectedRoute>
                          <OrderTrackingView />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/wishlist"
                      element={
                        <ProtectedRoute>
                          <WishlistView />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfileView />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/addresses"
                      element={
                        <ProtectedRoute>
                          <AddressesView />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/payments"
                      element={
                        <ProtectedRoute>
                          <CustomerPaymentsView />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/notifications"
                      element={
                        <ProtectedRoute>
                          <CustomerNotificationsView />
                        </ProtectedRoute>
                      }
                    />
                  </Route>

                  {/* =======================================================
                      ADMIN & OPERATIONS CONSOLE ROUTES (/admin/*)
                      Protected by AdminRoute (role === 'ADMIN')
                      ======================================================= */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminLayout />
                      </AdminRoute>
                    }
                  >
                    <Route index element={<AdminDashboardView orders={[]} />} />
                    <Route path="orders" element={<AdminOrdersView orders={[]} />} />
                    <Route path="restaurants" element={<AdminRestaurantsView />} />
                    <Route path="customers" element={<AdminCustomersView />} />
                    <Route path="delivery-partners" element={<AdminDeliveryPartnersView />} />
                    <Route path="fleet" element={<AdminDeliveryPartnersView />} />
                    <Route path="payments" element={<AdminPaymentsView />} />
                    <Route path="offers" element={<AdminOffersView />} />
                    <Route path="reviews" element={<AdminReviewsView />} />
                    <Route path="analytics" element={<AdminAnalyticsView />} />
                    <Route path="notifications" element={<AdminNotificationsView />} />
                    <Route path="settings" element={<AdminSettingsView />} />
                  </Route>

                  {/* =======================================================
                      FALLBACK & 404 ROUTING
                      ======================================================= */}
                  <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </NotificationProvider>
            </WishlistProvider>
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
