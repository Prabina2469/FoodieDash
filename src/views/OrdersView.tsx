import React, { useState } from 'react';
import { Order, MOCK_ORDERS } from '../data/mockData';
import { Badge, DietaryTag } from '../components/common/Badge';
import { OrderDetailModal } from '../components/orders/OrderDetailModal';

interface OrdersViewProps {
  orders: Order[];
  onUpdateOrderStatus?: (orderId: string, status: Order['status']) => void;
  onAddNewOrder?: (newOrder: Order) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders = MOCK_ORDERS,
  onUpdateOrderStatus,
  onAddNewOrder,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('All Statuses');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Order Form state
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newRestaurant, setNewRestaurant] = useState('Trattoria Bella');
  const [newAmount, setNewAmount] = useState('65.00');

  const filterTabs = [
    'All Statuses',
    'Pending',
    'Preparing',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = selectedStatus === 'All Statuses' || order.status === selectedStatus;
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName) return;

    const newOrder: Order = {
      id: `FD-${Math.floor(1000 + Math.random() * 9000)}X`,
      customer: {
        name: newCustomerName,
        initials: newCustomerName.slice(0, 2).toUpperCase(),
        phone: newCustomerPhone || '+1 (555) 000-1122',
        address: '500 7th Ave, New York, NY 10018',
      },
      restaurant: {
        name: newRestaurant,
        cuisine: 'Specialty Kitchen',
      },
      items: [
        { id: 'custom-1', name: 'Chef Special Platter', quantity: 1, price: parseFloat(newAmount), isVeg: false },
      ],
      amount: parseFloat(newAmount) || 50,
      status: 'Pending',
      timeElapsed: 'Just now',
      createdAt: 'Just now',
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
    };

    onAddNewOrder?.(newOrder);
    setShowCreateModal(false);
    setNewCustomerName('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-container">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-background">
            Order Monitoring & Dispatch
          </h1>
          <p className="font-body text-xs md:text-sm text-on-surface-variant mt-1">
            Real-time feed of platform transactions, customer requests, and rider allocations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container transition-all shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create Manual Dispatch
          </button>
        </div>
      </div>

      {/* KPI Quick Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl ghost-border">
          <span className="font-label text-xs uppercase text-on-surface-variant">Active Queue</span>
          <p className="font-headline text-2xl font-bold text-on-surface mt-1">
            {orders.filter((o) => o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Out for Delivery').length}
          </p>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl ghost-border">
          <span className="font-label text-xs uppercase text-on-surface-variant">In Kitchen</span>
          <p className="font-headline text-2xl font-bold text-primary mt-1">
            {orders.filter((o) => o.status === 'Preparing').length}
          </p>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl ghost-border">
          <span className="font-label text-xs uppercase text-on-surface-variant">On The Road</span>
          <p className="font-headline text-2xl font-bold text-secondary mt-1">
            {orders.filter((o) => o.status === 'Out for Delivery').length}
          </p>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl ghost-border">
          <span className="font-label text-xs uppercase text-on-surface-variant">Delivered (Today)</span>
          <p className="font-headline text-2xl font-bold text-on-surface mt-1">
            {orders.filter((o) => o.status === 'Delivered').length}
          </p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-surface-container-lowest rounded-xl ghost-border shadow-level-1 overflow-hidden">
        {/* Filter & Search Bar */}
        <div className="p-4 md:p-6 border-b border-surface-container flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedStatus(tab)}
                className={`px-3.5 py-1.5 rounded-lg font-label text-xs font-semibold transition-all ${
                  selectedStatus === tab
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, customer or kitchen..."
              className="w-full pl-9 pr-3 py-2 bg-surface-container-low border border-surface-container rounded-lg text-xs font-body focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-sm">
            <thead className="bg-surface-container-low text-on-surface-variant font-label uppercase text-[11px] tracking-wider border-b border-surface-container">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Order ID</th>
                <th className="py-3.5 px-6 font-semibold">Customer & Address</th>
                <th className="py-3.5 px-6 font-semibold">Restaurant</th>
                <th className="py-3.5 px-6 font-semibold">Items</th>
                <th className="py-3.5 px-6 font-semibold">Amount</th>
                <th className="py-3.5 px-6 font-semibold">Status</th>
                <th className="py-3.5 px-6 font-semibold">Elapsed</th>
                <th className="py-3.5 px-6 font-semibold text-right">Quick View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container/60">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setActiveOrder(order)}
                  className="hover:bg-surface-container-low/40 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-6 font-mono text-xs font-bold text-primary group-hover:underline">
                    #{order.id}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container font-headline font-bold text-xs flex items-center justify-center shrink-0">
                        {order.customer.initials}
                      </div>
                      <div>
                        <span className="font-semibold text-on-surface block text-xs">
                          {order.customer.name}
                        </span>
                        <span className="text-[11px] text-on-surface-variant truncate max-w-[170px] block">
                          {order.customer.address}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-xs">
                    <span className="font-semibold text-on-surface block">{order.restaurant.name}</span>
                    <span className="text-on-surface-variant text-[11px]">{order.restaurant.cuisine}</span>
                  </td>
                  <td className="py-4 px-6 text-xs text-on-surface-variant">
                    <div className="flex items-center gap-1.5">
                      <DietaryTag isVeg={order.items[0]?.isVeg ?? true} />
                      <span className="font-medium text-on-surface truncate max-w-[130px]">
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-headline font-bold text-on-surface text-sm">
                    ${order.amount.toFixed(2)}
                  </td>
                  <td className="py-4 px-6">
                    <Badge status={order.status} size="sm" />
                  </td>
                  <td className="py-4 px-6 text-xs text-on-surface-variant">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-outline">timer</span>
                      <span>{order.timeElapsed}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setActiveOrder(order)}
                      className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-primary font-label text-xs font-semibold transition-colors"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {activeOrder && (
        <OrderDetailModal
          order={activeOrder}
          onClose={() => setActiveOrder(null)}
          onUpdateStatus={onUpdateOrderStatus}
        />
      )}

      {/* Create Order Manual Dispatch Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-level-3 ghost-border p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-surface-container">
              <h3 className="font-headline text-lg font-bold text-on-surface">New Manual Dispatch</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 font-body text-xs">
              <div>
                <label className="font-label font-bold text-on-surface-variant block mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 bg-surface-container-low border border-surface-container rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-label font-bold text-on-surface-variant block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 bg-surface-container-low border border-surface-container rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-label font-bold text-on-surface-variant block mb-1">Restaurant</label>
                <select
                  value={newRestaurant}
                  onChange={(e) => setNewRestaurant(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-surface-container rounded-lg text-xs"
                >
                  <option value="Trattoria Bella">Trattoria Bella</option>
                  <option value="Zen Sushi & Grill">Zen Sushi & Grill</option>
                  <option value="Burger & Co. Craft Kitchen">Burger & Co. Craft Kitchen</option>
                  <option value="Spice Symphony">Spice Symphony</option>
                </select>
              </div>

              <div>
                <label className="font-label font-bold text-on-surface-variant block mb-1">Total Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-surface-container rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-label text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container"
                >
                  Dispatch Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
