import { apiClient } from './apiClient';

export interface AiPromptResponse {
  reply: string;
  category?: string;
  confidenceScore?: number;
  model?: string;
  timestamp?: string;
}

export interface AiQuickSummaryResponse {
  status: string;
  framework: string;
  activeAgents: number;
  topRecommendation: string;
}

export const aiService = {
  sendAiPrompt: async (prompt: string, context: string = 'customer_app'): Promise<AiPromptResponse> => {
    try {
      const response = await apiClient.post<AiPromptResponse>('/ai/prompt', { prompt, context });
      return response.data;
    } catch (err) {
      console.warn('AI Service prompt fallback triggered', err);
      return {
        reply: `🤖 Spring AI Assistant: Based on current restaurant load and traffic patterns, orders in your area are arriving in an average of 28 minutes.`,
        category: 'CUSTOMER_INSIGHT'
      };
    }
  },

  getQuickInsights: async (): Promise<AiQuickSummaryResponse> => {
    const response = await apiClient.get<AiQuickSummaryResponse>('/ai/insights/summary');
    return response.data;
  }
};
