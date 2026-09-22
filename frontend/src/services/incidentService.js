import api from './api';

// 1. Saare incidents fetch karo
export const getAllIncidents = async () => {
  const response = await api.get('/api/v1/incidents');
  return response.data;
};

// 2. Ek specific incident fetch karo by ID
export const getIncidentById = async (id) => {
  const response = await api.get(`/api/v1/incidents/${id}`);
  return response.data;
};

// 3. Naya incident create karo
export const createIncident = async (incidentData) => {
  const response = await api.post('/api/v1/incidents', incidentData);
  return response.data;
};

// 4. Incident acknowledge karo (TRIGGERED -> ACKNOWLEDGED)
export const acknowledgeIncident = async (id) => {
  const response = await api.patch(`/api/v1/incidents/${id}/acknowledge`);
  return response.data;
};

// 5. Incident resolve karo (ACKNOWLEDGED -> RESOLVED)
export const resolveIncident = async (id, resolveData) => {
  const response = await api.patch(`/api/v1/incidents/${id}/resolve`, resolveData);
  return response.data;
};

// 6. Incident close karo (RESOLVED -> CLOSED)
export const closeIncident = async (id) => {
  const response = await api.patch(`/api/v1/incidents/${id}/close`);
  return response.data;
};
