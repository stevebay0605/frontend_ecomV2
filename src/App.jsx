import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './context/CartContext.jsx';
import { SiteProvider } from './context/SiteContext.jsx';
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from './context/ThemeContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import Navbar from './components/Navbar.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/ProductsEnhanced.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import Login from './pages/Login.jsx';  
import Register from './pages/Register.jsx';  
import Profile from './pages/Profile.jsx';  
import MyOrders from './pages/MyOrders.jsx';  
import Wishlist from './pages/Wishlist.jsx';
import NotFound from './pages/NotFound.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <SiteProvider>
            <WishlistProvider>
              <CartProvider>
              <div className="min-h-screen flex flex-col bg-white dark:bg-black transition-colors">
              <Navbar />
              <main className="flex-grow container mx-auto px-4 py-6 dark:text-gray-200">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-orders" element={
                    <ProtectedRoute>
                      <MyOrders />
                    </ProtectedRoute>
                  } />
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } />
                  <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <footer className="bg-gray-900 dark:bg-black text-white py-8 mt-auto border-t border-gray-800 dark:border-gray-900">
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                    <div>
                      <h3 className="text-lg font-bold mb-3">
                        <span className="text-red-500">STEVE</span> SHOP
                      </h3>
                      <p className="text-sm text-gray-400">
                        Votre boutique en ligne de confiance pour des produits de qualité.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 text-sm">Navigation</h4>
                      <div className="flex flex-col gap-2 text-sm text-gray-400">
                        <a href="/" className="hover:text-red-500 transition-colors">Accueil</a>
                        <a href="/products" className="hover:text-red-500 transition-colors">Produits</a>
                        <a href="/my-orders" className="hover:text-red-500 transition-colors">Mes commandes</a>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 text-sm">Contact</h4>
                      <div className="text-sm text-gray-400 space-y-2">
                        <p>Email: support@steveshop.com</p>
                        <p>Tel: +242 06 933 90 97</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-800 pt-6 text-center">
                    <p className="text-sm text-gray-400">
                      &copy; 2025 <span className="text-red-500 font-bold">STEVE</span> <span className="font-bold">SHOP</span>. Tous droits réservés.
                    </p>
                  </div>
                </div>
              </footer>
              </div>
              <ScrollToTop />
              <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
              </CartProvider>
            </WishlistProvider>
          </SiteProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
