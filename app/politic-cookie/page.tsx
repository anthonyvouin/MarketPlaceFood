import React from 'react';

const CookiePolicy = () => {
  return (
    <div className=" bg-primaryBackgroundColor flex justify-center py-10">
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-center text-2xl font-bold mb-8">Politique de Cookies</h1>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">1. Types de cookies utilisés</h2>
          <p className="mb-1">Le site Snap&Shop, dans le cadre de ce projet scolaire, n'utilise aucun cookie à des fins commerciales ou analytiques. Si des cookies techniques sont employés, ils servent uniquement au bon fonctionnement du site (ex. maintien de session utilisateur).</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">2. Finalité des cookies</h2>
          <p className="mb-1">Les cookies susceptibles d'être utilisés sur ce site ont pour unique objectif d'assurer une expérience fluide et fonctionnelle. Aucun cookie de suivi publicitaire ou de collecte de données personnelles n'est implanté.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">3. Consentement et gestion des préférences</h2>
          <p className="mb-1">Conformément à la réglementation en vigueur, les utilisateurs ont le droit de contrôler l'utilisation des cookies.</p>
          <p className="mb-1">Si des cookies non essentiels étaient implémentés, un bandeau d'information apparaîtrait lors de la première visite afin de recueillir le consentement des utilisateurs.</p>
          <p className="mb-1">Les préférences peuvent être modifiées à tout moment via les paramètres du navigateur.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Contact</h2>
          <p className="mb-1">Pour toute question relative à la politique de cookies, vous pouvez contacter :</p>
          <p className="mb-1">Anthony Vouin - E-mail : anthony.vouin@outlook.fr</p>
        </section>

        <p className="text-right mt-8"><em>Dernière mise à jour : 8 février 2025</em></p>
      </div>
    </div>
  );
};

export default CookiePolicy;
