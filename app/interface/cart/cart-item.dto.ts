import {ProductDto} from "@/app/interface/product/productDto";
import {Cart} from "@prisma/client";

export interface CartItemDto {
    id?: string
    quantity: number
    product: ProductDto
    cartId?: string | null
    cart?: Cart
    totalPrice: number
    productId: string
}


export interface CartItemDtoWithoutProduct {
    id?: string
    quantity: number
    cartId?: string | null
    cart?: Cart
    totalPrice: number
    productId: string
}