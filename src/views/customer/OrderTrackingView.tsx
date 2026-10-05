import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { fleetService } from '../../services/fleetService';
import { Order, LiveDelivery } from '../../types';

const TIMELINE_STEPS = [
  { id: 'PENDING', label: 'Order Placed', desc: 'Received & routed to kitchen', icon: 'receipt' },
  { id: 'CONFIRMED', label: 'Restaurant Confirmed', desc: 'Kitchen acknowledged ticket', icon: 'check_circle' },
  { id: 'PREPARING', label: 'Preparing Food', desc: 'Chef handcrafted preparation', icon: 'outdoor_grill' },
  { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Courier on the way to you', icon: 'two_wheeler' },
  { id: 'DELIVERED', label: 'Delivered', desc: 'Enjoy your delicious meal!', icon: 'home' },
];

export const OrderTrackingView: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [delivery, setDelivery] = useState<LiveDelivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [eta, setEta] = useState(24);

  const numOrderId = Number(orderId);

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!numOrderId || isNaN(numOrderId)) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const orderData = await orderService.getOrderById(numOrderId);
        setOrder(orderData);

        // Try to fetch fleet live delivery
        try {
          const liveData = await fleetService.getDeliveryByOrderId(numOrderId);
          if (liveData) {
            setDelivery(liveData);
            if (liveData.etaMinutes) setEta(liveData.etaMinutes);
          }
        } catch {
          // Fallback to top live courier from fleet
          const allLive = await fleetService.getLiveDeliveries();
          if (allLive.length > 0) {
            setDelivery(allLive[0]);
            setEta(allLive[0].etaMinutes || 18);
          }
        }
      } catch (err) {
        console.warn('Order tracking fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
    const timer = setInterval(() => {
      setEta((prev) => Math.max(1, prev - 1));
    }, 60000);
    return () => clearInterval(timer);
  }, [numOrderId]);

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 animate-pulse">
        <div className="h-48 bg-surface-container-low rounded-3xl" />
        <div className="h-64 bg-surface-container-low rounded-3xl" />
      </div>
    );
  }

  // Determine current active step index (0 to 4)
  const currentStatus = order?.status || 'PREPARING';
  const getStepIndex = (status: string) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'CONFIRMED': return 1;
      case 'PREPARING': return 2;
      case 'OUT_FOR_DELIVERY': return 3;
      case 'DELIVERED': return 4;
      default: return 2;
    }
  };

  const activeStepIdx = getStepIndex(currentStatus);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-label text-outline">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link to="/orders" className="hover:text-primary transition-colors">Orders</Link>
        <span>/</span>
        <span className="text-on-surface font-bold">Track Order #FD-{orderId?.padStart(4, '0')}</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-on-surface">
            Live Order Tracking
          </h1>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Real-time updates from our kitchen dispatch and courier fleet
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-secondary-fixed text-secondary font-headline font-extrabold text-sm shadow-sm w-fit">
          <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
          <span>Estimated Delivery in ~{eta} Mins</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: 5-Stage Stepper & Live Map Visualization */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. ORDER STATUS STEPPER */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 ghost-border shadow-level-1 space-y-6">
            <h3 className="font-headline font-bold text-base text-on-surface">
              Preparation & Delivery Progress
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-surface-container">
              {TIMELINE_STEPS.map((step, idx) => {
                const isPassed = idx <= activeStepIdx;
                const isCurrent = idx === activeStepIdx;

                return (
                  <div key={step.id} className="relative flex items-start gap-4">
                    {/* Stepper Dot / Icon */}
                    <div
                      className={`absolute -left-6 sm:-left-8 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-primary text-white ring-4 ring-primary-fixed scale-110 shadow-glow-primary'
                          : isPassed
                          ? 'bg-secondary text-white'
                          : 'bg-surface-container-low text-outline'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
                        {isPassed ? (isCurrent ? step.icon : 'check') : step.icon}
                      </span>
                    </div>

                    {/* Step description */}
                    <div className="leading-tight space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`font-headline font-bold text-sm sm:text-base ${
                            isCurrent
                              ? 'text-primary'
                              : isPassed
                              ? 'text-on-surface'
                              : 'text-outline'
                          }`}
                        >
                          {step.label}
                        </h4>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label text-[10px] font-bold animate-pulse">
                            In Progress
                          </span>
                        )}
                      </div>
                      <p className="font-body text-xs text-on-surface-variant">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. LIVE ROUTE MAP VISUALIZATION CARD */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 ghost-border shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">map</span>
                Live Route & Driver Radar
              </h3>
              <span className="text-[11px] font-label text-secondary font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
                Live GPS Active
              </span>
            </div>

            {/* Visual Route Canvas */}
            <div className="relative w-full h-56 rounded-2xl bg-surface-container-low overflow-hidden border border-surface-container flex flex-col justify-between p-4">
              {/* Map grid lines background */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#b51c00_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Waypoint 1: Restaurant Kitchen */}
              <div className="relative z-10 flex items-center gap-3 bg-surface-container-lowest/90 backdrop-blur-md p-2.5 rounded-2xl shadow-sm w-fit">
                <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">restaurant</span>
                </div>
                <div className="leading-tight">
                  <span className="font-label text-[10px] uppercase text-outline font-bold">Kitchen</span>
                  <p className="font-headline font-bold text-xs text-on-surface">Trattoria Bella (SoHo)</p>
                </div>
              </div>

              {/* Moving Courier Icon in Middle */}
              <div className="relative z-10 mx-auto bg-primary text-white px-3 py-1.5 rounded-full shadow-glow-primary flex items-center gap-2 font-label text-xs font-bold animate-bounce">
                <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
                <span>Courier En Route (~{eta} min)</span>
              </div>

              {/* Waypoint 2: Customer Doorstep */}
              <div className="relative z-10 flex items-center gap-3 bg-surface-container-lowest/90 backdrop-blur-md p-2.5 rounded-2xl shadow-sm w-fit self-end">
                <div className="w-8 h-8 rounded-xl bg-secondary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">home</span>
                </div>
                <div className="leading-tight text-right">
                  <span className="font-label text-[10px] uppercase text-outline font-bold">Destination</span>
                  <p className="font-headline font-bold text-xs text-on-surface">Doorstep Delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Courier Card & Order Items Summary */}
        <div className="lg:col-span-5 space-y-6">
          {/* Courier Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 ghost-border shadow-level-1 space-y-4">
            <span className="text-[10px] font-label font-bold uppercase tracking-wider text-outline">
              Assigned Delivery Partner
            </span>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <img
                    src={
                      delivery?.driverAvatar ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                    }
                    alt={delivery?.driverName || 'Courier Driver'}
                    className="w-14 h-14 rounded-2xl object-cover ghost-border"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-secondary border-2 border-white flex items-center justify-center text-[10px] text-white">
                    ✓
                  </span>
                </div>

                <div>
                  <h4 className="font-headline font-bold text-base text-on-surface">
                    {delivery?.driverName || 'Marcus Vance'}
                  </h4>
                  <p className="font-body text-xs text-on-surface-variant">
                    {delivery?.vehicle || 'Super73 E-Bike Fleet'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-label text-secondary font-bold flex items-center gap-0.5">
                      ⭐ 4.95 Rating
                    </span>
                    <span className="text-outline text-xs">•</span>
                    <span className="text-[11px] font-label text-outline font-medium">
                      🔋 88% Battery
                    </span>
                  </div>
                </div>
              </div>

              {/* Call Action Button */}
              <a
                href={`tel:${delivery?.driverPhone || '+15552345678'}`}
                className="w-11 h-11 rounded-2xl bg-secondary-fixed text-secondary hover:bg-secondary hover:text-white flex items-center justify-center shadow-sm transition-all"
                title="Call Courier"
              >
                <span className="material-symbols-outlined text-[22px]">phone</span>
              </a>
            </div>
          </div>

          {/* Order Details Accordion */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 ghost-border shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <h4 className="font-headline font-bold text-sm text-on-surface">
                Order Items Summary
              </h4>
              <span className="font-mono text-xs font-bold text-primary">
                #FD-{orderId?.padStart(4, '0')}
              </span>
            </div>

            {order?.items && (
              <div className="space-y-2.5 divide-y divide-surface-container/50">
                {order.items.map((item, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex justify-between text-xs font-body">
                    <span className="font-medium text-on-surface">
                      {item.quantity}x {item.itemName}
                    </span>
                    <span className="font-bold text-on-surface">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                <div className="pt-3 border-t border-surface-container flex justify-between font-headline font-bold text-sm text-on-surface">
                  <span>Grand Total</span>
                  <span className="text-primary">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="pt-2">
              <Link
                to="/orders"
                className="w-full py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-label font-bold flex items-center justify-center gap-1 transition-all"
              >
                <span>View All My Orders</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
