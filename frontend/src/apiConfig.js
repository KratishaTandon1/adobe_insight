// This file automatically determines the correct backend URL.

// Check if the frontend is running on localhost
const isDevelopment = window.location.hostname === 'localhost';

// Export the correct base URL for the API
export const API_BASE_URL = isDevelopment
  ? 'http://localhost:8080' // The URL for your local backend
  : 'https://avtech03-pdf-insight-backend.hf.space'; // Your live, deployed backend URL