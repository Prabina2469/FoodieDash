import React, { useState } from 'react';
import { MOCK_REVIEWS, Review } from '../data/mockData';
import { Badge } from '../components/common/Badge';

export const ReviewsView: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [replyText, setReplyText] = useState<{ [id: string]: string }>({});

  const handleSendReply = (reviewId: string) => {
    const text = replyText[reviewId];
    if (!text) return;

    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          return {
            ...r,
            replyStatus: 'Replied',
            adminReply: text,
          };
        }
        return r;
      })
    );

    setReplyText((prev) => ({ ...prev, [reviewId]: '' }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-container">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-background">
            Customer Reviews & Sentiment Moderation
          </h1>
          <p className="font-body text-xs md:text-sm text-on-surface-variant mt-1">
            Monitor restaurant feedback, respond directly to customer inquiries, and resolve quality disputes.
          </p>
        </div>
      </div>

      {/* Review Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl ghost-border">
          <span className="font-label text-xs uppercase text-on-surface-variant">Overall Platform Rating</span>
          <p className="font-headline text-3xl font-bold text-tertiary mt-1">★ 4.86</p>
          <span className="font-label text-xs text-secondary font-semibold">94% positive sentiment</span>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl ghost-border">
          <span className="font-label text-xs uppercase text-on-surface-variant">5-Star Ratings</span>
          <p className="font-headline text-3xl font-bold text-on-surface mt-1">78%</p>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl ghost-border">
          <span className="font-label text-xs uppercase text-on-surface-variant">Unanswered Disputes</span>
          <p className="font-headline text-3xl font-bold text-error mt-1">
            {reviews.filter((r) => r.replyStatus === 'Unanswered').length}
          </p>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl ghost-border">
          <span className="font-label text-xs uppercase text-on-surface-variant">Avg Reply Time</span>
          <p className="font-headline text-3xl font-bold text-on-surface mt-1">18 min</p>
        </div>
      </div>

      {/* Reviews Stream */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-2xl bg-surface-container-lowest ghost-border shadow-level-1 space-y-4"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={rev.customerAvatar}
                  alt={rev.customerName}
                  className="w-10 h-10 rounded-full object-cover ghost-border"
                />
                <div>
                  <h4 className="font-headline font-bold text-sm text-on-surface">{rev.customerName}</h4>
                  <p className="font-body text-xs text-on-surface-variant">
                    reviewed <span className="font-bold text-on-surface">{rev.restaurantName}</span> • {rev.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5 text-tertiary">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: i < rev.rating ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <Badge
                  status={rev.sentiment === 'Positive' ? 'Active' : rev.sentiment === 'Negative' ? 'Cancelled' : 'Pending'}
                  size="sm"
                />
              </div>
            </div>

            {/* Dish Mention Tag */}
            {rev.dishName && (
              <span className="inline-flex items-center gap-1 text-[11px] font-label font-bold text-primary bg-primary-fixed/40 px-2.5 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-[14px]">restaurant</span>
                {rev.dishName}
              </span>
            )}

            <p className="font-body text-sm text-on-surface leading-relaxed">{rev.comment}</p>

            {/* Existing Admin Reply */}
            {rev.adminReply && (
              <div className="p-3.5 rounded-xl bg-surface-container-low border-l-4 border-primary space-y-1">
                <span className="font-label text-xs font-bold text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">reply</span>
                  Official Support Response
                </span>
                <p className="font-body text-xs text-on-surface-variant">{rev.adminReply}</p>
              </div>
            )}

            {/* Reply Input Box if unanswered */}
            {rev.replyStatus === 'Unanswered' && (
              <div className="pt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Write an official response to this customer..."
                  value={replyText[rev.id] || ''}
                  onChange={(e) =>
                    setReplyText({ ...replyText, [rev.id]: e.target.value })
                  }
                  className="flex-1 px-4 py-2 bg-surface-container-low border border-surface-container rounded-xl text-xs font-body focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={() => handleSendReply(rev.id)}
                  className="px-4 py-2 rounded-xl bg-primary text-white font-label text-xs font-bold hover:bg-primary-container transition-colors"
                >
                  Send Reply
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
