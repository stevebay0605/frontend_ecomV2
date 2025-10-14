import React, { createContext, useState, useEffect } from 'react';
import { getSiteSettings } from '../services/api';

export const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await getSiteSettings();
        setSettings(response.data);
      } catch (error) {
        console.error('Erreur chargement paramètres:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200 ">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <SiteContext.Provider value={{ settings }}>
      {children}
    </SiteContext.Provider>
  );
};