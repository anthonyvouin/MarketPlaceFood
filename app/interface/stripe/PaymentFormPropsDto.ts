import { AddressDto } from "../address/addressDto";

 export interface PaymentFormPropsDto {
    clientSecret: string;
    userId: string;    
    shippingAddress: AddressDto;

}