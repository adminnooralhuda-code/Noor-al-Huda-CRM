import axios from 'axios';

// എൻവയോൺമെന്റ് വേരിയബിളിൽ നിന്ന് URL എടുക്കുന്നു. 
// ഇല്ലെങ്കിൽ ഡിഫോൾട്ട് ആയി നിങ്ങളുടെ ബാക്ക്-എൻഡ് ലൈവ് ലിങ്ക് നൽകുക.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://noor-al-huda-crm-backend.onrender.com/api'
});

// Request interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
    
// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("Unauthorized! Check token.");
            // ആവശ്യമെങ്കിൽ താഴെ ഉള്ളവ അൺ-കമന്റ് ചെയ്യാം
            // localStorage.clear();
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;