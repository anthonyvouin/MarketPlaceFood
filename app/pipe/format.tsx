import Decimal = Prisma.Decimal;
import {Prisma} from "@prisma/client";

export const formatPrice = (price: number | Decimal): string => {
    return price.toFixed(2).replace('.', ',');
}