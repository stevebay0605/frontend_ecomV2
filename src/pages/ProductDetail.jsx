import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../services/api.js';
import { CartContext } from '../context/CartContext.jsx';
import { toast } from 'react-toastify';
import { Star, Check, X } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await getProduct(slug);
        setProduct(response.data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} x ${product.name} ajouté au panier !`);
  };


  // Calcul du pourcentage de réduction (si old_price existe)
  const discountPercent = product?.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-black">
      <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
      <div className="text-center max-w-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Produit non trouvé</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Le produit que vous recherchez n'existe pas.</p>
        <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors" onClick={() => navigate('/')}>Retour à l'accueil</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <button onClick={() => navigate('/')} className="hover:text-primary transition">Accueil</button>
            <span>/</span>
            <button onClick={() => navigate('/products')} className="hover:text-primary transition">Produits</button>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">{product.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in-up">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md overflow-hidden border dark:border-gray-900">
              <figure className="relative">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  loading="lazy"
                  onError={handleImageError}
                  className="w-full h-96 md:h-[500px] object-contain bg-gray-50 dark:bg-gray-800 transition-smooth-slow"
                />
                {(product.featured || discountPercent > 0) && (
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.featured && (
                      <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Produit phare
                      </div>
                    )}
                    {discountPercent > 0 && (
                      <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        -{discountPercent}%
                      </div>
                    )}
                  </div>
                )}
              </figure>
            </div>

            {/* Thumbnail gallery placeholder - can be expanded later */}
            <div className="flex space-x-2 overflow-x-auto">
              <div className="flex-shrink-0 w-20 h-20 bg-base-300 rounded-lg cursor-pointer border-2 border-primary">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  loading="lazy"
                  onError={handleImageError}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-white">{product.name}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{product.category_name}</p>
              <div className="flex items-center gap-4 mb-6">
                {product.old_price ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
                    <span className="text-lg text-gray-400 line-through">{formatPrice(product.old_price)}</span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                )}
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">(4.8)</span>
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-3">
              {product.stock > 0 ? (
                <>
                  <span className="px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium inline-flex items-center gap-1">
                    <Check className="w-4 h-4" /> En stock
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{product.stock} disponibles</span>
                </>
              ) : (
                <span className="px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-sm font-medium inline-flex items-center gap-1">
                  <X className="w-4 h-4" /> Rupture de stock
                </span>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            {product.stock > 0 && (
              <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 shadow-lg lg:sticky lg:top-4 border dark:border-gray-900">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Quantité</span>
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                    <button
                      className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-smooth btn-press disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/>
                      </svg>
                    </button>
                    <div className="px-4 py-1 min-w-[48px] text-center font-semibold text-gray-900 dark:text-white">{quantity}</div>
                    <button
                      className="px-3 py-1 hover:bg-gray-100 transition-colors"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-smooth btn-press hover-glow flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3"/>
                  </svg>
                  Ajouter au panier - {formatPrice(product.price * quantity)}
                </button>
              </div>
            )}

            {/* Product Details Tabs */}
            <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-lg overflow-hidden border dark:border-gray-900">
              <div className="tabs tabs-bordered">
                <a className="tab tab-active">Description</a>
                <a className="tab">Détails</a>
                <a className="tab">Avis (3)</a>
              </div>

              <div className="p-6">
                <div className="tab-content">
                  <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Description du produit</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>
                </div>
              </div>
            </div>

            {/* Share and Wishlist */}
            <div className="flex items-center justify-between bg-white dark:bg-gray-950 rounded-2xl p-4 shadow-lg border dark:border-gray-900">
              <div className="flex items-center space-x-4">
                <button className="btn btn-ghost btn-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                  Ajouter aux favoris
                </button>
                <button className="btn btn-ghost btn-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                  </svg>
                  Partager
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Produits similaires</h2>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Bientôt disponible - Produits de la même catégorie</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProductDetail;
