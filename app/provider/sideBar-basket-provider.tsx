"use client";
import React, {Context, createContext, ReactNode, useContext, useState} from "react";
import {SideBarBasketContextType} from "@/app/interface/basket/sideBar-basket-context-type";
import {Sidebar} from "primereact/sidebar";
import {ProductDto} from "@/app/interface/product/productDto";
import {BasketDto} from "@/app/interface/basket/basketDto";
import {ContactDto} from "@/app/interface/contact/contactDto";
import Image from "next/image";

export const SideBarBasketContext: Context<SideBarBasketContextType> = createContext<SideBarBasketContextType>({
    toggleBasketList: (): void => {
    },
    addProduct: (product, quantity): void => {
    },
});

export const SideBarBasketProvider = ({children}: { children: ReactNode }) => {
    const [visibility, setVisibility] = useState<boolean>(false);
    const [productList, setProductList] = useState<BasketDto[]>([]);

    const toggleBasketList = (): void => {
        setVisibility(!visibility)
    }

    const addProduct = (product: ProductDto, quantity: number): void => {
        setVisibility(true)
        const newProduct: BasketDto = {
            product,
            quantity,
            totalPrice: Number(product.price) * quantity
        }
        setProductList(prevProductList => [...prevProductList, newProduct])
    }

    return (
        <SideBarBasketContext.Provider value={{toggleBasketList, addProduct}}>
            <Sidebar visible={visibility}
                     position="right"
                     onHide={() => setVisibility(false)}
                     header="Panier"
            >
                {productList.length > 0 ? productList.map((product: BasketDto) => (
                    <div key={product.product.id} className="border-b border-actionColor">
                        <div className="flex">
                            <Image
                                src={product.product.image}
                                alt={product.product.name}
                                width={150}
                                height={150}
                                className="object-contain max-w-[150px] max-h-32"
                            />
                            <div className="flex flex-col">
                                <div className="flex justify-between">
                                    <p>{product.product.name}</p>
                                    <p>{product.totalPrice}</p>
                                </div>
                                <div>
                                    <button>-</button>
                                    <span>{product.quantity}</span>
                                    <button>+</button>
                                </div>

                                <br/>
                                <button>Delete</button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div>
                        <p>Pas de produits</p>
                    </div>
                )}
            </Sidebar>
            {children}
        </SideBarBasketContext.Provider>
    );
};

export const useSideBarBasket = () => {
    console.warn('hello')
    const context: SideBarBasketContextType = useContext(SideBarBasketContext);
    if (!context) {
        throw new Error("useBasket doit être utilisé à l'intérieur de BasketProvider");
    }
    return context;
};