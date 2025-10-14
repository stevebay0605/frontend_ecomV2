import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});
// pour ajouter le token a chaque requete 

api.interceptors.request.use(
  (config) =>{
    const token = localStorage.getItem('accessToken');
    if (token){
      config.headers.Authorization=`Bearer ${token}`
    }
    return config;
  },
  (error)=>{
    return Promise.reject(error)
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('accessToken', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
)

export const login = (username, password) => 
api.post('/auth/login/', { username, password });

export const register = (userData) => 
api.post('/auth/register/', userData);

export const getUserProfile = () => 
api.get('/auth/profile/');

export const updateUserProfile = (userData) => 
api.put('/auth/profile/update/', userData);

export const getUserOrders = () => 
api.get('/auth/orders/');


// ===== PRODUITS =====
export const getProducts = (params = {}) => api.get('/products/', { params });
export const getProduct = (slug) => api.get(`/products/${slug}/`);
export const getFeaturedProducts = () => api.get('/products/', { params: { featured: true } });

// ===== CATÉGORIES =====
export const getCategories = () => api.get('/categories/');

// ===== COMMANDES =====
export const createOrder = (orderData) => api.post('/orders/create/', orderData);

// ===== CMS =====
export const getSiteSettings = () => api.get('/settings/');
export const getHomepageContent = () => api.get('/homepage/');
export const getPage = (slug) => api.get(`/pages/${slug}/`);

export default api;