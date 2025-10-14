/**
 * Formate un prix en FCFA avec séparateurs d'espaces
 * @param {number|string} price - Le prix à formater
 * @returns {string} - Prix formaté avec espaces (ex: "50 000 FCFA")
 */
export const formatPrice = (price) => {
  if (!price && price !== 0) return '0 FCFA';
  
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) return '0 FCFA';
  
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(numPrice) + ' FCFA';
};

/**
 * Formate un prix sans la devise (pour les calculs d'affichage)
 * @param {number|string} price - Le prix à formater
 * @returns {string} - Prix formaté sans devise
 */
export const formatPriceNumber = (price) => {
  if (!price && price !== 0) return '0';
  
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) return '0';
  
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(numPrice);
};
