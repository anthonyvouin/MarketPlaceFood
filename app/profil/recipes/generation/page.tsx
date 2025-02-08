"use client"

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ProgressSpinner } from 'primereact/progressspinner';
import { getUserCreatedRecipes } from "@/app/services/recipes";
import RecipeCard from "@components/recipe/RecipeCard";

export default function RecipesPage() {
    const { data: session } = useSession();
    const [recipes, setRecipes] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getCreatedRecipesByCurrentUser();
    }, []);

    async function getCreatedRecipesByCurrentUser() {
        setLoading(true);
        if (session) {
            const lastRecipes = await getUserCreatedRecipes(session.user.id);
            setRecipes(lastRecipes.recipes);
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex flex-col items-center bg-primaryBackgroundColor p-14 mt-14">

            {loading ? (
                <ProgressSpinner />
            ) : (
                recipes && recipes.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl">
                        {recipes.map((recipe, index) => (
                            <RecipeCard
                                key={index}
                                recipe={recipe}
                            />
                        ))}
                    </div>
                )
            )}
        </div>
    );
}