import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext.jsx';
import { createOrder } from '../services/api.js';
import { toast } from 'react-toastify';
import { formatPrice } from '../utils/formatPrice';

function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart, getTotal } = useContext(CartContext);

  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    postal_code: '',
    city: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setError('Votre panier est vide');
      return;
    }

    setLoading(true);
    setError(null);

    const orderData = {
      ...formData,
      items: cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }))
    };

    try {
      const response = await createOrder(orderData);
      console.log('Commande créée:', response.data);
      clearCart();
      navigate(`/order-confirmation/${response.data.order_number}`);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.response?.data?.error || 'Une erreur est survenue');
      toast.error('Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Votre panier est vide</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Ajoutez des produits à votre panier pour procéder au paiement.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors" onClick={() => navigate('/products')}>
            Continuer vos achats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Finaliser la commande</h1>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l-2-2m2 2l2 2m-2-2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white dark:bg-gray-950 rounded-lg shadow-md p-6 border dark:border-gray-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Informations de livraison</h2>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
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
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Adresse *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Ville *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Traitement en cours...
                  </>
                ) : (
                  'Valider la commande'
                )}
              </button>
          </form>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6 sticky top-4 border dark:border-gray-900">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Récapitulatif</h2>

              <div className="space-y-3 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{item.name} x{item.quantity}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Sous-total</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(getTotal())}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="text-gray-600 dark:text-gray-400">Livraison</span>
                  <span className="text-green-600 dark:text-green-400 font-semibold">Gratuite</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(getTotal())}</span>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Paiement sécurisé et protection de vos données</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
