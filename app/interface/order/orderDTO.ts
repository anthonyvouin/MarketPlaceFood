export interface OrderDto {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    orderItems: {
        quantity: number;
        unitPrice: number;
        totalPrice: number;
        product: {
            name: string;
        };
    }[];
}