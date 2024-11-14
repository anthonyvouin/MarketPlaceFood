import {BasketDto} from "@/app/interface/basket/basketDto";

export interface BasketItemProps {
    product: BasketDto;
    updateProduct: (product: BasketDto, action: 'add' | 'remove' | 'delete') => void
}