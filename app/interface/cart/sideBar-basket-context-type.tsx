import {ProductDto} from "@/app/interface/product/productDto";
import {CartDto} from "@/app/interface/cart/cartDto";
import {CartItemDto} from "@/app/interface/cart/cart-item.dto";

export interface SideBarBasketContextType {
    toggleBasketList: () => void;
    addProduct: (product: ProductDto, quantity: number) => Promise<void>
    setSideBarCart: (cart: CartDto | null) => void;
    setVisibilityFalse: () => void,
    clientSideBartCart: CartDto | null,
    handleChangeQuantityProduct: (changeItem: CartItemDto, action: 'add' | 'remove' | 'deleteProduct') => Promise<void>
    deleteProduct: (cartItem: CartItemDto, rejectQuantity: number) => void
}