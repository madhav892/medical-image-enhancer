// Configuration for API endpoint
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://127.0.0.1:5000' 
    : 'https://medical-image-enhancer-production.up.railway.app'; // Update this after Railway deployment

export default API_BASE_URL;
