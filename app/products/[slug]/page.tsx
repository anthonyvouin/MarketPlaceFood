"use client";

import {getProductBySlug} from "@/app/services/products/product";
import {useEffect, useState} from "react";
import {useParams, useRouter} from 'next/navigation'
import {ProductDto} from "@/app/interface/product/productDto";
import Image from "next/image";
import {formatPrice} from "@/app/pipe/format";
import {Button} from "primereact/button";

export default function Product() {
    const [product, setProduct] = useState<ProductDto | null>(null);
    const {slug} = useParams() as { slug: string };
    const router = useRouter();

    useEffect((): void => {
        const fetchProduct = async () => {
            const product = await getProductBySlug(slug);
            return setProduct(product);
        }
        fetchProduct();
    }, [slug]);

    return (
        <section className="bg-primaryBackgroundColor font-manrope h-[85vh] w-full px-40">
            <div className="flex flex-col h-full">
                <div className="flex flex-col gap-5">
                    <div className="flex gap-5">
                        <Button className="hover:cursor-pointer" label="Accueil" onClick={() => router.push('/')}/>
                        <Button className="hover:cursor-pointer" label="Retour" onClick={() => router.back()}/>
                    </div>
                    <h1 className="font-bold text-3xl pt-10">Détails du produit</h1>
                </div>
                <div className="mt-20 flex items-center justify-around">
                    <Image src={product?.image ? product?.image : "/images/default-image.png"} alt={product?.name ?? 'Product Image'} width={100} height={100}/>
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <h2>{product?.name}</h2>
                                <p>{product?.description}</p>
                            </div>
                            {product?.price && <p className="font-semibold">{formatPrice(product?.price)} €</p>}

                        </div>
                        <hr className="border-2 border-black rounded-full"/>
                        <div className="flex flex-col gap-3 rounded-md">
                            <h1 className="font-bold text-xl">Catégorie</h1>
                            <p>{product?.category?.name}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}