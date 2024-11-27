import {CartItemDto} from "@/app/interface/cart/cart-item.dto";

export interface CartItemProps {
    product: CartItemDto;
    updateProduct: (product: CartItemDto, action: 'add' | 'remove' | 'deleteProduct') => Promise<void>
}