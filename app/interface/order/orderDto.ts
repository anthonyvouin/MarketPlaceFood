import { UserDto } from '../user/userDto';

export enum StatusEnum {
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_SUCCEDED = 'PAYMENT_SUCCEDED',
  PREPARING = 'PREPARING',
  SEND = 'SEND',
  RECEIVED = 'RECEIVED'
}


export const statusInFrench = (status: StatusEnum) => {
  switch (status) {
    case StatusEnum.PAYMENT_FAILED:
      return 'Paiement échoué';
    case StatusEnum.PAYMENT_PENDING:
      return 'Paiement en attente';
    case StatusEnum.PAYMENT_SUCCEDED:
      return 'Paiement réussi';
    case StatusEnum.PREPARING:
      return 'Commande en préparation';
    case StatusEnum.SEND:
      return 'Commande envoyée';
    case StatusEnum.RECEIVED:
      return 'Commande reçue par le client';

  }
};

export interface OrderDto {
  id: string;
  totalAmount: number;
  status: StatusEnum;
  createdAt: Date;
  user?: UserDto;
  shippingName: string;
  shippingAddress: string;
  shippingAddressAdd?: string;
  shippingZipCode: string;
  shippingCity: string;
  shippingPhoneNumber: string;
  shippingNote?: string;

  orderItems: {
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    product: {
      name: string;
    };
  }[];
}


