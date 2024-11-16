"use client"

import { useParams } from "next/navigation";
import { useEffect, useState, useContext } from "react";
import { useSession } from "next-auth/react";
import { Image } from "primereact/image";
import { Card } from "primereact/card";
import { ProgressSpinner } from 'primereact/progressspinner';
import { PrimeIcons } from 'primereact/api';
import {
  getRecipeBySlug,
  getUserFavoriteRecipes,
  toggleRecipeFavorite,
  updateRecipe
} from "@/app/services/recipes";
import { generateRecipes } from "@/app/services/ia-integration/ia";
import { RecipeDto } from "@/app/interface/recipe/RecipeDto";
import { ToastContext } from "@/app/provider/toastProvider";

const RecipeDetailPage = () => {
  const [recipeDetails, setRecipeDetails] = useState<RecipeDto | null>(null);
  const [isLoadingSteps, setIsLoadingSteps] = useState(false);
  const [isRecipeFavorite, setIsRecipeFavorite] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState([] as any[]);

  const params = useParams();
  const { data: sessionData } = useSession();
  const { show } = useContext(ToastContext); 


  useEffect(() => {
    const loadRecipeDetails = async () => {
      const recipeSlug = params.slug as string;
      
      if (!recipeSlug) {
        setError("Identifiant de recette manquant");
        return;
      }

      try {
        const fetchedRecipe = await getRecipeBySlug(recipeSlug);
        
        if (!fetchedRecipe) {
          setError("Recette non trouvée");
          return;
        }

        setRecipeDetails(fetchedRecipe);

        const metrics = [
          { icon: PrimeIcons.CLOCK, label: "Temps de préparation", value: fetchedRecipe.preparationTime, color: "bg-blue-50 text-blue-600" },
          { icon: PrimeIcons.CLOCK, label: "Temps de cuisson", value: fetchedRecipe.cookingTime, color: "bg-red-50 text-red-600" },
          { icon: PrimeIcons.USER, label: "Nombre de parts", value: fetchedRecipe.servings, color: "bg-green-50 text-green-600" },
          { icon: PrimeIcons.COG, label: "Difficulté", value: fetchedRecipe.difficulty, color: "bg-yellow-50 text-yellow-600" }
        ];

        setMetrics(metrics);
        
        if (sessionData?.user?.id) {
          const userFavoriteRecipes = await getUserFavoriteRecipes(sessionData.user.id, 1, 10);
          setIsRecipeFavorite(userFavoriteRecipes.recipes.some(recipe => recipe.id === fetchedRecipe.id));
        }

        if (fetchedRecipe.steps?.length === 0 && !isLoadingSteps) {
          await generateRecipeSteps(fetchedRecipe);
        }
      } catch (err) {
        setError("Erreur lors du chargement de la recette");
        showErrorToast("Erreur lors du chargement de la recette");
      }
    };

    loadRecipeDetails();
  }, [params.slug, sessionData?.user?.id, isLoadingSteps]);

  // Step generation function
  const generateRecipeSteps = async (recipe: RecipeDto) => {
    setIsLoadingSteps(true);
    try {
      const ingredients = recipe.recipeIngredients.map(ingredient => ({
        name: ingredient.product.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      }));

      const generatedSteps = await generateRecipes("generate-steps", {
        name: recipe.name,
        description: recipe.description,
        ingredients: ingredients,
      });

      await updateRecipe(recipe.id, { steps: generatedSteps });
      
      const updatedRecipe = await getRecipeBySlug(params.slug as string);
      setRecipeDetails(updatedRecipe);
    } catch (err) {
      showErrorToast("Erreur lors de la génération des étapes");
    } finally {
      setIsLoadingSteps(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!recipeDetails || !sessionData?.user?.id) {
      showErrorToast("Vous devez être connecté pour ajouter aux favoris");
      return;
    }

    try {
      const response = await toggleRecipeFavorite(recipeDetails.id, sessionData.user.id);
      setIsRecipeFavorite(response.isFavorited);
      showSuccessToast(response.isFavorited ? 
        "Recette ajoutée aux favoris" : 
        "Recette retirée des favoris"
      );
    } catch (err) {
      show("Erreur", "Erreur lors de l'ajout aux favoris", "error");    
    }
  };

  const showErrorToast = (message: string) => {
    show("Erreur", message, "error");
  };

  const showSuccessToast = (message: string) => {
    show("Succès", message, "success");
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md shadow-lg">
          <div className="text-center">
            <i className="pi pi-exclamation-circle text-5xl text-red-500 mb-4"></i>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!recipeDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <ProgressSpinner strokeWidth="3" />
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-primaryBackgroundColor">      
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Recipe Header */}
        <div className=" rounded-2xl overflow-hidden">
          {recipeDetails.image && (
            <div className="relative rounded-full h-96 w-full">
              <Image
                src={recipeDetails.image}
                alt={recipeDetails.name}
                imageClassName="w-full h-full object-cover object-center"
                // preview
              />
              <div className="absolute top-4 right-4">
                <button
                  onClick={handleFavoriteToggle}
                  className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${
                    isRecipeFavorite 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-red-50'
                  }`}
                >
                  <i className={`${isRecipeFavorite ? PrimeIcons.HEART_FILL : PrimeIcons.HEART} text-xl`}></i>
                </button>
              </div>
            </div>
          )}
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">{recipeDetails.name}</h1>
            <p className="text-lg text-gray-600 leading-relaxed">{recipeDetails.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`${metric.color} p-6 rounded-xl flex flex-col items-center text-center space-y-2`}
            >
              <i className={`${metric.icon} text-2xl`}></i>
              <span className="text-sm font-medium">{metric.label}</span>
              <span className="text-lg font-bold">{metric.value}</span>
            </div>
          ))}
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-black">Ingrédients</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {recipeDetails.recipeIngredients.map((ingredient, index) => (
              <div 
                key={index}
                className="group transform transition-transform"
              >
                <div className="p-4 flex flex-col items-center text-center space-y-3">
                  <div className="w-24 h-24 rounded-full overflow-hidden shadow-md p-2 hover:bg-primaryColor">
                    <Image
                      src={ingredient.product.image}
                      alt={ingredient.product.name}
                      imageClassName="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <span className="block text-lg font-bold text-black">
                      {ingredient.quantity} {ingredient.unit}
                    </span>
                    <span className="text-black/75">
                      {ingredient.product.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recipe Steps */}
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-black">Étapes de préparation</h2>
          {isLoadingSteps ? (
            <div className="flex justify-center p-8">
              <ProgressSpinner strokeWidth="3" />
            </div>
          ) : (
            <div className="space-y-6">
              {recipeDetails.steps.map((step, index) => (
                <div 
                  key={index}
                  className="flex gap-6 p-6 bg-primaryColor/80 rounded-xl hover:bg-primaryColor/65 transition-colors"
                >
                  <div className="flex-none">
                    <div className="w-12 h-12 rounded-full bg-white text-primaryColor flex items-center justify-center text-xl font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-lg leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RecipeDetailPage;