"use client"

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ProgressSpinner } from "primereact/progressspinner";
import { getUserCreatedRecipes, getUserFavoriteRecipes } from "@/app/services/recipes";
import RecipeCard from "@components/recipe/RecipeCard";
import { RecipeDto } from "@/app/interface/recipe/RecipeDto";

export default function RecipesPage() {
  const { data: session } = useSession();
  const [recipes, setRecipes] = useState<RecipeDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      getCreatedRecipesByCurrentUser();
    }
  }, [session]);

  async function getCreatedRecipesByCurrentUser() {
    setLoading(true);
    if (session) {
      const createdRecipesResponse = await getUserCreatedRecipes(session.user.id);
      const createdRecipes: RecipeDto[] = createdRecipesResponse.recipes;

      const favoriteRecipesResponse = await getUserFavoriteRecipes(session.user.id);
      const favoriteRecipeIds: string[] = favoriteRecipesResponse.recipes.map(
        (recipe: RecipeDto) => recipe.id
      );

      const updatedRecipes = createdRecipes.map((recipe) => ({
        ...recipe,
        isFavorite: favoriteRecipeIds.includes(recipe.id),
      }));

      setRecipes(updatedRecipes);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-primaryBackgroundColor p-14 mt-14">
      {loading ? (
        <ProgressSpinner />
      ) : recipes && recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} favorite={recipe.isFavorite} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-lg mt-6">Aucune recette trouvée.</p>
      )}
    </div>
  );
}