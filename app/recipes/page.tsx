"use client"

import { useEffect, useContext, useState } from "react";
import { useSession } from "next-auth/react";
import { ToastContext } from "../provider/toastProvider";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { createRecipe, getAllRecipes } from "../services/recipes";
import { generateRecipes } from "../services/ia-integration/ia";
import Link from "next/link";
import { getImageFromGoogle } from "../services/products/product";
import { ProgressSpinner } from 'primereact/progressspinner';

export default function RecipesPage() {
    const { data: session } = useSession();
    const { show } = useContext(ToastContext);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);

    async function generateRecipe() {
        try {
            if (!session) {
                show("Erreur", "Vous devez être connecté pour générer des recettes", "error");
                return;
            }
            setLoading(true);
            const user = session.user.id;
            const recipes = await generateRecipes("generate-recipes-from-bdd");
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
                <Button 
                    label="Générer des recettes"
                    icon="pi pi-refresh"
                    className="p-button-success"
                    onClick={generateRecipe}
                    disabled={loading}
                />
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
