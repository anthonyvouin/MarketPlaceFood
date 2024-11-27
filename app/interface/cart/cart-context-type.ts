import {CartItemDto} from "@/app/interface/cart/cart-item.dto";

export interface CartContextType {
    totalLengthItems: number,
    updateProductList: (items: CartItemDto[])=> void;
}