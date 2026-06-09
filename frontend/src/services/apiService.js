import api from '../utils/api';
import axios from 'axios';

const apiService = {

  manageUsers: async (data) => {
    if (data.action === 'list') {
      const response = await api.get('/admin/list');
      return response.data;
    } else if (['create', 'update', 'delete'].includes(data.action)) {
      // Send the payload directly to the backend for processing
      const response = await api.post('/admin/users', data);
      return response.data;
    }
  },

  getEmployees: async (role = 'manager') => {
    const path = role === 'admin' ? '/admin/list' : '/manager/team';
    const response = await api.get(path);
    return response.data;
  },

  getUploadUrl: async () => {
    const response = await api.get('/employee/upload-url');
    return response.data;
  },

  uploadToS3: async (uploadUrl, fileBlob) => {
    // Perform a direct PUT to the pre-signed S3 URL without the Cognito token
    const response = await axios.put(uploadUrl, fileBlob, {
      headers: {
        'Content-Type': fileBlob.type,
      },
    });
    return response;
  },

  postPresence: async (data = {}) => {
    // Pass the entire data payload since backend still requires user data despite documentation
    const response = await api.post('/employee/checkin', data);
    return response.data;
  },

  getAttendance: async (role = 'employee', date) => {
    const params = date ? { date } : {};
    const response = await api.get(`/${role}/attendance`, { params });
    return response.data;
  },

  getPhotoUrl: async (role = 'employee', photoKey) => {
    if (!photoKey) return null;
    const response = await api.get(`/${role}/photo`, {
      params: { photoKey },
    });
    return response.data;
  },
};

export default apiService;
