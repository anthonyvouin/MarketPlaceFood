import { Product } from '@prisma/client';

export interface PrepOrderItemsDto {
  id: string;
  orderId: string;
  product: Product;
  productId: string;
  quantity: number;
  totalPrice: number;
  unitPrice: number;
  isPrep?: boolean;

}