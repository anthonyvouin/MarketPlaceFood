import Image from 'next/image';
import {BasketItemProps} from "@/app/interface/basket/basket-item-props";
import React from "react";
import {calculAndformatPriceWithDiscount, formatPriceEuro} from "@/app/pipe/format";

const BasketItem = ({product, updateProduct}: BasketItemProps) => {
    return (
        <div className="border-b border-actionColor p-2.5">
            <div className="flex items-center">
                <Image
                    src={product.product.image}
                    alt={product.product.name}
                    width={50}
                    height={50}
                    className="object-contain max-w-[50px] max-h-[50px] mr-2.5"
                />
                <div className="flex flex-col w-full">
                    <div className="flex justify-between w-full">
                        <p className="max-w-[110px] text-xs font-bold">{product.product.name}</p>
                        <div>
                            <p className="text-xs">{product.totalPrice}€</p>
                            <p className="text-xs">{product.product.discount ? calculAndformatPriceWithDiscount(product.product.price, product.product.discount.rate) : formatPriceEuro(product.product.price)}€
                                /U</p>
                        </div>

                    </div>
                    <div className="mt-2.5">
                        <button className="text-primaryColor border-primaryColor border w-7 h-7 rounded mr-2.5"
                                onClick={() => updateProduct(product, 'remove')}
                                disabled={product.quantity === 0}>-
                        </button>
                        <span>{product.quantity}</span>
                        <button className="text-actionColor border-actionColor border w-7 h-7 rounded ml-2.5"
                                onClick={() => updateProduct(product, 'add')}>+
                        </button>
                        <button className="w-7 h-7 ml-2.5 pi pi-trash text-primaryColor text-xs"
                                onClick={() => updateProduct(product, 'delete')}></button>
                    </div>

                    <br/>

                </div>
            </div>
        </div>
    );
};

export default BasketItem;
