import {AddressDto} from "@/app/interface/address/addressDto";

export interface UserDto {
    id?: string;
    name: string | null;
    email: string| null;
    emailVerified: Date| null;
    image: string| null;
    addresses: AddressDto[];
}