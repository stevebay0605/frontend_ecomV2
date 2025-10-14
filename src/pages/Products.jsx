import React, { useState, useEffect, useCallback } from 'react';
import { getProducts, getCategories } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import ProductSkeleton from '../components/ProductSkeleton.jsx';
import Pagination from '../components/Pagination.jsx';
import { X, ChevronDown, ChevronRight, ArrowUpDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';

function Products() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('default');
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isSizeOpen, setIsSizeOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
    }
  };

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page: currentPage };
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;

      const response = await getProducts(params);
      const data = response.data;
      
      // Support both paginated and non-paginated responses
      if (data.results) {
        setProducts(data.results);
        setTotalPages(Math.ceil((data.count || data.results.length) / 12));
      } else {
        setProducts(data);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, currentPage]);

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedSizes([]);
    setPriceRange('');
    setSearch('');
    setSortBy('default');
    setCurrentPage(1);
  };

  const getSortedProducts = (productsList) => {
    const sorted = [...productsList];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'newest':
        return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      default:
        return sorted;
    }
  };

  const sortedProducts = getSortedProducts(products);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearch(searchQuery);
    }
  }, [location]);

  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [search, selectedCategory]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const sizes = ['38', '39', '40', '41', '42', '43', '44'];
  const priceRanges = [
    { label: 'Moins de 50FCFA', value: '0-50' },
    { label: '50FCFA - 100FCFA', value: '50-100' },
    { label: '100FCFA - 150FCFA', value: '100-150' },
    { label: 'Plus de 150FCFA', value: '150+' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header Section */}
      <section className="bg-white dark:bg-gray-950 py-8 border-b border-gray-200 dark:border-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">Nos Produits</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Découvrez notre sélection de produits
            </p>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-950 rounded-lg p-6 sticky top-4 shadow-md border border-gray-200 dark:border-gray-900">
              {/* Categories */}
              <div className="mb-6">
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="flex items-center justify-between w-full mb-3 text-gray-900 dark:text-white"
                >
                  <h3 className="font-semibold text-lg">CATÉGORIES</h3>
                  {isCategoryOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
                {isCategoryOpen && (
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => setSelectedCategory('')}
                        className={`w-full text-left px-3 py-2 rounded transition-smooth ${
                          selectedCategory === '' ? 'bg-red-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        Toutes
                      </button>
                    </li>
                    {categories.map(cat => (
                      <li key={cat.id}>
                        <button
                          onClick={() => setSelectedCategory(cat.slug)}
                          className={`w-full text-left px-3 py-2 rounded transition-smooth ${
                            selectedCategory === cat.slug ? 'bg-red-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          {cat.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <button
                  onClick={() => setIsSizeOpen(!isSizeOpen)}
                  className="flex items-center justify-between w-full mb-3 text-gray-900 dark:text-white"
                >
                  <h3 className="font-semibold text-lg">TAILLES</h3>
                  {isSizeOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
                {isSizeOpen && (
                  <div className="space-y-2">
                    {sizes.map(size => (
                      <label key={size} className="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded text-gray-700 dark:text-gray-300 transition-smooth">
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(size)}
                          onChange={() => toggleSize(size)}
                          className="mr-3 w-4 h-4 accent-red-500"
                        />
                        <span>{size}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <button
                  onClick={() => setIsPriceOpen(!isPriceOpen)}
                  className="flex items-center justify-between w-full mb-3 text-gray-900 dark:text-white"
                >
                  <h3 className="font-semibold text-lg">PRIX</h3>
                  {isPriceOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
                {isPriceOpen && (
                  <div className="space-y-2">
                    {priceRanges.map(range => (
                      <label key={range.value} className="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded text-gray-700 dark:text-gray-300 transition-smooth">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={priceRange === range.value}
                          onChange={() => setPriceRange(range.value)}
                          className="mr-3 w-4 h-4 accent-red-500"
                        />
                        <span className="text-sm">{range.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear Filters */}
              {(selectedCategory || selectedSizes.length > 0 || priceRange || search) && (
                <button
                  onClick={clearAllFilters}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-smooth btn-press"
                >
                  Réinitialiser
                </button>
              )}
            </div>
          </aside>

          {/* Products Area */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-4 mb-6 border dark:border-gray-900">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Rechercher une chaussure..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Results count & Sort */}
            {!loading && !error && (
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {products.length} produit{products.length !== 1 ? 's' : ''} trouvé{products.length !== 1 ? 's' : ''}
                </p>
                
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-smooth"
                  >
                    <option value="default">Trier par défaut</option>
                    <option value="price-asc">Prix : Croissant</option>
                    <option value="price-desc">Prix : Décroissant</option>
                    <option value="name-asc">Nom : A-Z</option>
                    <option value="name-desc">Nom : Z-A</option>
                    <option value="newest">Plus récents</option>
                  </select>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700">{error}</span>
              </div>
            ) : sortedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {/* Pagination */}
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="text-center py-20">
                <svg className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-5.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 003.586 13H3" />
                </svg>
                <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Essayez de modifier vos critères de recherche.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-smooth btn-press"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
