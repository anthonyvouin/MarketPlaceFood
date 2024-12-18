'use client';

import {useEffect, useState} from "react";
import {ProductDto} from "@/app/interface/product/productDto";
import {generateRecipes} from "./services/ia-integration/ia";
import {getPageName} from "@/app/utils/utils";
import {RecipeDto} from "./interface/recipe/RecipeDto";
import RecipeCard from "./components/recipe/RecipeCard";
import {getAllProductDiscount, getAllProductHighlighting} from "./services/products/product";
import ProductCard from "./components/ProductCard/ProductCard";

export default function Home() {

    const [productsHighlighting, setProductsHighlighting] = useState<ProductDto[]>([]);
    const [productsDiscount, setProductsDiscount] = useState<ProductDto[]>([]);
    const [recipes, setRecipes] = useState<RecipeDto[]>([]);

    useEffect((): void => {
        const fetchProducts = async (): Promise<void> => {
            await getAllProductHighlighting().then((result: ProductDto[]) => {
                setProductsHighlighting(result);
            })
            await getAllProductDiscount().then((result: ProductDto[]) => {
                setProductsDiscount(result);
            })
        }
        getPageName();
        fetchProducts();
    }, []);

    const callGenerateRecipes = async (): Promise<void> => {
        const recipes = await generateRecipes("generate-recipes-from-bdd");
        setRecipes(recipes);
    }

    const bgColors: string[] = ['bg-tertiaryColorPink', 'bg-tertiaryColorOrange', 'bg-tertiaryColorBlue', 'bg-tertiaryColorPurple'];
    return (
        <div className="w-full bg-primaryBackgroundColor min-h-[85vh]">
            <section className="h-[85vh]">
                <div className="w-full h-full bg-primaryBackgroundColor">
                    <div className="flex flex-col justify-center items-center h-full">
                        <h1 className="font-manrope font-bold text-5xl text-gray-900">Bienvenue sur notre site</h1>
                        <p className="font-manrope font-light text-2xl text-gray-900">L&apos;IA c&apos;est trop bien</p>
                        <button onClick={callGenerateRecipes}>Générer des recettes</button>
                        <div className="grid grid-cols-3 gap-5">
                            {recipes && recipes.map((recipe, index) => (
                                <RecipeCard recipe={recipe} key={index}/>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            {productsHighlighting.length > 0 ? (
                <section className="px-20 py-10 w-full">
                    <div className="mb-10 flex flex-col gap-2">
                        <h2 className="font-manrope font-bold text-2xl text-gray-900">Nos produits phare</h2>
                        <hr className="border-2 w-40 border-gray-900 rounded-full"/>
                    </div>

                    <div className="grid grid-cols-4 gap-10 ">
                        {productsHighlighting.map((product, index) => (
                            <ProductCard productSlug={product.slug} key={product.id} product={product} bgColor={bgColors[index % bgColors.length]}/>
                        ))}
                    </div>
                </section>
            ) : ('')}

            {productsDiscount.length > 0 ? (
                <section className="px-20 py-10 w-full">
                    <div className="mb-10 flex flex-col gap-2">
                        <h2 className="font-manrope font-bold text-2xl text-gray-900">Nos produits en promotions</h2>
                        <hr className="border-2 w-40 border-gray-900 rounded-full"/>
                    </div>

                    <div className="grid grid-cols-4 gap-10 ">
                        {productsDiscount.map((product, index) => (
                            <ProductCard productSlug={product.slug} key={product.id} product={product} bgColor={bgColors[index % bgColors.length]}/>
                        ))}
                    </div>
                </section>
            ) : ('')}

        </div>
    );
}
