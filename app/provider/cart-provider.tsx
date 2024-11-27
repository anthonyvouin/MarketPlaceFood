"use client";
import {Context, createContext, ReactNode, useContext, useEffect, useState} from "react";
import {CartContextType} from "@/app/interface/cart/cart-context-type";
import {useSession} from "next-auth/react";
import {getTotalLengthItemsCart} from "@/app/services/cart/cart";
import {CartItemDto} from "@/app/interface/cart/cart-item.dto";

export const CartContext: Context<CartContextType> = createContext<CartContextType>({
    totalLengthItems: 0,
    updateProductList: (): void => {
    }
});

export const CartProvider = ({children}: { children: ReactNode }) => {
    const {data: session, status} = useSession();
    const [totalLengthItems, setTotalLengthItems] = useState<number>(0);

    useEffect(() => {
        if (session) {
            const fetchCart = async (): Promise<void> => {
                const lengthCart: number = await getTotalLengthItemsCart(session.user.id)
                setTotalLengthItems(lengthCart);
            };

            fetchCart();
        }
    }, [session]);

    const updateProductList = (itemCartList: CartItemDto[]): void => {
        const totalProduct: number = itemCartList.reduce((acc: number, item: CartItemDto) => {
            if (item.quantity > 0) {
                acc += item.quantity;
            }
            return acc;
        }, 0);
        setTotalLengthItems(totalProduct)
    }

    return (
        <CartContext.Provider value={{totalLengthItems: totalLengthItems, updateProductList}}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context: CartContextType = useContext(CartContext);
    if (!context) {
        throw new Error("useCart doit être utilisé à l'intérieur de CartProvider");
    }
    return context;
};