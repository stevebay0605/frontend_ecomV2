import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Mail, Package, Truck } from 'lucide-react';

function OrderConfirmation() {
  const { orderNumber } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4 text-center">
        {/* Success Animation */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg mb-6 max-w-md mx-auto flex items-center justify-center gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold">Commande confirmée avec succès !</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Merci pour votre commande !
        </h1>

        <p className="text-base text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
          Votre commande a été enregistrée et sera traitée dans les plus brefs délais.
        </p>

        {/* Order Details Card */}
        <div className="bg-white dark:bg-gray-950 rounded-lg p-8 mb-8 shadow-md border dark:border-gray-900">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-red-50 rounded-full p-4">
              <Package className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Détails de votre commande</h2>

          <div className="bg-gray-50 dark:bg-black rounded-lg p-6 mb-6 border dark:border-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Numéro de commande</p>
            <p className="text-2xl font-bold text-red-500 font-mono">{orderNumber}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-4">
              <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-800">Email envoyé</h3>
              <p className="text-sm text-blue-600">Confirmation à votre adresse</p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <Truck className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-orange-800">En préparation</h3>
              <p className="text-sm text-orange-600">Sous 24-48h</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800">Livraison</h3>
              <p className="text-sm text-green-600">3-5 jours ouvrés</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white dark:bg-gray-950 rounded-lg p-6 mb-8 shadow-md border dark:border-gray-900">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Prochaines étapes</h3>
          <div className="space-y-3 text-left max-w-md mx-auto">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
              <p className="text-sm text-gray-700 dark:text-gray-300">Vérifiez votre boîte email pour la confirmation détaillée</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
              <p className="text-sm text-gray-700">Votre commande sera préparée dans nos entrepôts</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
              <p className="text-sm text-gray-700">Vous recevrez un email de suivi lors de l'expédition</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Retour à l'accueil
          </Link>
          <Link to="/products" className="border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 font-semibold px-6 py-3 rounded-lg transition-colors inline-flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            Continuer mes achats
          </Link>
        </div>

        {/* Support */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Besoin d'aide ? Contactez notre service client</p>
          <p className="font-semibold">support@steveshop.com | 01 23 45 67 89</p>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
