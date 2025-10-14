import React, { useState, useEffect, useCallback } from 'react';
import { getProducts, getCategories } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import { X, Filter, SortAsc, SortDesc, ChevronLeft, ChevronRight } from 'lucide-react';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const productsPerPage = 12;

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        page_size: productsPerPage,
        ordering: `${sortOrder === 'desc' ? '-' : ''}${sortBy}`
      };
      if (selectedCategory) params.category = selectedCategory;
      if (search) params.search = search;

      const response = await getProducts(params);
      setProducts(response.data.results || response.data);
      setTotalPages(Math.ceil((response.data.count || response.data.length) / productsPerPage));
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, search, sortBy, sortOrder, currentPage]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setCurrentPage(1);
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-12">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="btn btn-outline btn-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {startPage > 1 && (
          <>
            <button onClick={() => setCurrentPage(1)} className="btn btn-outline btn-sm">1</button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pages.map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`btn btn-sm ${page === currentPage ? 'btn-primary' : 'btn-outline'}`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button onClick={() => setCurrentPage(totalPages)} className="btn btn-outline btn-sm">{totalPages}</button>
          </>
        )}

        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="btn btn-outline btn-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header Section */}
      <section className="bg-white dark:bg-gray-950 py-16 shadow-sm border-b border-gray-200 dark:border-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white">Nos Produits</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Découvrez notre collection complète de produits de qualité supérieure
            </p>
          </div>

          {/* Desktop Filters */}
          <div className="hidden md:block max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-900">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-gray-700 dark:text-gray-300">Rechercher</span>
                  </label>
                  <input
                    type="search"
                    placeholder="Nom du produit..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-smooth bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-gray-700 dark:text-gray-300">Catégorie</span>
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-smooth bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="">Toutes les catégories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-gray-700 dark:text-gray-300">Trier par</span>
                  </label>
                  <select
                    value={`${sortBy}_${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('_');
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-smooth bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="name_asc">Nom (A-Z)</option>
                    <option value="name_desc">Nom (Z-A)</option>
                    <option value="price_asc">Prix croissant</option>
                    <option value="price_desc">Prix décroissant</option>
                    <option value="created_at_desc">Plus récent</option>
                    <option value="created_at_asc">Plus ancien</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-gray-700 dark:text-gray-300">Actions</span>
                  </label>
                  <button
                    onClick={clearFilters}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-smooth btn-press disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={!search && !selectedCategory}
                  >
                    Effacer les filtres
                  </button>
                </div>
              </div>

              {/* Active filters display */}
              {(search || selectedCategory) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {search && (
                    <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-xs font-semibold px-3 py-1 rounded-full">
                      Recherche: {search}
                      <button
                        onClick={() => setSearch('')}
                        className="hover:bg-red-200 dark:hover:bg-red-800 rounded-full p-0.5 transition-smooth"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {selectedCategory && (
                    <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-semibold px-3 py-1 rounded-full">
                      Catégorie: {categories.find(c => c.slug === selectedCategory)?.name}
                      <button
                        onClick={() => setSelectedCategory('')}
                        className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-smooth"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="md:hidden flex justify-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-smooth"
            >
              <Filter className="w-5 h-5" />
              Filtres
              {(search || selectedCategory) && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {(search ? 1 : 0) + (selectedCategory ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Mobile Filters Sidebar */}
      {showFilters && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowFilters(false)}>
          <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-950 shadow-xl border-l border-gray-200 dark:border-gray-900" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filtres</h3>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-smooth">
                  <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-gray-700 dark:text-gray-300">Rechercher</span>
                  </label>
                  <input
                    type="search"
                    placeholder="Nom du produit..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-smooth bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-gray-700 dark:text-gray-300">Catégorie</span>
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-smooth bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="">Toutes les catégories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-gray-700 dark:text-gray-300">Trier par</span>
                  </label>
                  <select
                    value={`${sortBy}_${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('_');
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-smooth bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="name_asc">Nom (A-Z)</option>
                    <option value="name_desc">Nom (Z-A)</option>
                    <option value="price_asc">Prix croissant</option>
                    <option value="price_desc">Prix décroissant</option>
                    <option value="created_at_desc">Plus récent</option>
                    <option value="created_at_asc">Plus ancien</option>
                  </select>
                </div>

                <button
                  onClick={clearFilters}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-smooth btn-press disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!search && !selectedCategory}
                >
                  Effacer les filtres
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Section */}
      <section className="py-16 bg-gray-50 dark:bg-black">
        <div className="container mx-auto px-4">
          {/* Results count and sorting */}
          {!loading && !error && (
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {products.length} produit{products.length !== 1 ? 's' : ''} trouvé{products.length !== 1 ? 's' : ''}
              </p>

              {/* Mobile sort toggle */}
              <div className="md:hidden">
                <select
                  value={`${sortBy}_${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('_');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-smooth"
                >
                  <option value="name_asc">Nom (A-Z)</option>
                  <option value="name_desc">Nom (Z-A)</option>
                  <option value="price_asc">Prix ↑</option>
                  <option value="price_desc">Prix ↓</option>
                  <option value="created_at_desc">Récent</option>
                  <option value="created_at_asc">Ancien</option>
                </select>
              </div>
            </div>
          )}

          {/* Liste des produits */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="mt-4 text-lg text-gray-600">Chargement des produits...</p>
            </div>
          ) : error ? (
            <div className="alert alert-error max-w-md mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination />
            </>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <svg className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-5.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 003.586 13H3" />
                </svg>
                <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Essayez de modifier vos critères de recherche ou consultez toutes nos catégories.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-smooth btn-press"
                >
                  Voir tous les produits
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Products;
