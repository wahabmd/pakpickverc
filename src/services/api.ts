const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  search: async (query: string) => {
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Search failed');
    return response.json();
  },

  getRecommendations: async (budget: string, category: string, risk: string) => {
    const response = await fetch(
      `${API_BASE_URL}/recommendations?budget=${budget}&category=${category}&risk=${risk}`
    );
    if (!response.ok) throw new Error('Failed to get recommendations');
    return response.json();
  },

  getDetails: async (productId: string | number) => {
    const response = await fetch(`${API_BASE_URL}/details/${productId}`);
    if (!response.ok) throw new Error('Failed to get product details');
    return response.json();
  },

  getTrends: async (type = 'daily') => {
    const response = await fetch(`${API_BASE_URL}/trends?type=${type}`);
    if (!response.ok) throw new Error('Failed to get trends');
    return response.json();
  },

  refreshTrends: async () => {
    const response = await fetch(`${API_BASE_URL}/trends/refresh`, { method: 'POST' });
    if (!response.ok) throw new Error('Failed to start refresh');
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/market-stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  getKeywords: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/keywords`);
    if (!response.ok) throw new Error('Failed to fetch keywords');
    return response.json();
  }
};
