import {ProductDto} from "@/app/interface/product/productDto";

export interface BasketDto {
    product: ProductDto,
    quantity: number,
    totalPrice: string
}