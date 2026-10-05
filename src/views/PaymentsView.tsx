import React, { useState } from 'react';
import { MOCK_TRANSACTIONS, Transaction } from '../data/mockData';
import { Badge } from '../components/common/Badge';

export const PaymentsView: React.FC = () => {
  const [transactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-container">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-background">
            Financials, Payments & Settlements
          </h1>
          <p className="font-body text-xs md:text-sm text-on-surface-variant mt-1">
            Real-time ledger of gateway transactions, commission withholdings, and restaurant vendor payouts.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting monthly financial CSV statement...')}
          className="px-4 py-2.5 rounded-xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container transition-all shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">file_download</span>
          Export Statement
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-surface-container-lowest p-6 rounded-2xl ghost-border shadow-level-1 space-y-1">
          <span className="font-label text-xs uppercase text-on-surface-variant font-bold">Total Processed</span>
          <p className="font-headline text-3xl font-bold text-on-surface">$184,920.50</p>
          <span className="font-label text-xs text-secondary font-semibold">+18.2% vs previous period</span>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-2xl ghost-border shadow-level-1 space-y-1">
          <span className="font-label text-xs uppercase text-on-surface-variant font-bold">Platform Take Rate (15%)</span>
          <p className="font-headline text-3xl font-bold text-primary">$27,738.00</p>
          <span className="font-label text-xs text-on-surface-variant">Net commissions retained</span>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-2xl ghost-border shadow-level-1 space-y-1">
          <span className="font-label text-xs uppercase text-on-surface-variant font-bold">Pending Merchant Payouts</span>
          <p className="font-headline text-3xl font-bold text-tertiary">$14,210.40</p>
          <span className="font-label text-xs text-outline">Settlement scheduled for Friday</span>
        </div>
      </div>

      {/* Transaction Log Table */}
      <div className="bg-surface-container-lowest rounded-xl ghost-border shadow-level-1 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-surface-container flex justify-between items-center">
          <h3 className="font-headline text-base font-bold text-on-surface">Recent Gateway Transactions</h3>
          <span className="font-label text-xs text-outline">Showing recent 24h logs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-sm">
            <thead className="bg-surface-container-low text-on-surface-variant font-label uppercase text-[11px] tracking-wider border-b border-surface-container">
              <tr>
                <th className="py-3.5 px-6">Txn ID</th>
                <th className="py-3.5 px-6">Order ID</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Gross Amount</th>
                <th className="py-3.5 px-6">Platform Fee</th>
                <th className="py-3.5 px-6">Merchant Net</th>
                <th className="py-3.5 px-6">Method</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container/60">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-4 px-6 font-mono text-xs font-bold text-on-surface">
                    {txn.id}
                  </td>
                  <td className="py-4 px-6 font-mono text-xs text-primary font-bold">
                    #{txn.orderId}
                  </td>
                  <td className="py-4 px-6 text-xs font-semibold text-on-surface">
                    {txn.customerName}
                  </td>
                  <td className="py-4 px-6 font-headline font-bold text-sm text-on-surface">
                    ${txn.amount.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 font-label text-xs font-bold text-primary">
                    ${txn.fee.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 font-headline font-bold text-xs text-secondary">
                    ${txn.netPayout.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-xs text-on-surface-variant font-medium">
                    {txn.method}
                  </td>
                  <td className="py-4 px-6">
                    <Badge status={txn.status === 'Completed' ? 'Paid' : txn.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
