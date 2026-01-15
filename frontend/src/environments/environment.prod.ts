/**
 * Environment configuration for production
 * Contains API settings and feature flags
 */
export const environment = {
  production: true,

  // API Configuration
  apiUrl: 'https://api.tudominio.com/api',
  apiVersion: 'v1',

  // Timeouts (in milliseconds)
  httpTimeout: 30000,
  retryAttempts: 2,
  retryDelay: 1000,

  // Feature flags
  enableLogging: false,
  enableMockData: false,

  // Authentication
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  tokenExpiry: 3600,

  // Pagination defaults
  defaultPageSize: 10,
  maxPageSize: 100
};

