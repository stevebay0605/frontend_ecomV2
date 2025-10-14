import React, { useState, useEffect } from 'react';
import { getHomepageContent } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Home() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await getHomepageContent();
        setContent(response.data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  // Prepend backend URL to relative image paths
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000/${imagePath}`;
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-black">
      <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center py-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight animate-fade-in-up">
              Découvrez Notre<br />
              <span className="text-red-500">Nouvelle Collection</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-300 animate-fade-in-up animate-delay-200">
              Des produits de qualité pour un style unique
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-300">
              <a href="/products" className="bg-red-500 hover:bg-red-600 text-white font-semibold text-lg px-8 py-4 rounded-lg transition-smooth btn-press hover-glow inline-flex items-center justify-center gap-2">
                Acheter maintenant
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </a>
              <a href="#featured" className="bg-white hover:bg-gray-100 text-gray-900 font-semibold text-lg px-8 py-4 rounded-lg transition-smooth btn-press">
                Découvrir
              </a>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Bannières */}
      {content?.banners && content.banners.length > 0 && (
        <section className="py-16 bg-white dark:bg-black">
          <div className="container mx-auto px-4">
            <div className="carousel w-full rounded-xl shadow-lg overflow-hidden">
              {content.banners.map((banner, index) => (
                <div key={banner.id} id={`slide${index}`} className="carousel-item relative w-full">
                  <img src={getImageUrl(banner.image)} alt={banner.title} className="w-full h-80 md:h-96 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center">
                    <div className="text-center text-white max-w-2xl px-4">
                      <h2 className="text-3xl md:text-4xl font-bold mb-3">{banner.title}</h2>
                      {banner.subtitle && <p className="text-base md:text-lg mb-6">{banner.subtitle}</p>}
                      {banner.button_text && (
                        <a href={banner.button_link} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-block">
                          {banner.button_text}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                    <a href={`#slide${index === 0 ? content.banners.length - 1 : index - 1}`} className="bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg transition-colors">
                      <ChevronLeft className="w-5 h-5" />
                    </a>
                    <a href={`#slide${index === content.banners.length - 1 ? 0 : index + 1}`} className="bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Produits mis en avant */}
      {content?.featured_products && content.featured_products.length > 0 && (
        <section id="featured" className="py-16 bg-gray-50 dark:bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Produits Populaires
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Découvrez notre sélection de produits les plus appréciés
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {content.featured_products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <a
                href="/products"
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                Voir tous les produits
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
export default Home;

