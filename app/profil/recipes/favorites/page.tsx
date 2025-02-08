"use client"

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ProgressSpinner } from 'primereact/progressspinner';
import { getUserFavoriteRecipes } from "@/app/services/recipes";
import RecipeCard from "@components/recipe/RecipeCard";
import { RecipeDto } from "@/app/interface/recipe/RecipeDto";

export default function RecipesPage() {
    const { data: session } = useSession();
    const [recipes, setRecipes] = useState<RecipeDto[]>([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getFavoritedRecipes();
    }, []);

    async function getFavoritedRecipes() {
        setLoading(true);
        if (session?.user?.id) {
            const lastRecipes = await getUserFavoriteRecipes(session.user.id);
            setRecipes(lastRecipes.recipes);
        }
        setLoading(false);
    }

    const handleUnfavorite = (recipeId) => {
        setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
    };

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
                                favorite={true}
                                onUnfavorite={() => handleUnfavorite(recipe.id)}
                            />
                        ))}
                    </div>
                )
            )}
        </div>
    );
}