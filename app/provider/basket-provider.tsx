"use client";
import {Context, createContext, ReactNode, useContext, useEffect, useState} from "react";
import {BasketContextType} from "@/app/interface/basket/basket-context-type";
import {BasketDto} from "@/app/interface/basket/basketDto";

const localStorageBasket: string | null = localStorage.getItem('basketSnapAndShop')

export const BasketContext: Context<BasketContextType> = createContext<BasketContextType>({
    basketState: localStorageBasket ? JSON.parse(localStorageBasket) : null,
    updateProductList: async (basket: BasketDto[]): Promise<string | void> => {
        return;
    }
});

export const BasketProvider = ({children}: { children: ReactNode }) => {
    const [basketState, setBasketState] = useState<{ basket: BasketDto[], total: number, totalPrice: number }>({
        basket: localStorageBasket ? JSON.parse(localStorageBasket).basket : [],
        total: localStorageBasket ? JSON.parse(localStorageBasket).total : 0,
        totalPrice: localStorageBasket ? JSON.parse(localStorageBasket).totalPrice : 0,
    });

    useEffect(() => {
        localStorage.setItem('basketSnapAndShop', JSON.stringify(basketState))
    }, [basketState]);

    const updateTotalPriceBasket = async (basket: BasketDto[]): Promise<number> => {
        return basket.reduce((acc: number, item: BasketDto) => acc + Number(item.totalPrice), 0);

    }

    const updateProductList = async (basket: BasketDto[]): Promise<string | void> => {
        const total: number = basket.reduce((acc, item) => acc + item.quantity, 0);
        const totalPrice: number = await updateTotalPriceBasket(basket)
        setBasketState({basket, total, totalPrice})
        return totalPrice.toFixed(2)
    }

    return (
        <BasketContext.Provider value={{basketState, updateProductList}}>
            {children}
        </BasketContext.Provider>
    );
};

export const useBasket = () => {
    const context: BasketContextType = useContext(BasketContext);
    if (!context) {
        throw new Error("useBasket doit être utilisé à l'intérieur de BasketProvider");
    }
    return context;
};