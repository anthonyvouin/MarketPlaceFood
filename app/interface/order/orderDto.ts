export interface OrderDto {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: Date;
    orderItems: {
        quantity: number;
        unitPrice: number;
        totalPrice: number;
        product: {
            name: string;
        };
    }[];
}