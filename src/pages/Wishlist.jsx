import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import { toast } from 'react-toastify';

function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} ajouté au panier !`);
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center py-12">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <Heart className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Votre liste de favoris est vide
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Ajoutez des produits à vos favoris pour les retrouver facilement plus tard.
          </p>
          <Link
            to="/products"
            className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Découvrir nos produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Mes Favoris
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {wishlist.length} produit{wishlist.length !== 1 ? 's' : ''} dans vos favoris
            </p>
          </div>
          
          {wishlist.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Êtes-vous sûr de vouloir vider vos favoris ?')) {
                  clearWishlist();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border border-red-600 dark:border-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Vider les favoris
            </button>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-950 rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden group border dark:border-gray-900"
            >
              <Link to={`/product/${product.slug}`} className="block relative">
                <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700" style={{height: '250px'}}>
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    loading="lazy"
                    onError={handleImageError}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Remove from Wishlist */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  </button>

                  {/* Badges */}
                  {product.old_price && (
                    <div className="absolute top-3 left-3">
                      <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
                      </div>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <Link to={`/product/${product.slug}`}>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-red-500 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <div className="mb-4">
                  {product.old_price ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(product.old_price)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                {product.stock !== undefined && (
                  <div className="mb-3">
                    {product.stock === 0 ? (
                      <span className="text-xs font-semibold text-red-600">
                        Rupture de stock
                      </span>
                    ) : product.stock <= 5 ? (
                      <span className="text-xs font-semibold text-orange-600">
                        Seulement {product.stock} en stock
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-green-600">
                        En stock
                      </span>
                    )}
                  </div>
                )}

                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {product.stock === 0 ? 'Indisponible' : 'Ajouter au panier'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
