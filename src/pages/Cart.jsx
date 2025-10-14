import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { CheckCircle, Lock, RotateCcw } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';
import { getImageUrl, handleImageError } from '../utils/imageUtils';


function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getTotal } = useContext(CartContext);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-8">
            <svg className="w-32 h-32 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3"/>
            </svg>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Votre panier est vide</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Ajoutez des produits à votre panier pour commencer vos achats.</p>
          </div>
          <div className="space-y-3">
            <Link to="/products" className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Découvrir nos produits
            </Link>
            <Link to="/" className="block border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg transition-colors">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mon Panier</h1>
          <p className="text-gray-600 dark:text-gray-400">{cart.length} article{cart.length > 1 ? 's' : ''} dans votre panier</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md overflow-hidden border dark:border-gray-900">
              <div className="p-4 border-b border-gray-200 dark:border-gray-900 bg-gray-50 dark:bg-black">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Articles</h2>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {cart.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-smooth animate-fade-in-up">
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          loading="lazy"
                          onError={handleImageError}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 truncate">{item.name}</h3>
                        <p className="text-gray-900 dark:text-white font-bold">{formatPrice(item.price)}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                          <button
                            className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-smooth btn-press disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/>
                            </svg>
                          </button>
                          <div className="px-4 py-1 min-w-[40px] text-center font-semibold text-gray-700 dark:text-gray-300">{item.quantity}</div>
                          <button
                            className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                            </svg>
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right min-w-[80px]">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{formatPrice(item.price * item.quantity)}</p>
                        </div>

                        {/* Remove Button */}
                        <button
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                          onClick={() => removeFromCart(item.id)}
                          title="Retirer du panier"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Shopping */}
            <div>
              <Link to="/products" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                Continuer mes achats
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6 sticky top-4 border dark:border-gray-900">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Récapitulatif</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Sous-total</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(getTotal())}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Livraison</span>
                  <span className="text-gray-500 dark:text-gray-400">Gratuite</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(getTotal())}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-smooth btn-press hover-glow flex items-center justify-center gap-2"
                >
                  <Lock className="w-5 h-5" />
                  Procéder au paiement
                </button>

                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2">
                  <p className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Livraison gratuite
                  </p>
                  <p className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-500" />
                    Paiement 100% sécurisé
                  </p>
                  <p className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-orange-500" />
                    Retours sous 30 jours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
