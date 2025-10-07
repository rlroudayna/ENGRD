// Utility functions for URL handling

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const SERVER_BASE_URL = API_BASE_URL.replace('/api', '');

export const getFullMediaUrl = (url) => {
  if (!url) return url;
  
  // If it's already a full URL (including Cloudinary URLs), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's an uploaded file path (legacy local uploads), prepend server URL
  if (url.startsWith('/uploads/')) {
    return `${SERVER_BASE_URL}${url}`;
  }
  
  // For relative paths like /assets/, return as is (served by React)
  return url;
};

export const isUploadedFile = (url) => {
  return url && url.startsWith('/uploads/');
};

export const isCloudinaryUrl = (url) => {
  return url && url.includes('cloudinary.com');
};

export const isHostedVideo = (url) => {
  return isCloudinaryUrl(url) || isUploadedFile(url);
};