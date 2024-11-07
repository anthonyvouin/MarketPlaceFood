"use client";
import {Context, createContext, ReactNode, useContext, useState} from "react";
import {BasketContextType} from "@/app/interface/basket/basket-context-type";

export const BasketContext: Context<BasketContextType> = createContext<BasketContextType>({
    basketLength: 0,
    updateProductList: (): void => {
    },
});

export const BasketProvider = ({children}: { children: ReactNode }) => {
    const [basketLength, setBasketLength] = useState(5);

    const updateProductList = () => {
        console.log('cliqué')
        setBasketLength(6)
    }

    return (
        <BasketContext.Provider value={{basketLength, updateProductList}}>
            {children}
        </BasketContext.Provider>
    );
};

export const useBasket = () => {
    const context:BasketContextType = useContext(BasketContext);
    if (!context) {
        throw new Error("useBasket doit être utilisé à l'intérieur de BasketProvider");
    }
    return context;
};