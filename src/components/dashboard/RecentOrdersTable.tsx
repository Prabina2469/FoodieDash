import React, { useState } from 'react';
import { Order } from '../../data/mockData';
import { Badge } from '../common/Badge';
import { OrderDetailModal } from '../orders/OrderDetailModal';

interface RecentOrdersTableProps {
  orders: Order[];
  onUpdateOrderStatus?: (orderId: string, status: Order['status']) => void;
}

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('All Statuses');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const filterStatuses = ['All Statuses', 'Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = selectedStatus === 'All Statuses' || order.status === selectedStatus;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-surface-container-lowest rounded-xl ghost-border shadow-level-1 overflow-hidden">
      {/* Table Header & Controls */}
      <div className="p-6 border-b border-surface-container flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-headline text-lg font-bold text-on-surface">Recent Live Orders</h3>
            <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
            <span className="font-label text-xs font-bold text-secondary">Live Streaming Orders</span>
          </div>
          <p className="font-body text-xs text-on-surface-variant mt-1">
            Real-time feed of active orders and status transitions across all zones.
          </p>
        </div>

        {/* Filter Buttons & Search */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-56">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter table..."
              className="w-full pl-9 pr-3 py-1.5 bg-surface-container-low border border-surface-container rounded-lg text-xs font-body focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {filterStatuses.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg font-label text-xs font-semibold transition-all ${selectedStatus === st
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-body text-sm">
          <thead className="bg-surface-container-low text-on-surface-variant font-label uppercase text-[11px] tracking-wider border-b border-surface-container">
            <tr>
              <th className="py-3.5 px-6 font-semibold">Order ID</th>
              <th className="py-3.5 px-6 font-semibold">Customer</th>
              <th className="py-3.5 px-6 font-semibold">Restaurant</th>
              <th className="py-3.5 px-6 font-semibold">Items</th>
              <th className="py-3.5 px-6 font-semibold">Amount</th>
              <th className="py-3.5 px-6 font-semibold">Status</th>
              <th className="py-3.5 px-6 font-semibold">Elapsed</th>
              <th className="py-3.5 px-6 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container/60">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-on-surface-variant text-sm">
                  No orders match the selected filters.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-surface-container-low/40 transition-colors group cursor-pointer"
                  onClick={() => setActiveOrder(order)}
                >
                  {/* Order ID */}
                  <td className="py-4 px-6 font-mono text-xs font-bold text-primary group-hover:underline">
                    #{order.id}
                  </td>

                  {/* Customer */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container font-headline font-bold text-xs flex items-center justify-center shrink-0">
                        {order.customer.initials}
                      </div>
                      <div>
                        <span className="font-semibold text-on-surface block text-xs">
                          {order.customer.name}
                        </span>
                        <span className="text-[11px] text-on-surface-variant truncate max-w-[140px] block">
                          {order.customer.phone}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Restaurant */}
                  <td className="py-4 px-6">
                    <span className="font-semibold text-on-surface text-xs block">
                      {order.restaurant.name}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      {order.restaurant.cuisine}
                    </span>
                  </td>

                  {/* Items Summary */}
                  <td className="py-4 px-6 text-xs text-on-surface-variant">
                    <span className="font-medium text-on-surface">
                      {order.items.reduce((acc, curr) => acc + curr.quantity, 0)} items
                    </span>
                    <p className="truncate max-w-[130px] text-[11px]">
                      {order.items.map((i) => i.name).join(', ')}
                    </p>
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-6 font-headline font-bold text-on-surface text-sm">
                    ${order.amount.toFixed(2)}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-6">
                    <Badge status={order.status} size="sm" />
                  </td>

                  {/* Time Elapsed */}
                  <td className="py-4 px-6 text-xs text-on-surface-variant">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-outline">
                        timer
                      </span>
                      <span>{order.timeElapsed}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setActiveOrder(order)}
                      className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                      title="View Details"
                    >
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {activeOrder && (
        <OrderDetailModal
          order={activeOrder}
          onClose={() => setActiveOrder(null)}
          onUpdateStatus={onUpdateOrderStatus}
        />
      )}
    </div>
  );
};
