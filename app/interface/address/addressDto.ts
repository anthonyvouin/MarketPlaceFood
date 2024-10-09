export interface AddressDto {
    id?: string;
    name: string;
    additionalAddress: string | null;
    address: string;
    zipCode: string;
    city: string;
    note: string | null;
    phoneNumber: string;
    isPrincipal: boolean;
    isVisible: boolean;
    userId: string;
}