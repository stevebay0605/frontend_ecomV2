import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center py-12 px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300 dark:text-gray-700 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Page introuvable</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </Link>
          <Link 
            to="/products" 
            className="border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 font-semibold px-6 py-3 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Voir les produits
          </Link>
        </div>

        <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>Besoin d'aide ? <a href="mailto:support@steveshop.com" className="text-red-500 hover:text-red-600 font-semibold">Contactez-nous</a></p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
