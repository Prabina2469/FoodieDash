import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useLocation } from '../../context/LocationContext';
import { userService } from '../../services/userService';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';

export const CheckoutView: React.FC = () => {
  const {
    items,
    restaurantId,
    restaurantName,
    itemTotal,
    deliveryFee,
    platformFee,
    tax,
    discount,
    grandTotal,
    appliedCoupon,
    clearCart
  } = useCart();

  const { savedAddresses, refreshAddresses } = useLocation();
  const navigate = useNavigate();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState('Home');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrApt, setNewAddrApt] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('New York');
  const [newAddrState, setNewAddrState] = useState('NY');
  const [newAddrZip, setNewAddrZip] = useState('10001');

  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'UPI' | 'DIGITAL_WALLET' | 'CASH_ON_DELIVERY'>('CREDIT_CARD');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  const [deliveryNote, setDeliveryNote] = useState('');
  const [noCutlery, setNoCutlery] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  useEffect(() => {
    if (savedAddresses.length > 0) {
      const defaultAddr = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];
      if (defaultAddr.id) {
        setSelectedAddressId(defaultAddr.id);
      }
    }
  }, [savedAddresses]);

  // If cart is empty, redirect to /
  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-headline font-bold text-xl text-on-surface">Your cart is empty</h2>
        <p className="font-body text-xs text-on-surface-variant">Add delicious food before checking out.</p>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 rounded-xl bg-primary text-white font-label text-xs font-bold"
        >
          Explore Restaurants
        </Link>
      </div>
    );
  }

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet.trim() || !newAddrCity.trim() || !newAddrZip.trim()) {
      alert('Please enter complete street address, city, and zip code');
      return;
    }

    try {
      const created = await userService.addAddress({
        label: newAddrLabel,
        streetAddress: newAddrStreet,
        aptSuite: newAddrApt || undefined,
        city: newAddrCity,
        state: newAddrState,
        zipCode: newAddrZip,
        isDefault: savedAddresses.length === 0
      });
      await refreshAddresses();
      if (created.id) {
        setSelectedAddressId(created.id);
      }
      setShowAddAddressModal(false);
      setNewAddrStreet('');
      setNewAddrApt('');
    } catch (err: any) {
      console.warn('Failed to save address:', err);
      alert('Failed to save address. Please check inputs.');
    }
  };

  const handlePlaceOrder = async () => {
    setOrderError(null);
    if (!selectedAddressId && savedAddresses.length === 0) {
      setOrderError('Please provide a delivery address before placing order.');
      setShowAddAddressModal(true);
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create order on real backend
      const activeAddressId = selectedAddressId || (savedAddresses[0]?.id as number) || 1;
      const orderPayload = {
        restaurantId: restaurantId || 1,
        deliveryAddressId: activeAddressId,
        items: items.map((i) => ({
          menuItemId: i.menuItemId,
          itemName: i.itemName,
          quantity: i.quantity,
          price: i.price
        }))
      };

      const createdOrder = await orderService.createOrder(orderPayload);
      const orderId = createdOrder.id;

      // 2. Process real payment transaction
      try {
        await paymentService.processPayment({
          orderId: orderId,
          amount: grandTotal,
          paymentMethod: paymentMethod,
          currency: 'USD'
        });
      } catch (payErr) {
        console.warn('Payment processing warning:', payErr);
      }

      // 3. Clear cart and redirect to order success
      await clearCart();
      navigate(`/order-success/${orderId}`);
    } catch (err: any) {
      console.error('Order creation failed:', err);
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to place order. Please try again.';
      setOrderError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-label text-outline">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link to="/cart" className="hover:text-primary transition-colors">Cart</Link>
        <span>/</span>
        <span className="text-on-surface font-bold">Checkout & Payment</span>
      </nav>

      <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-on-surface">
        Secure Checkout
      </h1>

      {orderError && (
        <div className="p-4 rounded-2xl bg-error-container/40 border border-error/30 text-error flex items-center gap-3 text-xs font-body">
          <span className="material-symbols-outlined text-[20px] shrink-0">error</span>
          <span>{orderError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Addresses, Instructions, Payment Methods */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. DELIVERY ADDRESS SELECTION */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 ghost-border shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 className="font-headline font-bold text-base text-on-surface">
                  Delivery Address
                </h3>
              </div>

              <button
                onClick={() => setShowAddAddressModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-label text-xs font-bold transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Add New Address
              </button>
            </div>

            {savedAddresses.length === 0 ? (
              <div className="p-6 rounded-2xl bg-surface-container-low border border-dashed border-surface-container text-center space-y-3">
                <span className="material-symbols-outlined text-outline text-[32px]">location_off</span>
                <p className="font-body text-xs text-on-surface-variant">No delivery address saved yet.</p>
                <button
                  onClick={() => setShowAddAddressModal(true)}
                  className="px-5 py-2 rounded-xl bg-primary text-white font-label text-xs font-bold"
                >
                  Enter Delivery Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedAddresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => addr.id && setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary-fixed/20 shadow-sm ring-2 ring-primary/30'
                          : 'border-surface-container hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-headline font-bold text-xs text-on-surface flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-primary">
                            {addr.label === 'Work' ? 'business' : addr.label === 'Home' ? 'home' : 'pin_drop'}
                          </span>
                          {addr.label}
                        </span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        )}
                      </div>
                      <p className="font-body text-xs text-on-surface-variant line-clamp-2 mt-1">
                        {addr.streetAddress}{addr.aptSuite ? `, ${addr.aptSuite}` : ''}, {addr.city}, {addr.state} {addr.zipCode}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Inline Add Address Modal / Drawer */}
          {showAddAddressModal && (
            <div className="p-6 bg-surface-container-low rounded-3xl border border-primary/30 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h4 className="font-headline font-bold text-sm text-on-surface">Add New Delivery Address</h4>
                <button
                  onClick={() => setShowAddAddressModal(false)}
                  className="text-outline hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateAddress} className="space-y-3">
                <div className="flex gap-2">
                  {['Home', 'Work', 'Other'].map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setNewAddrLabel(label)}
                      className={`px-3.5 py-1.5 rounded-xl font-label text-xs font-bold transition-all ${
                        newAddrLabel === label
                          ? 'bg-primary text-white'
                          : 'bg-surface-container-lowest text-on-surface border border-surface-container'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={newAddrStreet}
                  onChange={(e) => setNewAddrStreet(e.target.value)}
                  placeholder="Street Address (e.g. 742 Evergreen Terrace)"
                  required
                  className="w-full p-3 rounded-xl bg-surface-container-lowest border border-surface-container text-xs font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <div className="grid grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={newAddrApt}
                    onChange={(e) => setNewAddrApt(e.target.value)}
                    placeholder="Apt/Suite"
                    className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container text-xs font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    value={newAddrCity}
                    onChange={(e) => setNewAddrCity(e.target.value)}
                    placeholder="City"
                    required
                    className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container text-xs font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    value={newAddrState}
                    onChange={(e) => setNewAddrState(e.target.value)}
                    placeholder="State"
                    required
                    className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container text-xs font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    value={newAddrZip}
                    onChange={(e) => setNewAddrZip(e.target.value)}
                    placeholder="Zip"
                    required
                    className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container text-xs font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAddressModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-label text-on-surface font-semibold hover:bg-surface-container"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-label font-bold hover:bg-primary-container"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. PAYMENT METHOD SELECTION */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 ghost-border shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-headline font-bold text-base text-on-surface">
                Payment Method
              </h3>
            </div>

            <div className="space-y-3">
              {/* Option 1: Credit / Debit Card */}
              <label
                onClick={() => setPaymentMethod('CREDIT_CARD')}
                className={`flex flex-col p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'CREDIT_CARD'
                    ? 'border-primary bg-primary-fixed/15 shadow-sm'
                    : 'border-surface-container hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'CREDIT_CARD'}
                      onChange={() => setPaymentMethod('CREDIT_CARD')}
                      className="accent-primary w-4 h-4"
                    />
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">credit_card</span>
                      <span className="font-headline font-bold text-xs sm:text-sm text-on-surface">
                        Credit / Debit Card (Visa, Mastercard, Amex)
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-label text-secondary font-bold bg-secondary-fixed px-2 py-0.5 rounded">
                    Instant 256-Bit SSL
                  </span>
                </div>

                {paymentMethod === 'CREDIT_CARD' && (
                  <div className="mt-4 pt-4 border-t border-surface-container/60 space-y-3">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card Number"
                      className="w-full p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container text-xs font-mono font-bold text-on-surface"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container text-xs font-mono font-bold text-on-surface"
                      />
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="CVV"
                        maxLength={4}
                        className="p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container text-xs font-mono font-bold text-on-surface"
                      />
                    </div>
                  </div>
                )}
              </label>

              {/* Option 2: Digital Wallet */}
              <label
                onClick={() => setPaymentMethod('DIGITAL_WALLET')}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'DIGITAL_WALLET'
                    ? 'border-primary bg-primary-fixed/15 shadow-sm'
                    : 'border-surface-container hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'DIGITAL_WALLET'}
                    onChange={() => setPaymentMethod('DIGITAL_WALLET')}
                    className="accent-primary w-4 h-4"
                  />
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">account_balance_wallet</span>
                    <span className="font-headline font-bold text-xs sm:text-sm text-on-surface">
                      Apple Pay / Google Pay / PayPal
                    </span>
                  </div>
                </div>
                <span className="text-xs font-label text-outline font-semibold">1-Tap Pay</span>
              </label>

              {/* Option 3: UPI / Instant Pay */}
              <label
                onClick={() => setPaymentMethod('UPI')}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-primary bg-primary-fixed/15 shadow-sm'
                    : 'border-surface-container hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="accent-primary w-4 h-4"
                  />
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">qr_code_scanner</span>
                    <span className="font-headline font-bold text-xs sm:text-sm text-on-surface">
                      UPI / Instant Bank Transfer
                    </span>
                  </div>
                </div>
                <span className="text-xs font-label text-outline font-semibold">Zero Fee</span>
              </label>

              {/* Option 4: Cash on Delivery */}
              <label
                onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'border-primary bg-primary-fixed/15 shadow-sm'
                    : 'border-surface-container hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'CASH_ON_DELIVERY'}
                    onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                    className="accent-primary w-4 h-4"
                  />
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
                    <span className="font-headline font-bold text-xs sm:text-sm text-on-surface">
                      Cash on Delivery (COD)
                    </span>
                  </div>
                </div>
                <span className="text-xs font-label text-outline font-semibold">Pay at Door</span>
              </label>
            </div>
          </div>

          {/* 3. DELIVERY PREFERENCES & NOTES */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 ghost-border shadow-sm space-y-3">
            <h4 className="font-headline font-bold text-sm text-on-surface">Delivery Notes & Preferences</h4>
            <input
              type="text"
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
              placeholder="e.g. Ring doorbell, leave at front desk, call upon arrival..."
              className="w-full p-3 rounded-2xl bg-surface-container-low border border-surface-container text-xs font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <label className="flex items-center gap-2 pt-1 cursor-pointer select-none text-xs font-body text-on-surface-variant">
              <input
                type="checkbox"
                checked={noCutlery}
                onChange={(e) => setNoCutlery(e.target.checked)}
                className="accent-secondary w-4 h-4 rounded"
              />
              <span>🌱 Opt out of plastic cutlery & paper napkins (Help reduce waste)</span>
            </label>
          </div>
        </div>

        {/* Right 5 Cols: Order Summary & Place Order */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface-container-lowest rounded-3xl p-6 ghost-border shadow-level-1 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div>
                <span className="text-[10px] font-label font-bold uppercase tracking-wider text-outline">
                  Order Summary
                </span>
                <h3 className="font-headline font-bold text-base text-on-surface">
                  {restaurantName || 'FoodieDash Partner Kitchen'}
                </h3>
              </div>
              <Link to="/cart" className="text-xs font-label font-bold text-primary hover:underline">
                Edit Cart
              </Link>
            </div>

            {/* Items snippet */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto divide-y divide-surface-container/50">
              {items.map((i) => (
                <div key={i.menuItemId} className="pt-2 first:pt-0 flex items-center justify-between text-xs font-body">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-on-surface">{i.quantity}x</span>
                    <span className="text-on-surface font-medium truncate max-w-[180px]">{i.itemName}</span>
                  </div>
                  <span className="font-bold text-on-surface">${i.subTotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="pt-3 border-t border-surface-container space-y-2 text-xs font-body text-on-surface-variant">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-medium text-on-surface">${itemTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                {deliveryFee === 0 ? <span className="text-secondary font-bold">FREE</span> : <span>${deliveryFee.toFixed(2)}</span>}
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>${platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-secondary font-bold">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-surface-container flex justify-between items-baseline text-base font-headline font-extrabold text-on-surface">
                <span>Total Due</span>
                <span className="text-xl text-primary">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={submitting}
              className={`w-full py-4 px-6 rounded-2xl bg-primary text-white font-label text-sm font-bold shadow-glow-primary active:scale-98 transition-all flex items-center justify-center gap-2 ${
                submitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-container'
              }`}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Transmitting Order to Kitchen...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                  <span>Place Order • ${grandTotal.toFixed(2)}</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center font-body text-outline leading-tight">
              By placing this order you agree to FoodieDash Terms of Service and live dispatch delivery routing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
