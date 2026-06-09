import axios from 'axios';
import { userPool } from './cognitoConfig';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    return new Promise((resolve) => {
      const currentUser = userPool.getCurrentUser();
      
      if (currentUser) {
        currentUser.getSession((err, session) => {
          if (err || !session.isValid()) {
            console.warn('No active auth session for API request');
            resolve(config);
          } else {
            const token = session.getIdToken().getJwtToken();
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
            resolve(config);
          }
        });
      } else {
        console.warn('No active auth session for API request');
        resolve(config);
      }
    });
  },
  (error) => Promise.reject(error)
);

export default api;
