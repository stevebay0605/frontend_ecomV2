import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { SiteContext } from '../context/SiteContext';
import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';
import { WishlistContext } from '../context/WishlistContext';
import { ShoppingCart, Menu, X, User, Package, LogOut, Search, Moon, Sun, Heart } from 'lucide-react';

function Navbar() {
  const { getItemCount } = useContext(CartContext);
  const { settings } = useContext(SiteContext);
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { getWishlistCount } = useContext(WishlistContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/products/?search=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSearchResults(data.results?.slice(0, 5) || data.slice(0, 5));
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Prepend backend URL to relative image paths
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000/${imagePath}`;
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="bg-white dark:bg-black shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-900 transition-smooth animate-fade-in-down">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-2 group">
              {settings?.logo && (
                <img
                  src={getImageUrl(settings.logo)}
                  alt={settings.site_name}
                  className="h-8 w-auto transition-all duration-300 group-hover:scale-105"
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              <span className="text-2xl font-bold transition-all duration-300">
                {settings?.site_name ? (
                  settings.site_name === 'SteveShop' ? (
                    <>
                      <span className="text-red-500">STEVE</span>
                      <span className="text-gray-800"> SHOP</span>
                    </>
                  ) : (
                    <>
                      <span className="text-red-500">{settings.site_name.split(' ')[0]}</span>
                      {settings.site_name.split(' ').length > 1 && (
                        <span className="text-gray-800"> {settings.site_name.split(' ').slice(1).join(' ')}</span>
                      )}
                    </>
                  )
                ) : (
                  <>
                    <span className="text-red-500">STEVE</span>
                    <span className="text-gray-800"> SHOP</span>
                  </>
                )}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link
                to="/"
                className={`flex items-center gap-2 font-medium transition-colors duration-300 ${
                  isActive('/')
                    ? 'text-gray-900 border-b-2 border-red-500 pb-1'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Accueil
              </Link>
              <Link
                to="/products"
                className={`flex items-center gap-2 font-medium transition-colors duration-300 ${
                  isActive('/products')
                    ? 'text-gray-900 border-b-2 border-red-500 pb-1'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Produits
              </Link>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-6">
              {/* Search */}
              <div className="hidden md:block relative">
                {isSearchOpen ? (
                  <div className="relative">
                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher..."
                      className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      autoFocus
                    />
                    <button type="submit" className="text-red-500 hover:text-red-600 transition-colors">
                      <Search className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </form>
                  
                  {/* Autocomplete Results */}
                  {(searchResults.length > 0 || isSearching) && searchQuery.length >= 2 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 max-h-96 overflow-y-auto z-50">
                      {isSearching ? (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          Recherche...
                        </div>
                      ) : (
                        searchResults.map((product) => (
                          <Link
                            key={product.id}
                            to={`/product/${product.slug}`}
                            onClick={() => {
                              setSearchQuery('');
                              setSearchResults([]);
                              setIsSearchOpen(false);
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                          >
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                              onError={(e) => e.target.src = '/placeholder-product.svg'}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {product.name}
                              </p>
                              <p className="text-sm text-red-500 font-semibold">
                                {new Intl.NumberFormat('fr-FR').format(product.price)} FCFA
                              </p>
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    aria-label="Rechercher"
                  >
                    <Search className="w-6 h-6" />
                  </button>
                )}
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-smooth p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 btn-press"
              >
                {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>

              {/* User Icon */}
              {isAuthenticated ? (
                <div className="hidden lg:block relative group">
                  <button className="text-gray-600 hover:text-gray-900 transition-colors">
                    <User className="w-6 h-6" />
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                      <p className="font-semibold text-gray-800">{user?.first_name} {user?.last_name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>Mon Profil</span>
                      </Link>
                      <Link 
                        to="/my-orders" 
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Package className="h-4 w-4" />
                        <span>Mes Commandes</span>
                      </Link>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-800 py-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="hidden lg:block text-gray-600 hover:text-gray-900 transition-colors">
                  <User className="w-6 h-6" />
                </Link>
              )}

              {/* Wishlist Icon */}
              <Link
                to="/wishlist"
                className="relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-smooth hover-lift"
                aria-label="Favoris"
              >
                <Heart className="h-6 w-6" />
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center badge-pulse">
                    {getWishlistCount()}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-smooth hover-lift"
                aria-label="Panier"
              >
                <ShoppingCart className="h-6 w-6" />
                {getItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center">
                    {getItemCount()}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
                
        {/* Mobile Menu */}
        <div
          className={`lg:hidden mobile-menu-container transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white border-t border-gray-200 px-4 py-3 space-y-1">
            <Link
              to="/"
              className={`block px-4 py-2 rounded font-medium transition-colors ${
                isActive('/')
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/products"
              className={`block px-4 py-2 rounded font-medium transition-colors ${
                isActive('/products')
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Produits
            </Link>

            {/* Mobile Auth Section */}
            <div className="pt-2 border-t border-gray-200 space-y-1">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2">
                    <span className="text-sm font-semibold text-gray-800">{user?.first_name} {user?.last_name}</span>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 rounded font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" /> Mon Profil
                  </Link>
                  <Link
                    to="/my-orders"
                    className="flex items-center gap-2 px-4 py-2 rounded font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Package className="h-4 w-4" /> Mes Commandes
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 rounded font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 rounded font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="block btn-primary-custom text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;