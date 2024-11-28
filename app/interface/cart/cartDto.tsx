
import {CartItemDto} from "@/app/interface/cart/cart-item.dto";

export interface CartDto {
    id? :string
    creationDate: Date
    updatedAt: Date
    userId: string
    isConvertedToOrder:boolean
    cartItems:CartItemDto[]
    totalPrice: number
}