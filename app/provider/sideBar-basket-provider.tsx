"use client";
import React, {Context, createContext, ReactNode, useContext, useEffect, useRef, useState} from "react";
import {SideBarBasketContextType} from "@/app/interface/basket/sideBar-basket-context-type";
import {Sidebar} from "primereact/sidebar";
import {ProductDto} from "@/app/interface/product/productDto";
import {BasketDto} from "@/app/interface/basket/basketDto";
import {calculAndformatPriceWithDiscount, formatPriceEuro} from "@/app/pipe/format";
import BasketItem from "@/app/components/basket/basket-item";
import {useBasket} from "@/app/provider/basket-provider";
import {confirmDialog} from "primereact/confirmdialog";
import RoundedButton from "@/app/components/ui/rounded-button";

const localStorageBasket: string | null = localStorage.getItem('basketSnapAndShop')

export const SideBarBasketContext: Context<SideBarBasketContextType> = createContext<SideBarBasketContextType>({
    toggleBasketList: (): void => {
    },
    addProduct: (): void => {
    },
});

export const SideBarBasketProvider = ({children}: { children: ReactNode }) => {
    const {updateProductList} = useBasket();
    const [totalPriceBasket, setTotalPriceBasket] = useState<string | void>('0');
    const [visibility, setVisibility] = useState<boolean>(false);
    const [productBasketList, setProductBasketList] = useState<BasketDto[]>
    (localStorageBasket ? JSON.parse(localStorageBasket).basket : []);
    const renderCount = useRef(0);

    useEffect(() => {
        renderCount.current += 1;

        updateProductList(productBasketList).then((element) => {
            setTotalPriceBasket(element)
        });


    }, [productBasketList]);

    const toggleBasketList = (): void => {
        setVisibility(!visibility)
    }

    const getTotalPriceBasketLine = (product: ProductDto, quantity) => {
        const totalPrice: number = product.price * quantity
        return product.discount ? calculAndformatPriceWithDiscount(product.price, product.discount.rate, quantity) : formatPriceEuro(totalPrice)
    }

    const deleteProduct = (product: BasketDto, productInList: BasketDto, rejectQuantity: number) => {
        confirmDialog({
            message: <div>
                <p>Êtes vous sure de vouloir retirer {productInList.product.name} de votre panier?</p>
            </div>
            ,
            header: 'Suppression de produit',
            acceptLabel: 'Oui',
            rejectLabel: 'Non',
            rejectClassName: 'mr-2.5 p-1.5 text-redColor',
            acceptClassName: 'bg-actionColor text-white p-1.5',
            accept(): void {
                productInList.quantity = 0
                const filteredBasket = productBasketList.filter((element: BasketDto): boolean => element.product.id !== product.product.id)
                setProductBasketList(filteredBasket)
            },
            reject(): void {
                productInList.quantity = rejectQuantity;
            }
        })
    }

    const handleChangeQuantityProduct = (product: BasketDto, action: 'add' | 'remove' | 'delete') => {
        const indexProduct: number = productBasketList.findIndex((basketProduct: BasketDto) => basketProduct.product.id === product.product.id)
        const changeProduct = productBasketList[indexProduct]
        if (action === 'add') {
            changeProduct.quantity += 1;
        } else if (action === 'remove') {
            changeProduct.quantity -= 1;
            if (changeProduct.quantity < 1) {
                deleteProduct(product, changeProduct, 1)
            }
        } else if (action === 'delete') {
            deleteProduct(product, changeProduct, 0)
        }
        changeProduct.totalPrice = getTotalPriceBasketLine(changeProduct.product, changeProduct.quantity)
        setProductBasketList((prevProducts) =>
            prevProducts.map(p =>
                p.product.id === changeProduct.product.id ? changeProduct : p
            )
        );
    }
    const addProduct = (product: ProductDto, quantity: number): void => {

        if (!productBasketList.some((basketProduct: BasketDto) => basketProduct.product.id === product.id)) {
            const newProduct: BasketDto = {
                product,
                quantity,
                totalPrice: getTotalPriceBasketLine(product, quantity)
            }
            setProductBasketList(prevProductList => [...prevProductList, newProduct]);

        } else {
            const indexProduct: number = productBasketList.findIndex((basketProduct: BasketDto) => basketProduct.product.id === product.id)
            const changeProduct: BasketDto = productBasketList[indexProduct];
            changeProduct.quantity += quantity;
            changeProduct.totalPrice = getTotalPriceBasketLine(product, changeProduct.quantity)
            setProductBasketList((prevProducts) =>
                prevProducts.map(p =>
                    p.product.id === product.id ? changeProduct : p
                )
            );

        }
    }

    const goToDetailPanier = () => {
        console.log('detail panier')
    }

    return (
        <SideBarBasketContext.Provider value={{toggleBasketList, addProduct}}>
            <Sidebar visible={visibility}
                     position="right"
                     onHide={() => setVisibility(false)}
                     header={`Panier ${totalPriceBasket}€`}
                     blockScroll={true}
                     className="relative bg-primaryBackgroundColor"
            >
                <header className='sticky top-0 right-0 w-full h-20 border-b-actionColor border-b text-center bg-primaryBackgroundColor'>
                    <RoundedButton onClickAction={goToDetailPanier}
                                   message={'Voir le detail du panier'}
                                   classes={"border-actionColor text-actionColor"}/>
                </header>
                {productBasketList.length > 0 ? (
                    <div className="mt-2.5">
                        <div className="product-basket-height">
                            {productBasketList.map((basket: BasketDto) => (
                                <BasketItem
                                    key={basket.product.id}
                                    product={basket}
                                    updateProduct={handleChangeQuantityProduct}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
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
    const context: SideBarBasketContextType = useContext(SideBarBasketContext);
    if (!context) {
        throw new Error("useBasket doit être utilisé à l'intérieur de BasketProvider");
    }
    return context;
};