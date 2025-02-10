'use client';

import { useContext, useEffect, useState } from 'react';
import { changeIsPrep, changeStatusOrder, getOrderById } from '@services/order/order';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { PrepOrderItemsDto } from '@/app/admin/prep-order/[id]/prep-order-item.dto';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { StatusEnum } from '@interface/order/orderDto';
import { ToastContext } from '@provider/toastProvider';

export default function PrepOrderById() {
  const [order, setOrder] = useState<PrepOrderItemsDto[]>([]);
  const router = useRouter();
  const { show } = useContext(ToastContext);
  const { id } = useParams() as { id: string };

  useEffect((): void => {
    const fetchOrders = async (): Promise<void> => {
      const fetchedOrders: PrepOrderItemsDto[] = await getOrderById(id);
      setOrder(fetchedOrders);
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const updateOrderAndRedirect = async () => {
      let productPrep = 0;
      const allProducts = order.length;

      order.forEach((element) => {
        if (element.isPrep) {
          productPrep += 1;
        }
      });

      if (productPrep === allProducts && allProducts !== 0) {
        try {
          await changeStatus();
          show('Préparation commande', `La commande n° ${order[0].orderId} est envoyée`, 'success');

        } catch (error) {
          show('Préparation commande', `Erreur changement de statut pour la commande ${order[0].orderId}`, 'error');
        }
      }
    };

    updateOrderAndRedirect();
  }, [order]);

  const changeStatus = async () => {
    await changeStatusOrder(order[0].orderId, StatusEnum.SEND);
    router.push('/admin/prep-order');
  };

  const handleCheckboxChange = async (id: string, isChecked: boolean): Promise<void> => {
    setOrder((prevOrder: PrepOrderItemsDto[]) =>
      prevOrder.map((article: PrepOrderItemsDto): PrepOrderItemsDto =>
        article.id === id
          ? { ...article, isPrep: isChecked }
          : article
      )
    );

    await changeIsPrep(id, order[0].orderId, isChecked);
  };
  return (
    <div className="w-[85%] m-auto mt-16">
      <h1 className="text-center mb-8 text-2xl font-bold">Préparation de la commande {order.length> 0 ? `n° ${order[0].orderId}` : ''} </h1>
      {order && order.length > 0 ? (
        <div>
          {order.map((article: PrepOrderItemsDto) => (
            <Card
              key={article.id}
              className={`mb-4  ${article.isPrep ? 'border-actionColor border-4' : ''} w-full`}>
              <div className="flex w-full">
                <div className="flex w-full">
                  <Image src={article.product.image}
                         alt="photo du produit"
                         width={50}
                         height={50}
                         className="mr-8 object-contain !h-[50px]"
                         unoptimized
                  />
                  <div className="w-[80%]">
                    <p>Nom : {article.product.name}</p>
                    <p>Quantité : {article.quantity}</p>
                  </div>
                  <div className="self-center w-[30px]">
                    <Checkbox
                      className="w-[30px]"
                      pt={{
                        box: {
                          style: { width: '30px', height: '30px' },
                        },
                      }}
                      onChange={(e) =>
                        handleCheckboxChange(article.id, e.checked!)
                      }
                      checked={article.isPrep || false}
                    ></Checkbox>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p>Chargement de la commande</p>
      )}
    </div>
  );
}