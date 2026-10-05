import React, { useState } from 'react';
import { apiService } from '../../services/apiService';

export const AiOperationsWidget: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(
    '🤖 Spring AI Active: Ask me about dispatch bottlenecks, ETA predictions, or menu recommendations.'
  );
  const [loading, setLoading] = useState(false);

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    const result = await apiService.sendAiPrompt(prompt, 'dashboard_widget');
    setResponse(result.reply);
    setLoading(false);
    setPrompt('');
  };

  return (
    <div className="bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest to-primary-fixed/30 p-6 rounded-xl ghost-border shadow-level-1 flex flex-col justify-between space-y-4 relative overflow-hidden">
      {/* Decorative AI Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-primary-bright flex items-center justify-center text-white shadow-glow-primary">
            <span className="material-symbols-outlined text-[18px]">smart_toy</span>
          </div>
          <div>
            <h3 className="font-headline text-base font-bold text-on-surface">Spring AI Operations Copilot</h3>
            <p className="font-body text-xs text-on-surface-variant">Real-time dispatch optimization & recommendations</p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-secondary font-label text-[10px] font-bold">
          Spring AI 1.0
        </span>
      </div>

      {/* Response Display Box */}
      <div className="bg-surface-container-low/80 p-3.5 rounded-xl text-xs font-body text-on-surface leading-relaxed z-10 ghost-border">
        {loading ? (
          <div className="flex items-center gap-2 text-primary font-label font-bold">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            Spring AI processing request...
          </div>
        ) : (
          <p>{response}</p>
        )}
      </div>

      {/* Prompt Form */}
      <form onSubmit={handleAskAi} className="flex gap-2 z-10">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Spring AI (e.g. Predict ETA delays, recommend pairings)..."
          className="flex-1 px-3.5 py-2 bg-surface-container-lowest border border-surface-container rounded-lg text-xs font-body focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary text-white rounded-lg font-label text-xs font-bold hover:bg-primary-container transition-all shadow-sm flex items-center gap-1 shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">send</span>
          Ask
        </button>
      </form>
    </div>
  );
};
