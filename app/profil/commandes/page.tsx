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

    doc.setFont("helvetica");
    doc.setFontSize(12);
    doc.setFontSize(16);
    doc.text(`Facture Commande #${order.id}`, 10, 10);

    doc.setFontSize(12);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 10, 20);
    doc.text(`Status: ${order.status}`, 10, 30);
    doc.text(`Total: ${(order.totalAmount / 100).toFixed(2)} €`, 10, 40);

    doc.setFontSize(14);
    doc.text("Détails des articles", 10, 50);

    let yOffset = 60;
    order.orderItems.forEach((item, index) => {
      doc.setFontSize(12);
      doc.text(
        `${item.quantity} x ${item.product.name} - ${(item.totalPrice / 100).toFixed(2)} €`,
        10,
        yOffset
      );
      yOffset += 10;
    });

    doc.setLineWidth(0.5);
    doc.line(10, yOffset + 10, 200, yOffset + 10); 

    doc.setFontSize(10);
    doc.text(
      "Merci pour votre achat !",
      10,
      yOffset + 20
    );

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
