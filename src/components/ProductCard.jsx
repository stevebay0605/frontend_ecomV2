import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Package, Heart } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import { formatPrice } from '../utils/formatPrice';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.success(`${product.name} ajouté au panier !`);
  };


  // Calculer le pourcentage de réduction si old_price existe
  const discountPercent = product.old_price 
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  return (
    <div className="animate-fade-in-up">
      <div
        className="bg-white dark:bg-gray-950 rounded-lg shadow-md overflow-hidden hover-lift group border border-transparent dark:border-gray-900"
      >
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className="absolute top-3 right-3 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:shadow-lg transition-smooth btn-press"
          aria-label="Ajouter aux favoris"
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              isInWishlist(product.id)
                ? 'fill-red-500 text-red-500'
                : 'text-gray-400 group-hover:text-red-500'
            }`}
          />
        </button>

        <Link to={`/product/${product.slug}`} className="block">
          {/* Image Container */}
          <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800 image-zoom" style={{height: '250px'}}>
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              loading="lazy"
              onError={handleImageError}
              className="w-full h-full object-contain"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.featured && (
                <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md inline-flex items-center gap-1 badge-pulse">
                  <Star className="w-3 h-3" />
                  Populaire
                </span>
              )}
              {discountPercent > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  -{discountPercent}%
                </span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2 min-h-[48px] group-hover:text-red-500 transition-colors">
              {product.name}
            </h3>

            {/* Price */}
            <div className="mb-3">
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

            {/* Stock Indicator */}
            {product.stock !== undefined && (
              <div className="mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-500" />
                {product.stock === 0 ? (
                  <span className="text-xs font-semibold text-red-600">Rupture de stock</span>
                ) : product.stock <= 5 ? (
                  <span className="text-xs font-semibold text-orange-600">
                    Seulement {product.stock} en stock
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-green-600">En stock</span>
                )}
              </div>
            )}
          </div>
        </Link>

        {/* Add to Cart Button */}
        <div className="px-4 pb-4">
          {product.stock > 0 ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-smooth btn-press disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4" />
              Ajouter au panier
            </button>
          ) : (
            <button disabled className="w-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium py-2.5 px-4 rounded-lg cursor-not-allowed">
              Indisponible
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
