import { UserDto } from '../user/userDto';

export enum StatusEnum {
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_SUCCEDED = 'PAYMENT_SUCCEDED',
  PREPARING = 'PREPARING',
  SHIP = 'SHIP',
  RECEIVED = 'RECEIVED'
}


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


