import React, { useState, useEffect } from 'react';
import { getUserOrders } from '../services/api.js';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await getUserOrders();
        setOrders(response.data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PAID: 'bg-green-100 text-green-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      PENDING: 'En attente',
      PAID: 'Payée',
      PROCESSING: 'En traitement',
      SHIPPED: 'Expédiée',
      DELIVERED: 'Livrée',
      CANCELLED: 'Annulée',
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-black">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Aucune commande</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Vous n'avez pas encore passé de commande.</p>
          <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            Découvrir nos produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Mes Commandes</h1>

        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white dark:bg-gray-950 rounded-lg shadow-md overflow-hidden border dark:border-gray-900">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Commande #{order.order_number}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(order.created).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4"></div>

                <div className="space-y-3 mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Articles</h3>
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{item.product_name} x{item.quantity}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatPrice(item.subtotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4"></div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Sous-total</span>
                    <span>{formatPrice(parseFloat(order.total_amount) - parseFloat(order.shipping_cost))}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Livraison</span>
                    <span>{formatPrice(order.shipping_cost)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-gray-900 dark:text-white">{formatPrice(order.total_amount)}</span>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors text-sm">
                    Voir les détails
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;