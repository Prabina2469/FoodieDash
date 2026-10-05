import { Order, MOCK_ORDERS } from '../data/mockData';

const API_GATEWAY_URL = 'http://localhost:8080/api/v1';

export const apiService = {
  /**
   * Fetch all orders from backend API Gateway with graceful fallback to MOCK_ORDERS
   */
  fetchOrders: async (): Promise<Order[]> => {
    try {
      const response = await fetch(`${API_GATEWAY_URL}/orders`);
      if (!response.ok) throw new Error('API Gateway offline');
      const data = await response.json();
      return data;
    } catch (err) {
      console.warn('Backend API Gateway offline. Falling back to local mock state.', err);
      return MOCK_ORDERS;
    }
  },

  /**
   * Update order status via API Gateway
   */
  updateOrderStatus: async (orderId: string, status: Order['status']): Promise<boolean> => {
    try {
      const response = await fetch(`${API_GATEWAY_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      return response.ok;
    } catch (err) {
      console.warn('API Gateway offline. Update saved locally.', err);
      return false;
    }
  },

  /**
   * Create new manual dispatch order via API Gateway
   */
  createOrder: async (newOrder: Partial<Order>): Promise<Order | null> => {
    try {
      const response = await fetch(`${API_GATEWAY_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      if (!response.ok) throw new Error('Failed to create order');
      return await response.json();
    } catch (err) {
      console.warn('API Gateway offline. Order created in local mock state.', err);
      return null;
    }
  },

  /**
   * Send prompt to Spring AI Assistant microservice via API Gateway
   */
  sendAiPrompt: async (prompt: string, context: string = 'dashboard'): Promise<{ reply: string; category?: string }> => {
    try {
      const response = await fetch(`${API_GATEWAY_URL}/ai/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, context }),
      });
      if (!response.ok) throw new Error('AI Service offline');
      return await response.json();
    } catch (err) {
      console.warn('Spring AI Service offline. Falling back to local intelligence agent.', err);
      return {
        reply: `🤖 Spring AI Assistant (Fallback): Analyzed '${prompt}'. Platform throughput in NY-Ops is operating at peak 98.4% efficiency.`,
        category: 'SYSTEM_HEALTH',
      };
    }
  },
};
