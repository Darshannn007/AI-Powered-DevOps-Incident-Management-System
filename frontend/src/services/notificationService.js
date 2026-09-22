import api from './api';

// Slack webhook test alert trigger karo
export const testSlackAlert = async (userName = 'Darshan') => {
  const response = await api.post(`/api/v1/notifications/slack/test?user=${encodeURIComponent(userName)}`);
  return response.data;
};
