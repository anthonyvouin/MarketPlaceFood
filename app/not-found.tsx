
import React from 'react';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primaryBackgroundColor">
      <img
        src="/images/404.svg"  
        alt="Page Not Found"
        className="w-[450px] h-[450px] mb-6"  
      />
      
      <h1 className="text-4xl font-bold mb-4">404 - Page non trouvée</h1>
      
      <p className="text-lg text-gray-700 mb-6">Désolé, la page que vous recherchez n'existe pas.</p>
      <Link className="text-xl text-actionColor"  href="/">Retour à la page d'accueil</Link>

    </div>
  );
};

export default NotFound;
