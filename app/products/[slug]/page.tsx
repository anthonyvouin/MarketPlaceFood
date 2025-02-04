'use client';

import { getProductBySlug } from '@/app/services/products/product';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductDto } from '@/app/interface/product/productDto';
import Image from 'next/image';
import { formatPriceEuro } from '@/app/pipe/formatPrice';
import RoundedButton from '@/app/components/ui/rounded-button';
import NotFound from '@/app/not-found';
import { useSideBarBasket } from '@/app/provider/sideBar-cart-provider';
import { CartItemDto } from '@/app/interface/cart/cart-item.dto';

export default function Product() {
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [productInCart, setProductInCart] = useState<CartItemDto | null>(null);
  const { slug } = useParams() as { slug: string };
  const { clientSideBartCart, handleChangeQuantityProduct, addProduct, deleteProduct, setVisibilityFalse } = useSideBarBasket();
  const [loading, setLoading] = useState<boolean>(true);

  const getProductInCart = (): void => {
    const findProduct: CartItemDto | undefined = clientSideBartCart?.cartItems.find((e) => e.product.id === product?.id);
    if (findProduct !== undefined) {
      setProductInCart(findProduct);
    }
  };

  useEffect((): void => {
    const fetchProduct = async (): Promise<void> => {
      setVisibilityFalse();
      const findProduct: ProductDto | null = await getProductBySlug(slug);
      setProduct(findProduct);
      setLoading(false);
    };
    fetchProduct();
  }, [slug]);

  useEffect((): void => {
    getProductInCart();
  }, [product]);

  useEffect((): void => {
    getProductInCart();
  }, [clientSideBartCart]);

  return (
    <section className="bg-primaryBackgroundColor font-manrope min-h-screen w-full p-8">
      {product ? (
        <>
          <div className="flex flex-col h-full">
            <h1 className="font-bold text-3xl pt-10">Détails du produit</h1>
            <div className="mt-20 flex-col md:flex-row flex items-center justify-around">
              <Image unoptimized
                     src={product?.image ? product?.image : '/images/default-image.png'}
                     alt={product?.name ?? 'Product Image'}
                     width={100} height={100}
                     className="mb-8 md:mb-0 w-[300px]"
              />
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <h2>{product?.name}</h2>
                    <p>{product?.description}</p>
                  </div>
                  {product?.price && <p className="font-semibold">{formatPriceEuro(product?.price)} €</p>}

                </div>
                <hr className="border-2 border-black rounded-full"/>
                <div className="flex flex-col gap-3 rounded-md">
                  <h1 className="font-bold text-xl">Catégorie</h1>
                  <p>{product?.category?.name}</p>
                </div>

                <div>
                  {productInCart && productInCart.quantity > 0 ? (
                    <div className="flex items-center mt-2.5">
                      <div className="bg-white w-10 h-10 flex items-center justify-center border border-t-borderGrey border-l-borderGrey border-b-borderGrey">
                        <p>
                          {productInCart.quantity}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <button onClick={() => handleChangeQuantityProduct(productInCart, 'add')}
                                className="bg-grey text-white border border-borderGrey w-7 h-5 pi pi-angle-up">

                        </button>
                        <button onClick={() => handleChangeQuantityProduct(productInCart, 'remove')}
                                className="bg-grey text-white border border-borderGrey w-7 h-5 pi pi-angle-down">
                        </button>

                      </div>
                      <button className="w-7 h-7 ml-2.5 pi pi-trash text-primaryColor text-lg"
                              onClick={() => deleteProduct(productInCart, productInCart?.quantity)}></button>
                    </div>
                  ) : (

                    <RoundedButton onClickAction={() => addProduct(product, 1)}
                                   message="Ajouter au panier"
                                   positionIcon="right"
                                   icon="pi-plus"
                                   classes="bg-actionColor text-white p-2.5">
                    </RoundedButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (

        <>
          {loading ? (
            <p>Chargement du produit</p>
          ) : (
            <>
              <NotFound/>
            </>

          )}

        </>
      )}
    </section>
  );
}