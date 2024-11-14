import {ProductDto} from "@/app/interface/product/productDto";

export interface DiscountDto {
    id?: string;
    name: string;
    rate: number;
    visible: boolean;
    products?: ProductDto[]
}
  
