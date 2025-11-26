import api from './api';

export const authService = {
  async register(data) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const accountService = {
  async getAccount() {
    const response = await api.get('/accounts');
    return response.data;
  },

  async getSummary() {
    const response = await api.get('/accounts/summary');
    return response.data;
  },

  async transferToSavings(amount) {
    const response = await api.put('/accounts/transfer-to-savings', { amount });
    return response.data;
  },

  async withdrawFromSavings(amount) {
    const response = await api.put('/accounts/withdraw-from-savings', { amount });
    return response.data;
  },
};

export const transactionService = {
  async create(data) {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  async getAll(params = {}) {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  async getStats(params = {}) {
    const response = await api.get('/transactions/stats/summary', { params });
    return response.data;
  },
};

export const goalService = {
  async create(data) {
    const response = await api.post('/goals', data);
    return response.data;
  },

  async getAll(params = {}) {
    const response = await api.get('/goals', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/goals/${id}`);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/goals/${id}`, data);
    return response.data;
  },

  async addAmount(id, amount) {
    const response = await api.put(`/goals/${id}/add-amount`, { amount });
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  },

  async getStats() {
    const response = await api.get('/goals/stats/summary');
    return response.data;
  },
};

export const categoryService = {
  async getAll() {
    const response = await api.get('/categories');
    return response.data;
  },

  async create(data) {
    const response = await api.post('/categories', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export const historyService = {
  async closeMonth(data) {
    const response = await api.post('/history/close-month', data);
    return response.data;
  },

  async getAll() {
    const response = await api.get('/history');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/history/${id}`);
    return response.data;
  },

  async getByYear(year) {
    const response = await api.get(`/history/year/${year}`);
    return response.data;
  },

  async getAllStats() {
    const response = await api.get('/history/stats/all');
    return response.data;
  },
};
