import React from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

export const CustomerNotificationsView: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-32">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <nav className="flex items-center gap-2 text-xs font-label text-outline">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-on-surface font-bold">Notifications</span>
          </nav>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-on-surface flex items-center gap-2.5">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-label text-xs font-bold">
                {unreadCount} Unread
              </span>
            )}
          </h1>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-2xl bg-surface-container-low hover:bg-surface-container text-primary font-label text-xs font-bold transition-all w-fit"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 bg-surface-container-low rounded-3xl" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-16 rounded-3xl bg-surface-container-lowest ghost-border text-center space-y-4 max-w-md mx-auto">
          <span className="material-symbols-outlined text-outline text-[48px]">notifications_off</span>
          <h3 className="font-headline font-bold text-lg text-on-surface">No notifications yet</h3>
          <p className="font-body text-xs text-on-surface-variant">
            Live delivery tracking updates and promo alerts will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-5 rounded-3xl ghost-border shadow-sm flex items-start gap-4 transition-all cursor-pointer ${
                !n.isRead
                  ? 'bg-primary-fixed/20 border-primary/30'
                  : 'bg-surface-container-lowest hover:bg-surface-container-low'
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[22px]">
                  {n.type === 'ORDER_CONFIRMED'
                    ? 'check_circle'
                    : n.type === 'OUT_FOR_DELIVERY'
                    ? 'delivery_dining'
                    : n.type === 'PROMOTION'
                    ? 'local_offer'
                    : 'notifications'}
                </span>
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-headline font-bold text-sm text-on-surface">
                    {n.title}
                  </h4>
                  <span className="font-label text-[11px] text-outline">
                    {n.createdAt}
                  </span>
                </div>
                <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                  {n.message}
                </p>
              </div>

              {!n.isRead && (
                <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 self-center" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
