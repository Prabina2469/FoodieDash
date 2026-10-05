import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { paymentService } from '../../services/paymentService';
import { PaymentTransaction } from '../../types';

export const CustomerPaymentsView: React.FC = () => {
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        const data = await paymentService.getMyPayments();
        setPayments(data || []);
      } catch (err) {
        console.warn('Payments load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPayments();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-32">
      {/* Header */}
      <div className="space-y-2">
        <nav className="flex items-center gap-2 text-xs font-label text-outline">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/profile" className="hover:text-primary transition-colors">Profile</Link>
          <span>/</span>
          <span className="text-on-surface font-bold">Payments</span>
        </nav>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-on-surface">
          Payment & Transaction History
        </h1>
        <p className="font-body text-xs sm:text-sm text-on-surface-variant">
          Track processed payments, digital receipts, and card authorizations
        </p>
      </div>

      {/* Security Banner */}
      <div className="p-4 rounded-3xl bg-secondary-fixed/40 border border-secondary/30 flex items-center gap-3 text-xs font-body text-on-surface-variant">
        <span className="material-symbols-outlined text-secondary text-[24px]">verified_user</span>
        <div>
          <span className="font-headline font-bold text-on-surface block">PCI-DSS Level 1 Encrypted</span>
          <span>All payment transactions are encrypted and authenticated via secure banking gateways.</span>
        </div>
      </div>

      {/* Transactions List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 bg-surface-container-low rounded-3xl" />
          ))}
        </div>
      ) : payments.length === 0 ? (
        <div className="p-16 rounded-3xl bg-surface-container-lowest ghost-border text-center space-y-4 max-w-md mx-auto">
          <span className="material-symbols-outlined text-outline text-[48px]">credit_card</span>
          <h3 className="font-headline font-bold text-lg text-on-surface">No transactions yet</h3>
          <p className="font-body text-xs text-on-surface-variant">
            Processed payments and invoices will show up here after you place an order.
          </p>
          <Link to="/" className="inline-block px-6 py-2.5 rounded-xl bg-primary text-white font-label text-xs font-bold">
            Order Food Now
          </Link>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-3xl p-6 ghost-border shadow-sm divide-y divide-surface-container">
          {payments.map((p) => (
            <div key={p.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">
                    {p.paymentMethod === 'CREDIT_CARD' ? 'credit_card' : p.paymentMethod === 'UPI' ? 'qr_code' : 'payments'}
                  </span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-sm text-on-surface">
                    Payment for Order #FD-{String(p.orderId).padStart(4, '0')}
                  </h4>
                  <p className="font-body text-xs text-outline">
                    Method: {p.paymentMethod} • {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Today'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-headline font-extrabold text-base text-on-surface block">
                  ${p.amount.toFixed(2)}
                </span>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-label font-bold ${
                  p.status === 'SUCCESS' ? 'bg-secondary-fixed text-secondary' : 'bg-error-container text-error'
                }`}>
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
