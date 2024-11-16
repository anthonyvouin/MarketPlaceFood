import {BasketDto} from "@/app/interface/basket/basketDto";

export interface BasketContextType {
    basketState: { basket: BasketDto[], total: number },
    updateProductList: (basket: BasketDto[]) => Promise<string | void>
}