"use client";
import React, { useEffect, useState } from "react";
import { getAllOrders } from "@/app/services/order/order";
import { OrderDto } from "@/app/interface/order/orderDto";
import { formatPriceEuro } from "@/app/pipe/formatPrice";


const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await getAllOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        setError("Erreur lors de la récupération des commandes.");
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const indexOfLastOrder: number = currentPage * itemsPerPage;
  const indexOfFirstOrder: number = indexOfLastOrder - itemsPerPage;
  const currentOrders= orders.slice(indexOfFirstOrder, indexOfLastOrder);

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
    return <div>Chargement des commandes...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="h-screen bg-primaryBackgroundColor p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Commandes</h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>Aucune commande disponible pour le moment.</p>
        </div>
      ) : (
        <div>
          {currentOrders.map((order: OrderDto) => (
            <div key={order.id} className="mb-4 p-4 border rounded-md shadow-sm bg-white">
              <h2 className="text-lg font-medium">Commande ID: {order.id}</h2>
              <p className="text-sm">Status: {order.status}</p>
              <p className="text-sm">Total: {formatPriceEuro(order.totalAmount)} €</p>
              <p className="text-sm">Créée le: {new Date(order.createdAt).toLocaleDateString()}</p>

              <h3 className="mt-2 text-md font-medium">Articles:</h3>
              <ul className="text-sm">
                {order.orderItems.map((item: any) => (
                  <li key={item.id} className="border-b py-1">
                    <p>Produit: {item.product.name}</p>
                    <p>Quantité: {item.quantity}</p>
                    <p>Prix Total: {formatPriceEuro(item.totalPrice)} €</p>
                  </li>
                ))}
              </ul>

              <h3 className="mt-2 text-md font-medium">Utilisateur:</h3>
              <p className="text-sm">Nom: {! order.user ? 'Aucun utilisateur' : order.user.name}</p>
              <p className="text-sm">Email: {! order.user ? 'Aucun utilisateur' : order.user.email}</p>
            </div>
          ))}

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50 text-sm"
            >
              Précédent
            </button>
            <span className="text-sm">Page {currentPage} sur {totalPages}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50 text-sm"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
