import { Decimal } from "@prisma/client/runtime/library";

export const formatPrice = (price: number | Decimal | string): string => {
    if(typeof price === 'string'){
        price = Number(price)
    }

    return price.toFixed(2).replace('.', ',');
}