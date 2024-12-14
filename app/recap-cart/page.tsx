"use client";

import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {getClientCart} from "@/app/services/cart/cart";
import {calculAndformatPriceWithDiscount, formatPriceEuro} from "@/app/pipe/formatPrice";
import {CartDto} from "@/app/interface/cart/cartDto";
import {CartItemDto} from "@/app/interface/cart/cart-item.dto";
import {useRouter} from "next/navigation";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {calculeDifferenceBetweenTotalPriceAndTotalPriceWithoutDiscount} from "@/app/services/cart/functions-front";
import {useCart} from "@/app/provider/cart-provider";
import {useSideBarBasket} from "@/app/provider/sideBar-cart-provider";
import Image from "next/image";
import {Tag} from "primereact/tag";
import Link from "next/link";

export default function RecapCart() {
    const {data: session} = useSession();
    const [cart, setCart] = useState<CartDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalDiscount, setTotalDiscount] = useState<string | null>(null)
    const router: AppRouterInstance = useRouter();
    const {updateProductList} = useCart();
    const {setSideBarCart, clientSideBartCart, deleteProduct, handleChangeQuantityProduct} = useSideBarBasket();

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
                                <Link href={`/products/${item.product.slug}`}>
                                    <Image
                                        src={item.product.image}
                                        alt={item.product.name}
                                        width={40} height={40}
                                        className="w-16 h-16 object-contain rounded-md"
                                    />
                                </Link>

                            </div>

                            <div>
                                <Link href={`/products/${item.product.slug}`}>
                                    <p className="text-sm font-medium text-gray-700">{item.product.name}</p>
                                </Link>
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

                            <div className='flex items-center mt-2.5'>
                                <div className='bg-white w-10 h-10 flex items-center justify-center border border-t-borderGrey border-l-borderGrey border-b-borderGrey'>
                                    <p>
                                        {item.quantity}
                                    </p>
                                </div>
                                <div className='flex flex-col'>
                                    <button onClick={() => handleChangeQuantityProduct(item, 'add')}
                                            className="bg-grey text-white border border-borderGrey w-7 h-5 pi pi-angle-up">

                                    </button>
                                    <button onClick={() => handleChangeQuantityProduct(item, 'remove')}
                                            className='bg-grey text-white border border-borderGrey w-7 h-5 pi pi-angle-down'>
                                    </button>

                                </div>
                                <button className="w-7 h-7 ml-2.5 pi pi-trash text-primaryColor"
                                        onClick={() => deleteProduct(item, item.quantity)}></button>
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
