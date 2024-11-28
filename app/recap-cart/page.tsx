"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getClientCart } from "@/app/services/cart/cart";
import { formatPriceEuro } from "@/app/pipe/formatPrice";
import { CartDto } from "@/app/interface/cart/cartDto";
import { CartItemDto } from "@/app/interface/cart/cart-item.dto";

export default function RecapCart() {
    const { data: session } = useSession();
    const [cart, setCart] = useState<CartDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (session?.user?.id) {
            const fetchCart = async () => {
                setLoading(true);
                try {
                    const userCart = await getClientCart(session.user.id);
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

    if (loading) {
        return (
            <div className="h-[85vh] flex items-center justify-center bg-primaryBackgroundColor">
                <p className="text-lg font-semibold text-gray-700">Chargement du panier...</p>
            </div>
        );
    }

    if (!cart || cart.cartItems.length === 0) {
        return (
            <div className="h-[85vh] flex items-center justify-center bg-primaryBackgroundColor">
                <p className="text-lg font-semibold text-gray-700">Votre panier est vide.</p>
            </div>
        );
    }

    return (
        <div className="h-[85vh] bg-primaryBackgroundColor  flex items-center justify-center ">
            <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 md:p-10">
                <h1 className="text-2xl font-bold text-darkActionColor mb-6">Récapitulatif de votre panier</h1>

                <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-6">
                    <p className="text-lg font-semibold text-gray-600">
                        Total : <span className="text-actionColor">{formatPriceEuro(cart.totalPrice)}€</span>
                    </p>
                    <button
                        className="bg-actionColor hover:bg-darkActionColor text-white font-semibold py-2 px-6 rounded-lg shadow-md transition ease-in-out duration-150"
                        onClick={() => alert("Passer commande")}
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
                                <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-16 h-16 object-cover rounded-md"
                                />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-700">{item.product.name}</p>
                                <p className="text-xs text-gray-500">{formatPriceEuro(item.product.price)}€ / unité</p>
                            </div>

                            <div className="text-center">
                                <p className="font-medium text-gray-700">Quantité : {item.quantity}</p>
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
