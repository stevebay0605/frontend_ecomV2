import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { updateUserProfile } from '../services/api.js';
import { toast } from 'react-toastify';
import { User, Mail, Edit3, Save, ShoppingBag, Heart, Package, Calendar, Shield, MapPin } from 'lucide-react';

function Profile() {
  const { user, loadUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUserProfile(formData);
      await loadUser();
      toast.success('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in-down">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Mon Profil</h1>
            <p className="text-gray-600 dark:text-gray-400">Gérez vos informations et consultez votre activité</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Orders */}
            <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6 border dark:border-gray-900 hover-lift animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Commandes</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
            </div>

            {/* Wishlist */}
            <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6 border dark:border-gray-900 hover-lift animate-fade-in-up animate-delay-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Favoris</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
            </div>

            {/* Products Purchased */}
            <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6 border dark:border-gray-900 hover-lift animate-fade-in-up animate-delay-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Produits achetés</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
            </div>

            {/* Member Since */}
            <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6 border dark:border-gray-900 hover-lift animate-fade-in-up animate-delay-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Membre depuis</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">2024</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Summary Card */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6 text-center border dark:border-gray-900 animate-fade-in-left">
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-950"></div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {user?.first_name} {user?.last_name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">@{user?.username}</p>
                
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-semibold px-3 py-1 rounded-full">Compte Vérifié</span>
                </div>

                {/* User Info */}
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>France</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Inscrit en 2024</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Form Card */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6 border dark:border-gray-900 animate-fade-in-right">
                <div className="flex items-center mb-6">
                  <Edit3 className="w-5 h-5 text-red-500 mr-2" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Informations personnelles</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Prénom
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        placeholder="Votre prénom"
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        placeholder="Votre nom"
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="votre.email@exemple.com"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-smooth bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Nom d'utilisateur
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 cursor-not-allowed text-gray-500 dark:text-gray-400"
                      value={user?.username}
                      disabled
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Le nom d'utilisateur ne peut pas être modifié</p>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-lg transition-smooth btn-press hover-glow disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Mise à jour...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Mettre à jour
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;