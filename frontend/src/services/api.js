import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const electricCarsAPI = {
  // Get all electric cars
  getAll: async () => {
    try {
      const response = await api.get('/electric-cars');
      return response.data;
    } catch (error) {
      console.error('Error fetching electric cars:', error);
      throw error;
    }
  },

  // Get single electric car by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/electric-cars/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching electric car ${id}:`, error);
      throw error;
    }
  },

  // Delete electric car by ID
  delete: async (id) => {
    try {
      const response = await api.delete(`/electric-cars/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting electric car ${id}:`, error);
      throw error;
    }
  },

  // Search electric cars
  search: async (query) => {
    try {
      const response = await api.get(`/electric-cars/search/query?q=${query}`);
      return response.data;
    } catch (error) {
      console.error('Error searching electric cars:', error);
      throw error;
    }
  },

  // Filter electric cars with advanced criteria
  filter: async (filters) => {
    try {
      const response = await api.post('/electric-cars/filter', { filters });
      return response.data;
    } catch (error) {
      console.error('Error filtering electric cars:', error);
      throw error;
    }
  },

  // Export to CSV
  exportToCSV: () => {
    window.open(`${API_BASE_URL}/electric-cars/export/csv`, '_blank');
  },

  // Export to Excel
  exportToExcel: () => {
    window.open(`${API_BASE_URL}/electric-cars/export/excel`, '_blank');
  },
};

export default api;
