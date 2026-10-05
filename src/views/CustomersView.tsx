import React, { useState } from 'react';
import { MOCK_CUSTOMERS, Customer } from '../data/mockData';
import { Badge } from '../components/common/Badge';

export const CustomersView: React.FC = () => {
  const [customers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(MOCK_CUSTOMERS[0]);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-container">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-background">
            Customer Relations & Loyalty CRM
          </h1>
          <p className="font-body text-xs md:text-sm text-on-surface-variant mt-1">
            Track user lifetime value, ordering frequency, VIP tiers, and customer service activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customers..."
              className="w-full pl-9 pr-3 py-2 bg-surface-container-low border border-surface-container rounded-xl text-xs font-body focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Customers Table */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl ghost-border shadow-level-1 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body text-sm">
              <thead className="bg-surface-container-low text-on-surface-variant font-label uppercase text-[11px] tracking-wider border-b border-surface-container">
                <tr>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Total Orders</th>
                  <th className="py-3.5 px-6">Lifetime Value</th>
                  <th className="py-3.5 px-6">Favorite Cuisine</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container/60">
                {filtered.map((cust) => (
                  <tr
                    key={cust.id}
                    onClick={() => setSelectedCustomer(cust)}
                    className={`hover:bg-surface-container-low/40 transition-colors cursor-pointer ${
                      selectedCustomer?.id === cust.id ? 'bg-primary-fixed/15' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={cust.avatar}
                          alt={cust.name}
                          className="w-9 h-9 rounded-full object-cover ghost-border shrink-0"
                        />
                        <div>
                          <span className="font-semibold text-on-surface text-xs block">{cust.name}</span>
                          <span className="text-[11px] text-on-surface-variant">{cust.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-headline font-bold text-xs text-on-surface">
                      {cust.totalOrders}
                    </td>
                    <td className="py-4 px-6 font-headline font-bold text-xs text-secondary">
                      ${cust.totalSpent.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-xs text-on-surface-variant font-medium">
                      {cust.favoriteCuisine}
                    </td>
                    <td className="py-4 px-6">
                      <Badge status={cust.status} size="sm" />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(cust);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container font-label text-xs font-semibold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Customer Profile Detail Drawer */}
        {selectedCustomer && (
          <div className="lg:col-span-4 bg-surface-container-lowest p-6 rounded-xl ghost-border shadow-level-1 space-y-6 sticky top-28">
            <div className="text-center space-y-2 pb-4 border-b border-surface-container">
              <img
                src={selectedCustomer.avatar}
                alt={selectedCustomer.name}
                className="w-20 h-20 rounded-full object-cover mx-auto ghost-border shadow-sm"
              />
              <h3 className="font-headline text-lg font-bold text-on-surface">{selectedCustomer.name}</h3>
              <div className="flex items-center justify-center gap-2">
                <Badge status={selectedCustomer.status} size="sm" />
                <span className="text-xs text-on-surface-variant font-body">Joined {selectedCustomer.joinedDate}</span>
              </div>
            </div>

            <div className="space-y-3 font-body text-xs">
              <div className="flex justify-between py-1.5 border-b border-surface-container/60">
                <span className="text-on-surface-variant font-medium">Email</span>
                <span className="font-semibold text-on-surface">{selectedCustomer.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-surface-container/60">
                <span className="text-on-surface-variant font-medium">Phone</span>
                <span className="font-semibold text-on-surface">{selectedCustomer.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-surface-container/60">
                <span className="text-on-surface-variant font-medium">Primary Address</span>
                <span className="font-semibold text-on-surface text-right max-w-[170px] truncate">{selectedCustomer.address}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-surface-container/60">
                <span className="text-on-surface-variant font-medium">Last Order</span>
                <span className="font-semibold text-on-surface">{selectedCustomer.lastOrderDate}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => alert(`Email promo sent to ${selectedCustomer.email}`)}
                className="flex-1 py-2 rounded-xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container transition-colors"
              >
                Send Promo Voucher
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
