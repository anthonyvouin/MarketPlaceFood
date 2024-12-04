import {ProductDto} from "@/app/interface/product/productDto";
import {CartDto} from "@/app/interface/cart/cartDto";

export interface SideBarBasketContextType {
    toggleBasketList: () => void;
    addProduct: (product: ProductDto, quantity: number) => Promise<void>
    setSideBarCart: (cart: CartDto | null) => void;
    clientSideBartCart: CartDto | null
}