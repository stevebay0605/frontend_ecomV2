import React, { createContext, useState, useEffect } from 'react';
import { login as loginAPI, register as registerAPI, getUserProfile } from '../services/api.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await getUserProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Erreur chargement utilisateur:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const response = await loginAPI(username, password);
    const { access, refresh } = response.data;
    
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    
    await loadUser();
    return response;
  };

  const register = async (userData) => {
    const response = await registerAPI(userData);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const isAuthenticated = !!user;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};