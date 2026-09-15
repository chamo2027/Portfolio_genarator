import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const portfolioAPI = {
  // Create a new portfolio
  createPortfolio: async (data) => {
    const res = await api.post('/portfolio', data);
    return res.data;
  },

  // Get portfolio by username
  getPortfolioByUsername: async (username, incrementView = true) => {
    const res = await api.get(`/portfolio/${username}?incrementView=${incrementView}`);
    return res.data;
  },

  // Update existing portfolio
  updatePortfolio: async (username, data) => {
    const res = await api.put(`/portfolio/${username}`, data);
    return res.data;
  },

  // Delete a portfolio
  deletePortfolio: async (username) => {
    const res = await api.delete(`/portfolio/${username}`);
    return res.data;
  },

  // Get all portfolios (with search & filters)
  getAllPortfolios: async (params = {}) => {
    const res = await api.get('/portfolio', { params });
    return res.data;
  },

  // Check username availability
  checkUsername: async (username) => {
    const res = await api.get(`/portfolio/check/${username}`);
    return res.data;
  },

  // Upload file (avatar / resume)
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/portfolio/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};

export default api;
