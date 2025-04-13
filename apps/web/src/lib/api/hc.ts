import apiClient from './client';

const API_URL =
  process.env.NODE_ENV === 'production' ? 'https://api.qafiyah.com' : 'http://localhost:8787';

const client = apiClient(API_URL);

// Add baseUrl property for sitemap function
const clientWithBaseUrl = {
  ...client,
  baseUrl: API_URL,
};

export default clientWithBaseUrl;
