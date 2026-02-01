/**
 * Environment configuration for development
 * Contains API settings and feature flags
 */
export const environment = {
  production: false,

  // API Configuration
  apiUrl: 'http://localhost:8081/api',
  apiVersion: 'v1',

  // Timeouts (in milliseconds)
  httpTimeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,

  // Feature flags
  enableLogging: true,
  enableMockData: true,  // TRUE para usar datos mock (sin necesidad de backend)

  // Authentication
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  tokenExpiry: 3600, // 1 hour in seconds

  // Pagination defaults
  defaultPageSize: 10,
  maxPageSize: 100
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

