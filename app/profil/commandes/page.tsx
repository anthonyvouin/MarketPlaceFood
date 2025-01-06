"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getOrdersByUser } from "@/app/services/stripe/stripe";
import { OrderDto } from "@/app/interface/order/orderDto";
import { jsPDF } from "jspdf";

const Commandes = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; 

  useEffect(() => {
    const fetchOrders = async () => {
      if (session?.user?.id) {
        try {
          const userOrders = await getOrdersByUser(session.user.id);
          setOrders(userOrders);
        } catch (err) {
          setError("Erreur lors de la récupération des commandes.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [session]);

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const generateInvoicePdf = (orderId: string) => {
    const order = orders.find((order) => order.id === orderId);
    if (!order) return;

    const doc = new jsPDF();
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text([
      "Snap&Shop",
      "123 Rue de la Paix, 75000 Paris, France",
      "75000 - Paris",
      "SIRET : 12345678901234",
      "N° TVA : FR1234567890",
      "Contact : contact@snapandshop.fr",
      "Tél : +33 6 66 66 66 66"
    ], 15, 20);

    doc.text([
      "Client :",
      `${order.user?.name || 'Non spécifié'}`,
      `${order.user?.email || 'Non spécifié'}`
    ], 120, 20);

    doc.setTextColor("#85BC39");
    doc.text([
      `Facture N° : ${order.id}`,
      `Date : ${new Date(order.createdAt).toLocaleDateString()}`
    ], 120, 50);

    doc.setDrawColor(0, 0, 0);
    doc.line(15, 80, 195, 80);

    doc.setTextColor("#85BC39");
    doc.setFontSize(10);
    doc.text("Description", 15, 90);
    doc.text("Quantité", 100, 90);
    doc.text("Prix Unit. HT", 130, 90);
    doc.text("Total TTC", 170, 90);

    doc.setTextColor(0, 0, 0);
    let yOffset = 100;
    order.orderItems.forEach((item) => {
      doc.text(item.product.name, 15, yOffset);
      doc.text(item.quantity.toString(), 105, yOffset);
      const prixUnitHT = ((item.totalPrice / item.quantity) / 120 * 100 / 100).toFixed(2);
      doc.text(`${prixUnitHT} €`, 130, yOffset);
      doc.text(`${(item.totalPrice / 100).toFixed(2)} €`, 170, yOffset);
      yOffset += 10;
    });

    doc.line(15, yOffset + 10, 195, yOffset + 10);

    const totalHT = (order.totalAmount / 120 * 100 / 100).toFixed(2);
    const tva = ((order.totalAmount - (order.totalAmount / 1.2)) / 100).toFixed(2);
    
    yOffset += 30;
    doc.text(`Total HT : ${totalHT} €`, 150, yOffset);
    doc.text(`TVA (20%) : ${tva} €`, 150, yOffset + 7);
    doc.text(`Total TTC : ${(order.totalAmount / 100).toFixed(2)} €`, 150, yOffset + 14);

    yOffset += 40;
    doc.setTextColor("#85BC39");
    doc.text("Mentions légales :", 15, yOffset);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    const mentionsLegales = [
      `Cette facture a été acquittée le ${new Date(order.createdAt).toLocaleDateString()}`,
      "Merci de votre confiance !",
      "Conformément aux articles L.211-4 et suivants du Code de la consommation, vous bénéficiez de la garantie légale de conformité.",
      "Droit de rétractation : Vous disposez d'un délai de 14 jours à compter de la réception pour retourner votre commande.",
      "Les données personnelles collectées sont utilisées uniquement dans le cadre de la gestion de votre commande.",
      "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.",
      "Pour toute réclamation, contactez notre service client : contact@snapandshop.fr",
      "Conservation recommandée : 5 ans (garantie légale de conformité)"
    ];

    yOffset += 4;
    mentionsLegales.forEach((mention) => {
      doc.text(mention, 15, yOffset);
      yOffset += 4;
    });

    doc.save(`facture-${orderId}.pdf`);
  };

  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <div>Chargement de vos commandes...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="h-[84vh] p-6 bg-primaryBackgroundColor overflow-auto">
      <h1 className="text-2xl font-bold mb-4">Vos commandes</h1>
      {orders.length === 0 ? (
        <p>Aucune commande trouvée.</p>
      ) : (
        <div className="space-y-6">
          {currentOrders.map((order: OrderDto) => (
            <div key={order.id} className="border rounded-lg p-4 shadow-md bg-white">
              <p className="font-bold text-lg">Commande #{order.id}</p>
              <p>Status : <span className="text-blue-500">{order.status}</span></p>
              <p>Total : {(order.totalAmount / 100).toFixed(2)} €</p>
              <p>Date : {new Date(order.createdAt).toLocaleDateString()}</p>
              <h3 className="mt-4 font-bold">Détails des articles :</h3>
              <ul className="list-disc list-inside">
                {order.orderItems.map((item, index) => (
                  <li key={index}>
                    {item.quantity} x {item.product.name} - {(item.totalPrice / 100).toFixed(2)} €
                  </li>
                ))}
              </ul>

              <button
                onClick={() => generateInvoicePdf(order.id)}
                className="mt-4 bg-actionColor text-white py-2 px-4 rounded"
              >
                Télécharger la facture
              </button>
            </div>
          ))}

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Précédent
            </button>
            <span>Page {currentPage} sur {totalPages}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Commandes;
