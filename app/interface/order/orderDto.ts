import { UserDto } from "../user/userDto";

export interface OrderDto {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: Date;
    user?: UserDto;  
       
    orderItems: {
        quantity: number;
        unitPrice: number;
        totalPrice: number;
        product: {
            name: string;
        };
    }[];
}


