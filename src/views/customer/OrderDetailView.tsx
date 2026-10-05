import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';

export const OrderDetailView: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const numOrderId = Number(orderId);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!numOrderId || isNaN(numOrderId)) {
        setError('Invalid Order ID');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await orderService.getOrderById(numOrderId);
        setOrder(data);
      } catch (err: any) {
        setError('Order not found or access unauthorized.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [numOrderId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-4 animate-pulse">
        <div className="h-44 bg-surface-container-low rounded-3xl" />
        <div className="h-64 bg-surface-container-low rounded-3xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <span className="material-symbols-outlined text-error text-[48px]">receipt_long</span>
        <h2 className="font-headline font-bold text-xl text-on-surface">Order Not Available</h2>
        <p className="font-body text-xs text-on-surface-variant">{error || 'Order could not be located.'}</p>
        <Link to="/orders" className="inline-block px-6 py-2.5 rounded-xl bg-primary text-white font-label text-xs font-bold">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const isLive = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 pb-32">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-label text-outline">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link to="/orders" className="hover:text-primary transition-colors">Orders</Link>
        <span>/</span>
        <span className="text-on-surface font-bold">Receipt #FD-{String(order.id).padStart(4, '0')}</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 ghost-border shadow-level-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-label font-bold uppercase tracking-wider text-outline">
            Official Order Invoice
          </span>
          <h1 className="font-display font-extrabold text-2xl text-on-surface">
            Order #FD-{String(order.id).padStart(4, '0')}
          </h1>
          <p className="font-body text-xs text-on-surface-variant mt-0.5">
            Placed on {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Recent'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isLive && (
            <Link
              to={`/orders/${order.id}/track`}
              className="px-5 py-2.5 rounded-2xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container shadow-glow-primary flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">near_me</span>
              Live Tracking
            </Link>
          )}
          <span className="px-3.5 py-1.5 rounded-2xl bg-surface-container-low font-label text-xs font-bold text-on-surface">
            {order.status}
          </span>
        </div>
      </div>

      {/* Items Breakdown Table */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 ghost-border shadow-sm space-y-6">
        <h3 className="font-headline font-bold text-sm text-on-surface border-b border-surface-container pb-3">
          Ordered Dishes & Quantities
        </h3>

        <div className="divide-y divide-surface-container/60">
          {order.items?.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs font-body">
              <div>
                <span className="font-bold text-on-surface mr-2">{item.quantity}x</span>
                <span className="font-medium text-on-surface">{item.itemName}</span>
              </div>
              <span className="font-bold text-on-surface">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Bill calculation */}
        <div className="pt-4 border-t border-surface-container space-y-2 text-xs font-body text-on-surface-variant">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery & Platform Charges</span>
            <span>Included</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes</span>
            <span>Included</span>
          </div>

          <div className="pt-3 border-t border-surface-container flex justify-between items-baseline font-headline font-extrabold text-base text-on-surface">
            <span>Total Paid</span>
            <span className="text-xl text-primary">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Delivery & Payment Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl bg-surface-container-lowest ghost-border space-y-2">
          <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-outline">
            Delivery Address
          </h4>
          <p className="font-body text-xs text-on-surface">
            {order.deliveryAddress || 'Saved Customer Address'}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-surface-container-lowest ghost-border space-y-2">
          <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-outline">
            Payment Method
          </h4>
          <p className="font-body text-xs text-on-surface font-semibold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
            {order.paymentMethod || 'Credit Card / Electronic Transfer'}
          </p>
        </div>
      </div>
    </div>
  );
};
