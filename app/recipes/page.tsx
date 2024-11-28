"use client"

import { useEffect, useContext, useState } from "react";
import { useSession } from "next-auth/react";
import { ToastContext } from "../provider/toastProvider";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { createRecipe, getAllRecipes } from "../services/recipes";
import { analysePicture, generateRecipes } from "../services/ia-integration/ia";
import Link from "next/link";
import { getImageFromGoogle, searchProduct } from "../services/products/product";
import { ProgressSpinner } from 'primereact/progressspinner';

export default function RecipesPage() {
    const { data: session } = useSession();
    const { show } = useContext(ToastContext);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);

    async function analyseRecipe() {
        try {
            // if (!session) {
            //     show("Erreur", "Vous devez être connecté pour analyser une recette", "error");
            //     return;
            // }
            setLoading(true);
            // const user = session.user.id;
            const recipe = await analysePicture("recipe");
            console.log(recipe);

            for (const ingredient of recipe.ingredients) {
                let isIngredientExist = await searchProduct(ingredient.name)
                isIngredientExist = isIngredientExist ? true : false;
                console.log({
                    ingredient: ingredient.name,
                    isIngredientExist: isIngredientExist
                })

                if (!isIngredientExist) {
                    show("Erreur", "Erreur lors de l'analyse de la recette", "error");
                }
            }

            setLoading(false);
        } catch (error) {
            show("Erreur", "Erreur lors de l'analyse de la recette", "error");
        }
    }
    // const generatedRecipes = [];

    async function generateRecipe(format: string) {
        try {
            if (!session) {
                show("Erreur", "Vous devez être connecté pour générer des recettes", "error");
                return;
            }
            setLoading(true);
            const user = session.user.id;
            let recipes = [];
            if (format === "generate-recipes-from-bdd") {
                recipes = await generateRecipes(format);
            } else {
                const localStorageBasket: string | null = localStorage.getItem('basketSnapAndShop')
                if (!localStorageBasket) {
                    show("Erreur", "Votre panier est vide", "error");
                    return;
                }
                const basket = JSON.parse(localStorageBasket);
                let products = basket.basket
                if (!products || products.length === 0) {
                    show("Erreur", "Votre panier est vide", "error");
                    return;
                }
                products = products.map((product: any) => {
                    return {
                        id: product.product.id,
                        name: product.product.name,
                        price: product.product.price,
                    }
                });

                recipes = await generateRecipes(format, "", products);
            }
            const generatedRecipes = [];
            for (const recipe of recipes) {
                const generatedImageForRecipe = await getImageFromGoogle(recipe.name);
                recipe.image = generatedImageForRecipe;
                const createdRecipe = await createRecipe(recipe, user);
                generatedRecipes.push(createdRecipe);
                getLastRecipes();
            }

            if (generatedRecipes.length > 0) {
                show("Succès", "Recettes générées avec succès", "success");
            } else {
                show("Erreur", "Erreur lors de la génération des recettes", "error");
            }
        } catch (error) {
            show("Erreur", "Erreur lors de la génération des recettes", "error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getLastRecipes();
    }, []);

    async function getLastRecipes() {
        setLoading(true);
        const lastRecipes = await getAllRecipes(1, 12, {}, { createdAt: 'desc' });
        setRecipes(lastRecipes.recipes);
        setLoading(false);
    }

    return (
        <div className="min-h-[85vh] flex flex-col items-center bg-primaryBackgroundColor p-4">
            <Card className="w-full max-w-4xl shadow-2 mb-6" title="Recettes">
                <p className="text-gray-700 mb-6">
                    Découvrez nos délicieuses recettes et régalez-vous en famille ou entre amis.
                </p>
                <div className="flex gap-5">

                    <Button
                        label="Générer des recettes"
                        icon="pi pi-refresh"
                        className="p-button-success"
                        onClick={() => generateRecipe("generate-recipes-from-bdd")}
                        disabled={loading}
                    />
                    <Button
                        label="Générer des recettes à partir de votre panier"
                        icon="pi pi-refresh"
                        className="p-button-success"
                        onClick={() => generateRecipe("generate-recipes-from-cart")}
                        disabled={loading}
                    />

                    {/* Analyser une recette */}
                    <Button
                        label="Analyser une recette"
                        icon="pi pi-refresh"
                        className="p-button-success"
                        onClick={() => analyseRecipe()}
                        disabled={loading}
                    />
                </div>
            </Card>

            {loading ? (
                <ProgressSpinner />
            ) : (
                recipes && recipes.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {recipes.map((recipe, index) => (
                            <Link href={`/recipes/${recipe.slug}`} passHref key={index}>
                                <Card key={index} className="shadow-2" title={recipe.name} >
                                    <p className="text-gray-600 mb-4">{recipe.description}</p>
                                    <Button
                                        label="Voir plus"
                                        icon="pi pi-external-link"
                                        className="p-button-outlined p-button-sm"
                                    />
                                </Card>
                            </Link>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}
