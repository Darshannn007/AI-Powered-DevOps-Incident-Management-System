import api from './api';

// Gemini AI se incident ka root cause analyze karwao
export const analyzeWithGemini = async (incidentId) => {
  const response = await api.post(`/api/v1/incidents/${incidentId}/ai-analyze`);
  return response.data;
};

// Latest AI analysis result fetch karo
export const getLatestAiAnalysis = async (incidentId) => {
  const response = await api.get(`/api/v1/incidents/${incidentId}/ai-analysis`);
  return response.data;
};
