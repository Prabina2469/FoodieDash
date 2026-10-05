import React, { useState } from 'react';
import { MOCK_NOTIFICATIONS, NotificationItem } from '../data/mockData';

export const NotificationsView: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<string>('All');

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const filtered = notifications.filter(
    (n) => filter === 'All' || n.type === filter.toLowerCase()
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-container">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-background">
            System Alerts & Operational Logs
          </h1>
          <p className="font-body text-xs md:text-sm text-on-surface-variant mt-1">
            Real-time feed of urgent kitchen bottlenecks, fleet demand surges, and gateway notifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={markAllRead}
            className="px-4 py-2 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container font-label text-xs font-semibold transition-colors border border-surface-container"
          >
            Mark All as Read
          </button>
          <button
            onClick={() => alert('Broadcast operational announcement popup.')}
            className="px-4 py-2 rounded-xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container transition-all shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">campaign</span>
            Broadcast Alert
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Alert', 'Order', 'Revenue', 'Rider'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full font-label text-xs font-semibold transition-all ${
              filter === tab
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-surface-container-lowest rounded-2xl ghost-border shadow-level-1 divide-y divide-surface-container/60 overflow-hidden">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-5 flex items-start gap-4 hover:bg-surface-container-low/40 transition-colors ${
              item.unread ? 'bg-primary-fixed/15' : ''
            }`}
          >
            <div className={`p-3 rounded-xl shrink-0 ${
              item.type === 'alert' ? 'bg-error-container text-error' :
              item.type === 'order' ? 'bg-primary-fixed text-primary' :
              item.type === 'revenue' ? 'bg-secondary-fixed text-secondary' :
              'bg-surface-container text-on-surface-variant'
            }`}>
              <span className="material-symbols-outlined text-[24px]">
                {item.type === 'alert' ? 'warning' : item.type === 'order' ? 'receipt' : item.type === 'revenue' ? 'trending_up' : 'info'}
              </span>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <h4 className="font-headline font-bold text-sm text-on-surface flex items-center gap-2">
                  {item.title}
                  {item.unread && (
                    <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                  )}
                </h4>
                <span className="font-label text-xs text-outline">{item.timestamp}</span>
              </div>
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                {item.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
