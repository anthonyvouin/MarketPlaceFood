"use client";
import React, {Context, createContext, ReactNode, useContext, useEffect, useRef, useState} from "react";
import {SideBarBasketContextType} from "@/app/interface/cart/sideBar-basket-context-type";
import {Sidebar} from "primereact/sidebar";
import {ProductDto} from "@/app/interface/product/productDto";
import {CartDto} from "@/app/interface/cart/cartDto";
import CartItemList from "@/app/components/cartItemList/cart-item-list";
import {useCart} from "@/app/provider/cart-provider";
import {confirmDialog} from "primereact/confirmdialog";
import RoundedButton from "@/app/components/ui/rounded-button";
import {CartItemDto} from "@/app/interface/cart/cart-item.dto";
import {createCart, createItemCartIfUserHaveCart, getClientCart, updateItemCart} from "@/app/services/cart/cart";
import {useSession} from "next-auth/react";
import {formatPriceEuro} from "@/app/pipe/formatPrice";
import {useRouter} from "next/navigation";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {addQuantityToProductInCart, removeQuantityToProductInCart} from "@/app/services/cart/functions-front";


export const SideBarBasketContext: Context<SideBarBasketContextType> = createContext<SideBarBasketContextType>({
    toggleBasketList: (): void => {
    },
    addProduct: async (): Promise<void> => {
        return Promise.resolve();
    },
    setSideBarCart: (): void => {
    },

    clientSideBartCart: null
});

export const SideBarBasketProvider = ({children}: { children: ReactNode }) => {
        const {data: session} = useSession();
        const defaultClientCart = {
            creationDate: new Date(),
            updatedAt: new Date(),
            userId: session ? session.user.id : '',
            isConvertedToOrder: false,
            cartItems: [],
            totalPrice: 0
        }
        const {updateProductList} = useCart();
        const [visibility, setVisibility] = useState<boolean>(false);
        const [clientCart, setClientCart] = useState<CartDto | null>(defaultClientCart);


        const renderCount = useRef(0);
        const router: AppRouterInstance = useRouter();


        useEffect(() => {
            renderCount.current += 1;
            if (session) {

                const fetchCart = async () => {
                    const clientCart: CartDto | null = await getClientCart(session.user.id);
                    if (clientCart) {
                        setClientCart(clientCart)
                    }

                };
                fetchCart()
            }
        }, [session]);

        useEffect(() => {
            updateProductList(clientCart ? clientCart.cartItems : null)
        }, [clientCart]);

        const toggleBasketList = (): void => {
            setVisibility(!visibility)
        }

        const setSideBarCart = (cart: CartDto | null) => {
            setClientCart(cart)
        }

        const deleteProduct = (cartItem: CartItemDto, rejectQuantity: number) => {
            confirmDialog({
                message: <div>
                    <p>Êtes vous sure de vouloir retirer {cartItem.product.name} de votre panier?</p>
                </div>
                ,
                header: 'Suppression de produit',
                acceptLabel: 'Oui',
                rejectLabel: 'Non',
                rejectClassName: 'mr-2.5 p-1.5 text-redColor',
                acceptClassName: 'bg-actionColor text-white p-1.5',
                async accept(): Promise<void> {
                    cartItem.quantity = 0
                    if (cartItem.cartId && cartItem.id) {
                        const changeProduct: CartDto = await updateItemCart(cartItem.id, 0, true)
                        setClientCart(changeProduct)
                        if (clientCart) {
                            updateProductList(clientCart.cartItems)
                        }

                    }
                },
                reject(): void {
                    cartItem.quantity = rejectQuantity;
                }
            })
        }

        const handleChangeQuantityProduct = async (changeItem: CartItemDto, action: 'add' | 'remove' | 'deleteProduct' = "add"): Promise<void> => {
            if (clientCart && clientCart.id) {
                let updateCart: CartDto;
                if (action === 'add') {
                    updateCart = await addQuantityToProductInCart(changeItem)
                } else if (action === 'remove') {

                    if (changeItem.quantity - 1 < 1) {
                        return deleteProduct(changeItem, 1);
                    } else {
                        updateCart = await removeQuantityToProductInCart(changeItem)
                    }

                } else if (action === 'deleteProduct') {
                    deleteProduct(changeItem, changeItem.quantity);
                    return
                }
                setClientCart(() => updateCart);
                updateProductList(clientCart.cartItems)
            }
        }


        const addProduct = async (product: ProductDto, quantity: number): Promise<void> => {
            if (session) {
                let itemExistInCard: boolean = false;
                if (clientCart) {
                    itemExistInCard = clientCart.cartItems.some((itemCard: CartItemDto) => {
                        if (itemCard.product) {
                            return itemCard.product.id === product.id
                        }
                        return false;
                    })
                }

                if (!clientCart) {
                    setClientCart(defaultClientCart)
                }
                if (product && clientCart && !itemExistInCard) {
                    if (clientCart.id) {
                        const newProduct: CartDto = await createItemCartIfUserHaveCart(product, clientCart.id, quantity);
                        setClientCart(() => (newProduct));
                    } else {
                        const cart: CartDto = await createCart(product, session.user.id)
                        setClientCart(cart)
                    }
                } else {
                    if (clientCart && clientCart.id) {
                        const indexProduct: number = clientCart.cartItems.findIndex((itemCart: CartItemDto) => itemCart.product.id === product.id)
                        const changeProduct: CartItemDto = clientCart.cartItems[indexProduct];
                        changeProduct.quantity += quantity;
                        if (changeProduct.id) {
                            const updatedItem: CartDto = await updateItemCart(changeProduct.id, changeProduct.quantity)
                            setClientCart(() => updatedItem);
                        }
                    }
                }
            }

        }


        const goToDetailPanier = () => {
            router.push('/recap-cart')
        }

        return (
            <SideBarBasketContext.Provider value={{toggleBasketList, addProduct, clientSideBartCart: clientCart, setSideBarCart}}>
                <Sidebar visible={visibility}
                         position="right"
                         onHide={() => setVisibility(false)}
                         header={`Panier ${formatPriceEuro(clientCart ? clientCart.totalPrice : 0)}€`}
                         blockScroll={true}
                         className="relative bg-primaryBackgroundColor"
                >
                    <header className='sticky top-2.5 right-0 w-full h-20 border-b-actionColor border-b text-center bg-primaryBackgroundColor'>
                        <RoundedButton
                            onClickAction={goToDetailPanier}
                            message={'Voir le detail du panier'}
                            classes={"border-actionColor text-actionColor"}/>
                    </header>
                    {clientCart && clientCart.cartItems.length > 0 ? (
                        <div className="mt-2.5">
                            <div className="product-basket-height">
                                {clientCart.cartItems.map((item: CartItemDto) => (
                                    <CartItemList
                                        key={item.product.id}
                                        product={item}
                                        updateProduct={handleChangeQuantityProduct}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="mt-4 text-center">Pas de produits dans le panier</p>

                        </div>
                    )}
                </Sidebar>
                {children}
            </SideBarBasketContext.Provider>
        );
    }
;

export const useSideBarBasket = () => {
    const context: SideBarBasketContextType = useContext(SideBarBasketContext);
    if (!context) {
        throw new Error("useBasket doit être utilisé à l'intérieur de CartProvider");
    }
    return context;
};