// Centralized API configuration
// To override locally, create a .env file in /frontend with:
// VITE_API_BASE_URL=http://localhost:3001
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://form-vagas-backend.vercel.app/';

export const apiUrl = (path) => `${API_BASE_URL}${path}`;
