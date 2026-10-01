// This file automatically provides the correct Adobe API key.

// For local development, you can use one key.
const LOCAL_API_KEY = "6b69525ba155485c869f6fc1a870d5cd";

// For production, you would get a new key for your deployed domain.
// You can get a new key from: https://developer.adobe.com/document-services/apis/pdf-embed/
const DEPLOYED_API_KEY = "4ea4a571051642e7b2be835baa29d5ac"; // Replace with your production key

const isDevelopment = window.location.hostname === 'localhost';

export const ADOBE_API_KEY = isDevelopment ? LOCAL_API_KEY : DEPLOYED_API_KEY;
