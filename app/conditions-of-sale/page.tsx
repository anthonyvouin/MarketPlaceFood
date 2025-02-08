import React from 'react';

const ConditionsOfSale = () => {
  return (
    <div className=" bg-primaryBackgroundColor flex justify-center py-10">
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-center text-2xl font-bold mb-8">Conditions Générales de Vente (CGV)</h1>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">1. Objet</h2>
          <p className="mb-1">Les présentes Conditions Générales de Vente (CGV) régissent les modalités de vente des produits et services proposés sur le site Snap&Shop dans le cadre de ce projet scolaire.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">2. Produits et services proposés</h2>
          <p className="mb-1">Snap&Shop propose des produits et services fictifs à des fins pédagogiques. Aucune vente réelle n'est effectuée via ce site.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">3. Prix et modalités de paiement</h2>
          <p className="mb-1">Les prix affichés sont indicatifs et ne représentent pas des transactions réelles. Aucun paiement ne sera demandé ni effectué.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">4. Livraison et délais</h2>
          <p className="mb-1">Etant un projet scolaire, aucune livraison de produits ou services réels n'est effectuée. Les délais mentionnés sont purement théoriques et à titre indicatif.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">5. Droit de rétractation</h2>
          <p className="mb-1">Conformément à la législation européenne, un droit de rétractation de 14 jours est généralement applicable aux ventes en ligne. Cependant, aucun achat réel n'étant effectué sur Snap&Shop, cette clause est purement informative.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">6. Garanties légales</h2>
          <p className="mb-1">Les garanties légales relatives à la conformité et aux vices cachés ne s'appliquent pas à ce projet scolaire, aucune vente effective n'étant réalisée.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">7. Service client et gestion des litiges</h2>
          <p className="mb-1">Toute demande d'information peut être adressée à Anthony Vouin à l'adresse e-mail suivante : anthony.vouin@outlook.fr. Aucun litige commercial ne pourra être traité, le site étant un projet à vocation éducative et non commerciale.</p>
        </section>

        <p className="text-right mt-8"><em>Dernière mise à jour : 8 février 2025</em></p>
      </div>
    </div>
  );
};

export default ConditionsOfSale;
