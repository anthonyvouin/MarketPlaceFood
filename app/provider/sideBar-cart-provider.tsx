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


export const SideBarBasketContext: Context<SideBarBasketContextType> = createContext<SideBarBasketContextType>({
    toggleBasketList: (): void => {
    },
    addProduct: async (): Promise<void> => {
        return Promise.resolve();
    },
});

export const SideBarBasketProvider = ({children}: { children: ReactNode }) => {
    const {updateProductList} = useCart();
    const {data: session, status} = useSession();
    const [visibility, setVisibility] = useState<boolean>(false);
    const [clientCart, setClientCart] = useState<CartDto>({
        creationDate: new Date(),
        updatedAt: new Date(),
        userId: session ? session.user.id : '',
        isConvertedToOrder: false,
        cartItems: [],
        totalPrice: 0
    });
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
        updateProductList(clientCart.cartItems)
    }, [clientCart]);

    const toggleBasketList = (): void => {
        setVisibility(!visibility)
    }

    const deleteProduct = (product: CartItemDto, productInList: CartItemDto, rejectQuantity: number) => {
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
            async accept(): Promise<void> {
                productInList.quantity = 0
                if (product.cartId) {
                    const changeProduct: CartDto = await updateItemCart(product, product.cartId, true)
                    setClientCart(changeProduct)
                    updateProductList(clientCart.cartItems)
                }
            },
            reject(): void {
                productInList.quantity = rejectQuantity;
            }
        })
    }

   const handleChangeQuantityProduct = async (ChangeItem: CartItemDto, action: 'add' | 'remove' | 'deleteProduct' = "add"): Promise<void> => {
        if (clientCart && clientCart.id) {
            const indexItem: number = clientCart.cartItems.findIndex((itemInCartCart: CartItemDto) => itemInCartCart.product && (itemInCartCart.product.id === ChangeItem.product.id))

            if (indexItem !== -1) {
                const findItem: CartItemDto | null = clientCart.cartItems[indexItem]
                let updatedItem: CartDto;

                if (action === 'add') {
                    findItem.quantity += 1;
                    updatedItem = await updateItemCart(findItem, clientCart.id)
                } else if (action === 'remove') {
                    findItem.quantity -= 1;
                    if (findItem.quantity < 1) {
                        deleteProduct(ChangeItem, findItem, 1)
                        return
                    }
                    updatedItem = await updateItemCart(findItem, clientCart.id)
                } else if (action === 'deleteProduct') {
                    deleteProduct(ChangeItem, findItem, findItem.quantity)
                }

                if (action !== 'deleteProduct' && findItem.quantity !== 0) {
                    setClientCart(() => updatedItem);
                    updateProductList(clientCart.cartItems)
                }
            }
        }
    }
    
    const addProduct = async (product: ProductDto, quantity: number): Promise<void> => {
        if (session) {
            const itemExistInCard: boolean = clientCart.cartItems.some((itemCard: CartItemDto) => {
                if (itemCard.product) {
                    return itemCard.product.id === product.id
                }
                return false;
            })

            if (product && clientCart && !itemExistInCard) {
                if (clientCart.id) {
                    const newProduct: CartItemDto = await createItemCartIfUserHaveCart(product, clientCart.id, quantity);
                    const listItem: CartItemDto[] = clientCart.cartItems
                    listItem.push(newProduct)
                    setClientCart((prevCart) => ({
                        ...prevCart,
                        cartItems: listItem,
                    }));
                } else {
                    const cart: CartDto = await createCart(product, session.user.id)
                    setClientCart(cart)
                }
            } else {
                if (clientCart.id) {
                    const indexProduct: number = clientCart.cartItems.findIndex((itemCart: CartItemDto) => itemCart.product.id === product.id)
                    const changeProduct: CartItemDto = clientCart.cartItems[indexProduct];
                    changeProduct.quantity += quantity;
                    const updatedItem: CartDto = await updateItemCart(changeProduct, clientCart.id)
                    setClientCart(() => updatedItem);
                }
            }
        }

    }



    const goToDetailPanier = () => {
        router.push('/recap-cart')
    }

    return (
        <SideBarBasketContext.Provider value={{toggleBasketList, addProduct}}>
            <Sidebar visible={visibility}
                     position="right"
                     onHide={() => setVisibility(false)}
                     header={`Panier ${formatPriceEuro(clientCart.totalPrice)}€`}
                     blockScroll={true}
                     className="relative bg-primaryBackgroundColor"
            >
                <header className='sticky top-0 right-0 w-full h-20 border-b-actionColor border-b text-center bg-primaryBackgroundColor'>
                    <RoundedButton 
                                    
                                    onClickAction={goToDetailPanier}
                                   message={'Voir le detail du panier'}
                                   classes={"border-actionColor text-actionColor"}/>
                </header>
                {clientCart.cartItems.length > 0 ? (
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
        throw new Error("useBasket doit être utilisé à l'intérieur de CartProvider");
    }
    return context;
};