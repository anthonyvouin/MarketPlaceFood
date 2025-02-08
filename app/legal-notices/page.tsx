import React from 'react';

const LegalNotices = () => {
  return (
    <div className="bg-primaryBackgroundColor flex justify-center py-10">
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-center text-3xl font-bold mb-8">Mentions Légales</h1>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Identification de l'entreprise</h2>
          <p className="mb-2"><strong>Nom de l'entreprise :</strong> Snap&Shop</p>
          <p className="mb-2"><strong>Statut juridique :</strong> Projet scolaire</p>
          <p className="mb-2"><strong>Numéro SIRET :</strong> Non applicable (projet scolaire)</p>
          <p className="mb-2"><strong>RCS :</strong> Non applicable (projet scolaire)</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Coordonnées</h2>
          <p className="mb-2"><strong>Adresse :</strong>  28 Pl. de la Bourse, 75002 Paris</p>
          <p className="mb-2"><strong>E-mail :</strong> anthony.vouin@outlook.fr</p>
          <p className="mb-2"><strong>Téléphone :</strong> 06 60 05 38 88</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Directeur de la publication</h2>
          <p className="mb-2"><strong>Nom :</strong> Anthony Vouin</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Hébergeur du site</h2>
          <p className="mb-2"><strong>Nom :</strong> IONOS</p>
          <p className="mb-2"><strong>Adresse :</strong>7 PLACE DE LA GARE, 57200 SARREGUEMINES</p>
          <p className="mb-2"><strong>Site web :</strong>https://www.ionos.fr/ </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Propriété intellectuelle</h2>
          <p className="mb-2">L'ensemble du contenu du site Snap&Shop (textes, images, logos, etc.) est protégé par les lois en vigueur sur la propriété intellectuelle. Toute reproduction, distribution ou utilisation sans autorisation préalable est interdite.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Protection des données personnelles</h2>
          <p className="mb-2">Aucune donnée personnelle des utilisateurs n'est collectée ou traitée dans le cadre de ce projet scolaire. Pour toute question concernant la protection des données, vous pouvez contacter Anthony Vouin à l'adresse e-mail indiquée ci-dessus.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Responsabilité</h2>
          <p className="mb-2">Ce site étant un projet scolaire, il ne constitue pas un service commercial réel et n'engage aucune responsabilité quant à l'exactitude des informations fournies ou à l'utilisation qui en est faite par les visiteurs.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">8. Contact</h2>
          <p className="mb-2">Pour toute question ou demande d'information, vous pouvez contacter Anthony Vouin à l'adresse e-mail suivante : anthony.vouin@outlook.fr</p>
        </section>

        <p className="text-right mt-8"><em>Dernière mise à jour : 8 février 2025</em></p>
      </div>
    </div>
  );
};

export default LegalNotices;
