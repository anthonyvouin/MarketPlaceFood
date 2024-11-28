import {ProductDto} from "@/app/interface/product/productDto";

export interface SideBarBasketContextType {
    toggleBasketList: () => void;
    addProduct: (product: ProductDto, quantity: number) => Promise<void>
}