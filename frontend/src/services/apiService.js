import api from '../utils/api';
import axios from 'axios';

const apiService = {
  manageUsers: async (data) => {
    // data should contain { action: 'list' } or { action: 'create', ... }
    const response = await api.post('/manage-users', data);
    return response.data;
  },

  getEmployees: async () => {
    const response = await api.get('/employees');
    return response.data;
  },

  getUploadUrl: async () => {
    const response = await api.get('/upload-url-photo');
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
    const response = await api.post('/checkin', data);
    return response.data;
  },

  getAttendance: async () => {
    const response = await api.get('/attendance');
    return response.data;
  },

  getPhotoUrl: async (userId, timestamp, photoKey) => {
    const response = await api.get('/attendance/photo', {
      params: { userId, timestamp, photoKey },
    });
    return response.data;
  },
};

export default apiService;
