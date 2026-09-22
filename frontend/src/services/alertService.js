import api from './api';

// Saare monitoring alerts fetch karo
export const getAllAlerts = async () => {
  const response = await api.get('/api/v1/alerts');
  return response.data;
};

// Sirf active (FIRING) alerts fetch karo
export const getActiveAlerts = async () => {
  const response = await api.get('/api/v1/alerts/active');
  return response.data;
};
