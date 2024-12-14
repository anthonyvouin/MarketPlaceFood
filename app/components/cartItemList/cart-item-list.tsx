import Image from 'next/image';
import {CartItemProps} from "@/app/interface/cart/cart-item-props";
import React from "react";
import {calculAndformatPriceWithDiscount, formatPriceEuro} from "@/app/pipe/formatPrice";
import Link from "next/link";

const CartItemList = ({product, updateProduct}: CartItemProps) => {
    return (
        <div className="border-b border-actionColor p-2.5">
            <div className="flex items-center">
                <Link href={`/products/${product.product.slug}`}>
                    <Image
                        src={product.product.image}
                        alt={product.product.name}
                        width={50}
                        height={50}
                        className="object-contain max-w-[50px] max-h-[50px] mr-2.5"
                    />
                </Link>
                <div className="flex flex-col w-full">
                    <div className="flex justify-between w-full">
                        <Link href={`/products/${product.product.slug}`}>
                            <p className="max-w-[110px] text-xs font-bold">
                                {product.product.name}
                            </p>
                        </Link>
                        <div>
                            <p className="text-xs">{formatPriceEuro(product.totalPrice)}€</p>
                            <p className="text-xs">{product.product.discount ? calculAndformatPriceWithDiscount(product.product.price, product.product.discount.rate) : formatPriceEuro(product.product.price)}€
                                /U</p>
                        </div>

                    </div>
                    <div className='flex items-center mt-2.5'>
                        <div className='bg-white w-10 h-10 flex items-center justify-center border border-t-borderGrey border-l-borderGrey border-b-borderGrey'>
                            <p>
                                {product.quantity}
                            </p>
                        </div>
                        <div className='flex flex-col'>
                            <button onClick={() => updateProduct(product, 'add')}
                                    className="bg-grey text-white border border-borderGrey w-7 h-5 pi pi-angle-up">

                            </button>
                            <button onClick={() => updateProduct(product, 'remove')}
                                    className='bg-grey text-white border border-borderGrey w-7 h-5 pi pi-angle-down'>
                            </button>

                        </div>
                        <button className="w-7 h-7 ml-2.5 pi pi-trash text-primaryColor text-xs"
                                onClick={() => updateProduct(product, 'deleteProduct')}></button>
                    </div>
                    <br/>

                </div>
            </div>
        </div>
    );
};

export default CartItemList;
