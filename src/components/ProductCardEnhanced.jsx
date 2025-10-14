import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
      addToCart(product, 1);
      toast.success(`${product.name} ajouté au panier !`);
    } catch {
      toast.error('Erreur lors de l\'ajout au panier');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  return (
    <div
      className="group card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-base-200 hover:border-primary/20 relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <figure className="px-4 pt-4 relative overflow-hidden">
        <Link to={`/product/${product.slug}`} className="block">
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              loading="lazy"
              onError={handleImageError}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex gap-2">
                <button
                  className="btn btn-circle btn-sm scale-0 group-hover:scale-100 transition-transform duration-300 delay-100"
                  onClick={(e) => {
                    e.preventDefault();
                    // Quick view functionality could be added here
                  }}
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  className={`btn btn-circle btn-sm scale-0 group-hover:scale-100 transition-transform duration-300 delay-200 ${
                    isWishlisted ? 'btn-error' : 'btn-neutral'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleWishlist();
                  }}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </Link>

        {/* Enhanced badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          {product.featured && (
            <div className="badge badge-warning text-white shadow-lg animate-pulse">
              <Star className="w-3 h-3 mr-1" />
              Phare
            </div>
          )}
          {product.discount && (
            <div className="badge badge-error text-white shadow-lg">
              -{product.discount}%
            </div>
          )}
        </div>

        <div className="absolute top-6 right-6 flex flex-col gap-2">
          {product.stock > 0 ? (
            <div className="badge badge-success text-white shadow-lg">
              En stock
            </div>
          ) : (
            <div className="badge badge-error text-white shadow-lg">
              Rupture
            </div>
          )}
          {product.is_new && (
            <div className="badge badge-info text-white shadow-lg">
              Nouveau
            </div>
          )}
        </div>

        {/* Rating display */}
        {product.rating && (
          <div className="absolute bottom-6 left-6 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-white text-xs font-medium ml-1">
              {product.rating}
            </span>
          </div>
        )}
      </figure>

      <div className="card-body relative z-10">
        <h3 className="card-title text-lg font-semibold leading-tight">
          <Link
            to={`/product/${product.slug}`}
            className="hover:text-primary transition-colors duration-300 line-clamp-2 group-hover:text-primary"
          >
            {product.name}
          </Link>
        </h3>

        <p className="text-sm text-base-content/60 mb-3 font-medium">
          {product.category_name}
        </p>

        {/* Price section */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.original_price && (
                <span className="text-sm text-base-content/50 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
            {product.stock > 0 && (
              <span className="text-xs text-base-content/60">
                {product.stock} disponibles
              </span>
            )}
          </div>

          {product.stock > 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className={`btn btn-primary btn-sm transition-all duration-300 group/btn ${
                isHovered ? 'scale-105 shadow-lg' : ''
              } ${isAddingToCart ? 'loading' : ''}`}
            >
              {!isAddingToCart && (
                <>
                  <ShoppingCart className="w-4 h-4 mr-1 group-hover/btn:translate-x-0.5 transition-transform" />
                  Ajouter
                </>
              )}
            </button>
          ) : (
            <span className="text-error text-sm font-medium px-2 py-1 bg-error/10 rounded-lg">
              Indisponible
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
