import { UserDto } from "../user/userDto";

export interface OrderDto {
    id: string;
    totalAmount: number;
    status: string;
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


