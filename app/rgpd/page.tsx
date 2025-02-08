import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-primaryBackgroundColor flex justify-center py-10">
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-center text-2xl font-bold mb-8">Politique de Confidentialité & Protection des Données (RGPD)</h1>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">1. Données collectées et finalités</h2>
          <p className="mb-1">Dans le cadre du projet scolaire Snap&Shop, aucune donnée personnelle des utilisateurs n'est collectée, stockée ou traitée à des fins commerciales. Toute donnée éventuellement renseignée (ex. e-mail de contact) est utilisée uniquement pour répondre aux demandes des utilisateurs.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">2. Base légale du traitement</h2>
          <p className="mb-1">Ce site étant un projet scolaire, aucun traitement de données personnelles n'est effectué à des fins commerciales ou analytiques. Les interactions avec le site ne donnent lieu à aucune collecte de données personnelles.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">3. Droits des utilisateurs</h2>
          <p className="mb-1">Conformément au Règlement Général sur la Protection des Données (RGPD), les utilisateurs disposent des droits suivants :</p>
          <ul className="list-disc pl-5">
            <li>Droit d'accès : obtenir une copie des informations les concernant.</li>
            <li>Droit de rectification : demander la correction de leurs données.</li>
            <li>Droit à l'effacement : demander la suppression de leurs données.</li>
            <li>Droit à la limitation du traitement : restreindre l'utilisation de leurs données.</li>
            <li>Droit d'opposition : s'opposer à tout traitement de données personnelles.</li>
          </ul>
          <p className="mb-1">Toute demande d'exercice de ces droits peut être effectuée par contact direct à l'adresse indiquée ci-dessous.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">4. Durée de conservation des données</h2>
          <p className="mb-1">Aucune donnée personnelle n'étant collectée dans le cadre de ce projet, aucune information n'est conservée.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">5. Contact pour exercer ses droits</h2>
          <p className="mb-1">Pour toute question relative à la protection des données ou pour exercer vos droits, vous pouvez contacter :</p>
          <p className="mb-1">Anthony Vouin - E-mail : anthony.vouin@outlook.fr</p>
        </section>

        <p className="text-right mt-8"><em>Dernière mise à jour : 8 février 2025</em></p>
      </div>
    </div>
    );

};


export default PrivacyPolicy;
