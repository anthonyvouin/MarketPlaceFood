"use client"

import { useContext, useState } from "react";
import { useSession } from "next-auth/react";
import { ToastContext } from "../provider/toastProvider";
import { Button } from "primereact/button";
import { createRecipe } from "../services/recipes";
import { generateRecipes } from "../services/ia-integration/ia";

export default function RecipesPage() {

    const { data: session } = useSession();
    const { show } = useContext(ToastContext); 

    async function generateRecipe() {
        const recipes = await generateRecipes("generate-recipes-from-bdd");
        const user = session?.user.id;
        const generatedRecipes = []
        console.log("user", user)
        console.log("recipes", recipes)
        recipes.forEach(async recipe => {
            const createdRecipe = await createRecipe(recipe, user)
            generatedRecipes.push(createdRecipe);
        })
        console.log("generatedRecipes", generatedRecipes)
        if (generatedRecipes) {
            show("Succès", "Recettes générées avec succès", "success");
        } else {
            show("Erreur", "Erreur lors de la génération des recettes", "error");
        }
    }

    return (
        <div className="h-[85vh] flex items-center justify-center bg-primaryBackgroundColor overflow-hidden">
            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg max-w-4xl mx-4 p-6 md:p-10 space-y-6 md:space-y-0 md:space-x-10">
                <div className="md:w-1/2 flex flex-col justify-center">
                    <h1 className="text-2xl font-semibold text-darkActionColor mb-4">Recettes</h1>
                    <p className="text-gray-600 mb-6">
                        Découvrez nos délicieuses recettes et régalez-vous en famille ou entre amis.
                    </p>

                    <Button onClick={generateRecipe}>Générer des recettes</Button>
                </div>
            </div>
        </div>
    );
}