"use client";

import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {getClientCart, updateItemCart} from "@/app/services/cart/cart";
import {calculAndformatPriceWithDiscount, formatPriceEuro} from "@/app/pipe/formatPrice";
import {CartDto} from "@/app/interface/cart/cartDto";
import {CartItemDto} from "@/app/interface/cart/cart-item.dto";
import {useRouter} from "next/navigation";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {addQuantityToProductInCart, calculeDifferenceBetweenTotalPriceAndTotalPriceWithoutDiscount, removeQuantityToProductInCart} from "@/app/services/cart/functions-front";
import {confirmDialog} from "primereact/confirmdialog";
import {useCart} from "@/app/provider/cart-provider";
import {useSideBarBasket} from "@/app/provider/sideBar-cart-provider";
import Image from "next/image";
import {Tag} from "primereact/tag";

export default function RecapCart() {
    const {data: session} = useSession();
    const [cart, setCart] = useState<CartDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalDiscount, setTotalDiscount] = useState<string | null>(null)
    const router: AppRouterInstance = useRouter();
    const {updateProductList} = useCart();
    const {setSideBarCart, clientSideBartCart} = useSideBarBasket();

    const goToPayment = () => {
        router.push('/payment')
    }

    useEffect(() => {
        if (session?.user?.id) {
            const fetchCart = async (): Promise<void> => {
                setLoading(true);
                try {
                    const userCart: CartDto | null = await getClientCart(session.user.id);
                    setCart(userCart);
                } catch (error) {
                    console.error("Erreur lors de la récupération du panier :", error);
                    setCart(null);
                } finally {
                    setLoading(false);
                }
            };

            fetchCart();
        }
    }, [session]);

    useEffect(() => {
        setCart(clientSideBartCart);
        if (clientSideBartCart) {
            setTotalDiscount(calculeDifferenceBetweenTotalPriceAndTotalPriceWithoutDiscount(clientSideBartCart))
        }
    }, [clientSideBartCart]);

    useEffect(() => {
        if (cart) {
            updateProductList(cart.cartItems);
            setSideBarCart(cart);
            setTotalDiscount(calculeDifferenceBetweenTotalPriceAndTotalPriceWithoutDiscount(cart))
        }
    }, [cart]);

    const deleteProduct = (cartItem: CartItemDto, rejectQuantity: number): void => {
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
                    const changeProduct: CartDto = await updateItemCart(cartItem.id, 0, true);
                    setCart(changeProduct);
                }
            },
            reject(): void {
                cartItem.quantity = rejectQuantity;
            }
        })

    }

    const addProduct = async (item: CartItemDto): Promise<void> => {
        const cartChange: CartDto = await addQuantityToProductInCart(item);
        setCart(cartChange);
    }

    const removeProduct = async (item: CartItemDto): Promise<void> => {
        if (item.quantity - 1 < 1) {
            return deleteProduct(item, 1);
        } else {
            const cartChange: CartDto = await removeQuantityToProductInCart(item);
            setCart(cartChange);
        }
    }

    if (loading) {
        return (
            <div className="h-[84vh] flex items-center justify-center bg-primaryBackgroundColor">
                <p className="text-lg font-semibold text-gray-700">Chargement du panier...</p>
            </div>
        );
    }

    if (!cart || cart.cartItems.length === 0) {
        return (
            <div className="h-[84vh] flex items-center justify-center bg-primaryBackgroundColor">
                <p className="text-lg font-semibold text-gray-700">Votre panier est vide.</p>
            </div>
        );
    }

    return (
        <div className="h-[84vh] bg-primaryBackgroundColor  flex items-center justify-center ">
            <div className="w-full max-w-[90%] bg-white shadow-md rounded-lg p-6 md:p-10">
                <h1 className="text-2xl font-bold text-darkActionColor mb-6">Récapitulatif de votre panier</h1>

                <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-6">
                    <div className="flex items-center">
                        <p className="text-lg font-semibold text-gray-600 mr-4">
                            Total : <span>{formatPriceEuro(cart.totalPrice)}€</span>
                        </p>
                        {totalDiscount ? (
                            <>
                                <p>|</p>
                                <p className='ml-4 '><span className="text-actionColor font-semibold">{totalDiscount}€</span> d'économisé</p>
                            </>
                        ) : ('')}

                    </div>

                    <button
                        className="bg-actionColor hover:bg-darkActionColor text-white font-semibold py-2 px-6 rounded-lg shadow-md transition ease-in-out duration-150"
                        onClick={goToPayment}
                    >
                        Passer commande
                    </button>
                </div>

                <div className="space-y-4">
                    {cart.cartItems.map((item: CartItemDto) => (
                        <div
                            key={item.product.id}
                            className="grid grid-cols-4 items-center gap-4 p-4 bg-gray-50 rounded-lg shadow-sm"
                        >
                            <div className="flex justify-center">
                                <Image
                                    src={item.product.image}
                                    alt={item.product.name}
                                    width={40} height={40}
                                    className="w-16 h-16 object-contain rounded-md"
                                />
                            </div>

                            <div>

                                <p className="text-sm font-medium text-gray-700">{item.product.name}</p>
                                {item.product.discount ? (
                                    <div>
                                        <div className='flex items-center mb-1'>
                                            <p className="text-xs text-gray-500">{formatPriceEuro(item.product.price)} €</p>
                                            <Tag className='bg-actionColor ml-2.5'
                                                 value={'Remise ' + item.product.discount.rate + '%'}></Tag>
                                        </div>


                                        <p className="text-xs text-gray-500">{calculAndformatPriceWithDiscount(item.product.price, item.product.discount.rate)}€ /U</p>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-500">{formatPriceEuro(item.product.price)} €</p>
                                )}


                            </div>

                            <div className="text-center">
                                <p className="font-medium text-gray-700">Quantité : {item.quantity}</p>
                                <button className='border p-2.5' onClick={() => addProduct(item)}>+</button>
                                <button className='border p-2.5' onClick={() => removeProduct(item)}>-</button>
                            </div>

                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-700">
                                    {formatPriceEuro(item.totalPrice)}€
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
