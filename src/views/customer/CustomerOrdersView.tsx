import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';
import { useCart } from '../../context/CartContext';

export const CustomerOrdersView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  const { addItem } = useCart();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getMyOrders();
      setOrders(data || []);
    } catch (err: any) {
      console.warn('Orders fetch notice:', err);
      setError('Unable to load orders from order service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReorder = async (order: Order) => {
    try {
      // Add order items to cart and navigate to cart
      if (order.items && order.items.length > 0) {
        for (const item of order.items) {
          await addItem(
            {
              id: item.menuItemId,
              restaurantId: order.restaurantId,
              name: item.itemName,
              description: '',
              price: item.price,
              isVeg: false,
              isAvailable: true
            },
            { id: order.restaurantId, name: order.restaurantName || 'Restaurant' },
            item.quantity
          );
        }
        navigate('/cart');
      }
    } catch (e) {
      console.warn('Reorder failed:', e);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderService.cancelOrder(orderId);
        await fetchOrders();
      } catch (e) {
        alert('Could not cancel order at this stage.');
      }
    }
  };

  // Filter orders by tab
  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'active') {
      return ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(o.status);
    }
    if (activeTab === 'completed') {
      return o.status === 'DELIVERED';
    }
    if (activeTab === 'cancelled') {
      return o.status === 'CANCELLED';
    }
    return true;
  });

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
      {/* Header */}
      <div className="space-y-2">
        <nav className="flex items-center gap-2 text-xs font-label text-outline">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-on-surface font-bold">My Orders</span>
        </nav>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-on-surface">
          My Order History
        </h1>
        <p className="font-body text-xs sm:text-sm text-on-surface-variant">
          Track active deliveries, view past receipts, and quickly reorder your favorite meals
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-error-container text-error text-xs font-body flex items-center gap-3">
          <span className="material-symbols-outlined text-[20px]">warning</span>
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-container pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-2xl font-label text-xs font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-on-surface text-white'
              : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
          }`}
        >
          All Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-2xl font-label text-xs font-bold transition-all ${
            activeTab === 'active'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
          }`}
        >
          Active Deliveries
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-2xl font-label text-xs font-bold transition-all ${
            activeTab === 'completed'
              ? 'bg-secondary text-white shadow-sm'
              : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
          }`}
        >
          Past Delivered
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-4 py-2 rounded-2xl font-label text-xs font-bold transition-all ${
            activeTab === 'cancelled'
              ? 'bg-error text-white shadow-sm'
              : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
          }`}
        >
          Cancelled
        </button>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 bg-surface-container-low rounded-3xl" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-16 rounded-3xl bg-surface-container-lowest ghost-border text-center space-y-4 max-w-md mx-auto">
          <span className="material-symbols-outlined text-outline text-[48px]">receipt_long</span>
          <h3 className="font-headline font-bold text-lg text-on-surface">No orders in this section</h3>
          <p className="font-body text-xs text-on-surface-variant">
            Explore our curated culinary partners and place your first order.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container"
          >
            Start Exploring
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isActive = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(order.status);
            const isDelivered = order.status === 'DELIVERED';

            return (
              <div
                key={order.id}
                className="bg-surface-container-lowest rounded-3xl p-6 ghost-border shadow-level-1 hover:shadow-level-2 transition-all space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-container gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">restaurant</span>
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-base text-on-surface">
                        {order.restaurantName || `Restaurant #${order.restaurantId}`}
                      </h3>
                      <p className="font-body text-[11px] text-outline">
                        Order #FD-{String(order.id).padStart(4, '0')} • {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Today'}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full font-label text-xs font-bold flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-primary-fixed text-primary animate-pulse'
                          : isDelivered
                          ? 'bg-secondary-fixed text-secondary'
                          : 'bg-error-container text-error'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current" />
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items preview snippet */}
                <div className="text-xs font-body text-on-surface-variant flex flex-wrap items-center gap-2">
                  {order.items?.map((item, idx) => (
                    <span key={idx} className="bg-surface-container-low px-2.5 py-1 rounded-xl font-medium">
                      {item.quantity}x {item.itemName}
                    </span>
                  ))}
                </div>

                {/* Footer Row: Total & Actions */}
                <div className="pt-3 border-t border-surface-container flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-label text-outline font-semibold">Total Paid: </span>
                    <strong className="font-headline font-extrabold text-base text-primary">${order.totalAmount?.toFixed(2)}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive && (
                      <Link
                        to={`/orders/${order.id}/track`}
                        className="px-4 py-2 rounded-xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container shadow-sm flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">near_me</span>
                        Track Order
                      </Link>
                    )}

                    <Link
                      to={`/orders/${order.id}`}
                      className="px-4 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label text-xs font-bold transition-all"
                    >
                      View Details
                    </Link>

                    <button
                      onClick={() => handleReorder(order)}
                      className="px-4 py-2 rounded-xl bg-surface-container-lowest hover:bg-primary hover:text-white border border-surface-container text-on-surface font-label text-xs font-bold transition-all flex items-center gap-1 group"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary group-hover:text-white">repeat</span>
                      Reorder
                    </button>

                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-3 py-2 rounded-xl text-error hover:bg-error-container/40 font-label text-xs font-bold transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
