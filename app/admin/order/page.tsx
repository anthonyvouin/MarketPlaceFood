"use client";
import React, { useEffect, useState } from "react";
import { getAllOrders } from "@/app/services/order/order";

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]); 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await getAllOrders(); 
        setOrders(fetchedOrders); 
      } catch (error) {
        console.error("Error fetching orders:", error);  
      }
    };

    fetchOrders();  
  }, []);  

  return (
    <div className="h-screen bg-primaryBackgroundColor p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Orders Data</h1>

      {orders.length === 0 ? (
         <div className="text-center text-gray-600">
         <p>Aucune commandes disponible pour le moment.</p>
     </div>

      ) : (
        <div>
          {/* Boucle à travers les commandes pour les afficher */}
          {orders.map((order: any) => (  // Remplace 'any' par un type approprié plus tard
            <div key={order.id} className="mb-6 p-6 border rounded-lg shadow-md bg-white">
              <h2 className="text-2xl font-semibold">Commande  ID: {order.id}</h2>
              <p>Status: {order.status}</p>
              <p>Total Amount: {order.totalAmount} USD</p>
              <p>Created At: {new Date(order.createdAt).toLocaleDateString()}</p>

              {/* Affichage des articles de la commande */}
              <h3 className="mt-4 text-xl font-medium">Order Items:</h3>
              <ul>
                {order.orderItems.map((item: any) => (  // Remplace 'any' par un type spécifique plus tard
                  <li key={item.id} className="border-b py-2">
                    <p>Product: {item.product.name}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Total Price: {item.totalPrice} USD</p>
                  </li>
                ))}
              </ul>

              {/* Affichage des informations de l'utilisateur */}
              <h3 className="mt-4 text-xl font-medium">User Info:</h3>
              <p>Name: {order.user.name}</p>
              <p>Email: {order.user.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
