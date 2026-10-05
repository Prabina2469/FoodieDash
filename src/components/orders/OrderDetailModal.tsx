import React, { useState } from 'react';
import { Order } from '../../data/mockData';
import { Badge, DietaryTag } from '../common/Badge';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus?: (orderId: string, newStatus: Order['status']) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
}) => {
  if (!order) return null;

  const [currentStatus, setCurrentStatus] = useState<Order['status']>(order.status);

  const handleStatusChange = (newStatus: Order['status']) => {
    setCurrentStatus(newStatus);
    onUpdateStatus?.(order.id, newStatus);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-level-3 ghost-border overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-container bg-surface-container-low/50">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-headline text-xl font-bold text-on-surface">
                Order {order.id}
              </h3>
              <Badge status={currentStatus} />
            </div>
            <p className="font-body text-xs text-on-surface-variant mt-1">
              Placed {order.createdAt} • {order.paymentMethod} ({order.paymentStatus})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Status Updater */}
          <div className="bg-surface-container-low p-4 rounded-xl ghost-border">
            <span className="font-label text-xs uppercase font-bold text-on-surface-variant block mb-2">
              Update Live Fulfillment Status
            </span>
            <div className="flex flex-wrap gap-2">
              {(['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`px-3 py-1.5 rounded-full font-label text-xs font-semibold transition-all ${
                    currentStatus === st
                      ? 'bg-primary text-white shadow-sm ring-2 ring-primary/30'
                      : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Customer & Restaurant Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-surface-container bg-surface-container-lowest">
              <div className="flex items-center gap-2 mb-2 text-primary font-label text-xs font-bold uppercase">
                <span className="material-symbols-outlined text-[18px]">person</span>
                Customer Details
              </div>
              <p className="font-headline font-bold text-sm text-on-surface">{order.customer.name}</p>
              <p className="font-body text-xs text-on-surface-variant mt-0.5">{order.customer.phone}</p>
              <p className="font-body text-xs text-on-surface-variant mt-2 leading-relaxed">
                <span className="font-semibold text-on-surface">Delivery Address:</span><br />
                {order.customer.address}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-surface-container bg-surface-container-lowest">
              <div className="flex items-center gap-2 mb-2 text-secondary font-label text-xs font-bold uppercase">
                <span className="material-symbols-outlined text-[18px]">storefront</span>
                Restaurant Details
              </div>
              <p className="font-headline font-bold text-sm text-on-surface">{order.restaurant.name}</p>
              <p className="font-body text-xs text-on-surface-variant mt-0.5">{order.restaurant.cuisine}</p>
              {order.rider && (
                <div className="mt-3 pt-3 border-t border-surface-container">
                  <span className="font-label text-[11px] uppercase text-outline font-bold">Assigned Rider:</span>
                  <p className="font-label text-xs font-bold text-on-surface mt-0.5">{order.rider.name} ({order.rider.vehicle})</p>
                </div>
              )}
            </div>
          </div>

          {/* Itemized Order Receipt */}
          <div className="border border-surface-container rounded-xl overflow-hidden">
            <div className="bg-surface-container-low px-4 py-2.5 font-label text-xs font-bold uppercase text-on-surface-variant">
              Itemized Receipt
            </div>
            <div className="divide-y divide-surface-container/60 p-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 px-2">
                  <div className="flex items-center gap-2.5">
                    <DietaryTag isVeg={item.isVeg ?? true} />
                    <span className="font-label text-xs font-bold text-primary bg-primary-fixed/50 px-2 py-0.5 rounded">
                      {item.quantity}x
                    </span>
                    <span className="font-body text-sm text-on-surface font-medium">{item.name}</span>
                  </div>
                  <span className="font-label text-sm font-bold text-on-surface">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Calculations */}
            <div className="bg-surface-container-low/60 p-4 border-t border-surface-container space-y-1.5 font-body text-xs text-on-surface-variant">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${(order.amount * 0.85).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Delivery Fee</span>
                <span>$4.50</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Processing</span>
                <span>${(order.amount * 0.15 - 4.5).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-headline text-base font-bold text-on-surface pt-2 border-t border-surface-container">
                <span>Total Amount Paid</span>
                <span className="text-primary">${order.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-surface-container bg-surface-container-low/30 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-label text-xs font-bold hover:bg-surface-container-high transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              alert(`Receipt for order ${order.id} sent to printer.`);
            }}
            className="px-4 py-2 rounded-xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
