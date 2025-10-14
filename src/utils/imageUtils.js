/**
 * Génère l'URL complète d'une image produit avec fallback
 * @param {string} imagePath - Chemin de l'image
 * @returns {string} - URL complète de l'image ou placeholder
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-product.svg';
  if (imagePath.startsWith('http')) return imagePath;
  
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

/**
 * Gère l'erreur de chargement d'image et affiche le placeholder
 * @param {Event} event - Événement d'erreur de l'image
 */
export const handleImageError = (event) => {
  event.target.src = '/placeholder-product.svg';
  event.target.onerror = null; // Évite la boucle infinie
};
