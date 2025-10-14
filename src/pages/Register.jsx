import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';

function Register() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      toast.success('Compte créé avec succès ! Vous pouvez maintenant vous connecter');
      navigate('/login');
    } catch (error) {
      console.error('Erreur:', error);
      const errors = error.response?.data;
      if (errors) {
        Object.keys(errors).forEach(key => {
          toast.error(`${key}: ${errors[key]}`);
        });
      } else {
        toast.error('Erreur lors de l\'inscription');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Inscription</h1>
          <p className="text-gray-600 dark:text-gray-400">Créez votre compte pour commencer vos achats</p>
        </div>
        
        <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-8 border dark:border-gray-900 animate-fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Prénom *
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
                  Nom *
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nom d'utilisateur *
              </label>
              <input
                type="text"
                name="username"
                placeholder="Votre nom d'utilisateur"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                placeholder="votre@email.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mot de passe *
              </label>
              <input
                type="password"
                name="password"
                placeholder="Votre mot de passe"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmer le mot de passe *
              </label>
              <input
                type="password"
                name="password2"
                placeholder="Confirmez votre mot de passe"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                value={formData.password2}
                onChange={handleChange}
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-smooth btn-press hover-glow disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Inscription...
                </>
              ) : (
                'S\'inscrire'
              )}
            </button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-red-500 hover:text-red-600 font-semibold">
                Se connecter
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;