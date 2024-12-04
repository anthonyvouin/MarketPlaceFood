import {updateItemCart} from "@/app/services/cart/cart";
import {CartItemDto} from "@/app/interface/cart/cart-item.dto";
import {CartDto} from "@/app/interface/cart/cartDto";
import {formatPriceEuro} from "@/app/pipe/formatPrice";

export const addQuantityToProductInCart = (item: CartItemDto) => {
    item.quantity += 1;
    return updateItemCart(item.id, item.quantity)
}

export const removeQuantityToProductInCart = (item: CartItemDto) => {
    item.quantity -= 1;
    return updateItemCart(item.id, item.quantity)
}

export const calculeDifferenceBetweenTotalPriceAndTotalPriceWithoutDiscount = (item: CartDto): string | null => {

    if (item.cartItems.length > 0) {
        const totalWithoutDiscount: number = item.cartItems.reduce((acc: number, item: CartItemDto) => {
            if (item.quantity > 0) {
                acc += item.product.price * item.quantity;
            }
            return acc;
        }, 0);
        return formatPriceEuro(totalWithoutDiscount - item.totalPrice)
    }
    return null


}