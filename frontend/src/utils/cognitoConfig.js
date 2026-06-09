import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'us-east-1_XXXXX',
  ClientId: import.meta.env.VITE_COGNITO_APP_CLIENT_ID || 'xxxxxxxxxxxx'
};

export const userPool = new CognitoUserPool(poolData);
