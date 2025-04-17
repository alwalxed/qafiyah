import { API_URL } from '@/constants/GLOBALS';
import apiClient from './client';

const client = apiClient(API_URL);

const clientWithBaseUrl = {
  ...client,
  baseUrl: API_URL,
};

export default clientWithBaseUrl;
