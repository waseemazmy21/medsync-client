import axiosInstance from './axios-instance';

// Get all appointments
export const getAppointments = async () => {
  const response = await axiosInstance.get('/appointment');
  return response.data;
};

// Get appointment by ID
export const getAppointmentById = async (id: string) => {
  const response = await axiosInstance.get(`/appointment/${id}`);
  return response.data;
};

// Create a new appointment
export const createAppointment = async (appointmentData: any) => {
  const response = await axiosInstance.post('/appointment', appointmentData);
  return response.data;
};

// Update an appointment
export const updateAppointment = async (id: string, appointmentData: any) => {
  const response = await axiosInstance.patch(`/appointment/${id}`, appointmentData);
  return response.data;
};

// Delete an appointment
export const deleteAppointment = async (id: string) => {
  const response = await axiosInstance.delete(`/appointment/${id}`);
  return response.data;
};
