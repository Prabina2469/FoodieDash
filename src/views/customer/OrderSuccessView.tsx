import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';

export const OrderSuccessView: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const numOrderId = Number(orderId);

  useEffect(() => {
    const fetchOrder = async () => {
      if (numOrderId && !isNaN(numOrderId)) {
        try {
          const data = await orderService.getOrderById(numOrderId);
          setOrder(data);
        } catch (err) {
          console.warn('Order success load fallback:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [numOrderId]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 text-center space-y-8 pb-32 animate-in zoom-in-95">
      {/* Celebration Icon */}
      <div className="relative inline-block">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-secondary to-secondary-bright flex items-center justify-center text-white shadow-glow-secondary mx-auto">
          <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-tertiary-bright text-white flex items-center justify-center shadow-md">
          <span className="material-symbols-outlined text-[18px]">celebration</span>
        </div>
      </div>

      {/* Success Title */}
      <div className="space-y-2">
        <span className="font-label text-xs font-extrabold uppercase tracking-widest text-secondary bg-secondary-fixed/60 px-3 py-1 rounded-full">
          Order Successfully Dispatched
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-on-surface">
          🎉 Order Confirmed!
        </h1>
        <p className="font-body text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
          Your order has been transmitted to the kitchen. The restaurant is preparing your handcrafted meal.
        </p>
      </div>

      {/* Order Summary Receipt Card */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 ghost-border shadow-level-2 text-left space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-container gap-2">
          <div>
            <span className="font-label text-xs text-outline font-semibold">Order Reference</span>
            <p className="font-headline font-extrabold text-lg text-primary">
              #FD-{orderId?.padStart(4, '0')}
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-secondary-fixed text-secondary font-label text-xs font-bold w-fit">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span>Estimated Delivery: ~25-30 mins</span>
          </div>
        </div>

        {/* Order Details list if loaded */}
        {order && order.items && (
          <div className="space-y-3">
            <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-outline">
              Items Ordered
            </h4>
            <div className="divide-y divide-surface-container/60">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex justify-between text-xs font-body">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-on-surface">{item.quantity}x</span>
                    <span className="font-medium text-on-surface">{item.itemName}</span>
                  </div>
                  <span className="font-bold text-on-surface">${item.subTotal?.toFixed(2) || (item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-surface-container flex justify-between items-baseline font-headline font-extrabold text-sm sm:text-base text-on-surface">
              <span>Total Paid</span>
              <span className="text-lg text-primary">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Delivery Address Reminder */}
        <div className="p-4 rounded-2xl bg-surface-container-low flex items-start gap-3 text-xs font-body text-on-surface-variant">
          <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
            location_on
          </span>
          <div>
            <span className="font-headline font-bold text-on-surface block">Delivery Destination</span>
            <p className="mt-0.5">Your courier will arrive with the insulated meal carrier at your saved address.</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to={`/orders/${orderId}/track`}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-primary text-white font-label text-sm font-bold hover:bg-primary-container shadow-glow-primary active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">near_me</span>
          Track Live Order
        </Link>
        <Link
          to="/orders"
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label text-sm font-bold ghost-border shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
          View My Orders
        </Link>
        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label text-sm font-bold transition-all"
        >
          Continue Browsing
        </Link>
      </div>
    </div>
  );
};
