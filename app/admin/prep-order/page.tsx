'use client';

import { useEffect, useState } from 'react';
import { getAllOrders, getPayedAndPreparedOrders } from '@services/order/order';
import { Order } from '@prisma/client';
import { Card } from 'primereact/card';
import RoundedButton from '@components/ui/rounded-button';
import { useRouter } from 'next/navigation';
import { StatusEnum, statusInFrench } from '@interface/order/orderDto';

export default function PrepOrder() {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();
  useEffect(() => {
    const fetchOrders = async () => {

      const fetchedOrders: Order[] = await getPayedAndPreparedOrders();
      setOrders(fetchedOrders);
    };

    fetchOrders();
  }, []);

  const goTo = (id: string) => {
    router.push(`/admin/prep-order/${id}`);
  };
  return (
    <div className="w-[85%] m-auto mt-16">
      <h1 className="text-center mb-8 text-2xl font-bold">Préparation de commandes</h1>
      {orders && orders.length > 0 ? (

        <div>
          {orders.map((order, index) => (
            <Card
              key={index}
              className="mb-4">
              <p>Date : {order.createdAt.toLocaleDateString()}</p>
              <p>Numéro de commande : {order.id}</p>
              <p>Statut: {statusInFrench(order.status as StatusEnum)}</p>
              <p>Nombre d'articles: {order['orderItems'].length}</p>
              <RoundedButton onClickAction={() => goTo(order.id)} classes="bg-actionColor text-white mt-4" message="Préparer"></RoundedButton>
            </Card>
          ))}
        </div>
      ) : (
        <p>Il n'y a pas de commande à préparer</p>
      )}
    </div>
  );
}