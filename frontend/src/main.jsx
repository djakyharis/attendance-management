import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './hooks/useAuth'

// Konfigurasi AWS Amplify Authentication
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'placeholder',
      userPoolClientId: import.meta.env.VITE_COGNITO_APP_CLIENT_ID || 'placeholder',
      region: import.meta.env.VITE_COGNITO_REGION || 'ap-southeast-1',
    }
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
