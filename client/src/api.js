import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

//adding all request automatically the token in the header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        //Barer prefix adding is best (validate in backend like this)
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
    });
    
    //error handling for response
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                console.warn("Unauthorized! Check token.");
                //localStorage.removeItem('token');
               // localStorage.removeItem('role');
               // window.location.href = '/login';
            }
            return Promise.reject(error);
        }

    );


export default api;