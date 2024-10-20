'use client';

import {useEffect, useState} from "react";
import ProductCard from "./components/ProductCard";
import {ProductDto} from "@/app/interface/product/productDto";
import {getAllProducts} from "@/app/services/products/product";
import {generateRecipes} from "./services/ia-integration/ia";
import {getPageName} from "@/app/utils/utils";

export default function Home() {

    const [products, setProducts] = useState<ProductDto[]>([]);

    useEffect((): void => {
        const fetchProducts = async (): Promise<void> => {
            const products: ProductDto[] = await getAllProducts()
            return setProducts(products);
        }
        getPageName();
        fetchProducts();
    }, []);

    const callGenerateRecipes = async (): Promise<void> => {
        const recipes = await generateRecipes();
        console.log(recipes);
    }


    const bgColors: string[] = ['bg-tertiaryColorPink', 'bg-tertiaryColorOrange', 'bg-tertiaryColorBlue', 'bg-tertiaryColorPurple'];
    return (
        <div className="w-full bg-primaryBackgroundColor min-h-[85vh]">
            <section className="h-[85vh]">
                <div className="w-full h-full bg-primaryBackgroundColor">
                    <div className="flex flex-col justify-center items-center h-full">
                        <h1 className="font-manrope font-bold text-5xl text-gray-900">Bienvenue sur notre site</h1>
                        <p className="font-manrope font-light text-2xl text-gray-900">L'IA c'est trop bien</p>
                        <button onClick={callGenerateRecipes}>Générer des recettes</button>
                    </div>
                </div>
            </section>
            <section className="px-20 py-10 w-full">
                <div className="mb-10 flex flex-col gap-2">
                    <h2 className="font-manrope font-bold text-2xl text-gray-900">Notre sélection de produit</h2>
                    <hr className="border-2 w-40 border-gray-900 rounded-full"/>
                </div>

                <div className="grid grid-cols-4 gap-10 ">
                    {products.map((product, index) => (
                        <ProductCard productSlug={product.slug} key={product.id} product={product} bgColor={bgColors[index % bgColors.length]}/>
                    ))}
                </div>
            </section>
        </div>
    );
}
