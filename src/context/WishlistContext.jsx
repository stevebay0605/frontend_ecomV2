import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    setWishlist(prev => {
      if (prev.find(item => item.id === product.id)) {
        toast.info(`${product.name} est déjà dans vos favoris`);
        return prev;
      }
      toast.success(`${product.name} ajouté aux favoris !`);
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => {
      const product = prev.find(item => item.id === productId);
      if (product) {
        toast.success(`${product.name} retiré des favoris`);
      }
      return prev.filter(item => item.id !== productId);
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    toast.success('Favoris vidés');
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
        getWishlistCount: () => wishlist.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
