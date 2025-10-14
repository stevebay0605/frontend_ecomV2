import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.username, formData.password);
      toast.success('Connexion réussie !');
      navigate('/');
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Connexion</h1>
          <p className="text-gray-600 dark:text-gray-400">Connectez-vous pour accéder à votre compte</p>
        </div>
        
        <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-8 border dark:border-gray-900">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                name="username"
                placeholder="Votre nom d'utilisateur"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                placeholder="Votre mot de passe"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
            
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-red-500 hover:text-red-600 font-semibold">
                S'inscrire
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;