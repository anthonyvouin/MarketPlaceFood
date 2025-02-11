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
import { useSideBarBasket } from "@/app/provider/sideBar-cart-provider";

const RecipeDetailPage = () => {
  const [recipeDetails, setRecipeDetails] = useState<RecipeDto | null>(null);
  const [isLoadingSteps, setIsLoadingSteps] = useState(false);
  const [isRecipeFavorite, setIsRecipeFavorite] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState([] as any[]);

  const params = useParams();
  const { data: sessionData } = useSession();
  const { show } = useContext(ToastContext);
  const { addProduct } = useSideBarBasket();

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

        const formatTime = (time: number) => {
          if (time < 60) {
            return `${time} min`;
          } else {
            const hours = Math.floor(time / 60);
            const minutes = time % 60;
            return `${hours} h ${minutes > 0 ? `${minutes} min` : ''}`;
          }
        };

        const metrics = [
          { icon: PrimeIcons.CLOCK, label: "Temps de préparation", value: formatTime(fetchedRecipe.preparationTime), color: "bg-blue-50 text-blue-600" },
          { icon: PrimeIcons.BOLT, label: "Temps de cuisson", value: formatTime(fetchedRecipe.cookingTime), color: "bg-red-50 text-red-600" },
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
      } catch {
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

      ingredients.push(...recipe.recipeMissingIngredientReports.map(ingredient => ({
        name: ingredient.missingIngredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      })));

      const generatedSteps = await generateRecipes("generate-steps", JSON.stringify({
        name: recipe.name,
        description: recipe.description,
        ingredients: ingredients,
      }));

      await updateRecipe(recipe.id, { steps: generatedSteps.steps });

      const updatedRecipe = await getRecipeBySlug(params.slug as string);
      setRecipeDetails(updatedRecipe);
    } catch {
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
    } catch {
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

  return (
    <div className="min-h-screen bg-primaryBackgroundColor mt-16">
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-darkActionColor text-white rounded-full flex items-center gap-2 hover:bg-primaryColor transition-colors focus:ring-4 focus:ring-primaryColor"
          aria-label="Retour à la liste des recettes">
          <i className="pi pi-chevron-left text-xl" aria-hidden="true"></i>
          <span className="sr-only">Retour</span>
        </button>
        <div className=" rounded-2xl overflow-hidden">
          {recipeDetails.image && (
            <div className="relative rounded-full h-96 w-full">
              <Image
                src={recipeDetails.image !== "" ? recipeDetails.image : "/images/default-image.png"}
                alt={recipeDetails.name}
                imageClassName="w-full h-full object-cover object-center"
              />
              <div className="absolute top-4 right-4">
                <button
                  onClick={handleFavoriteToggle}
                  className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${isRecipeFavorite
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
            <h1 className="text-4xl font-bold mb-4 text-gray-800" tabIndex={0}>{recipeDetails.name}</h1>
            <p className="text-lg text-gray-600 leading-relaxed" tabIndex={0}>{recipeDetails.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div
              tabIndex={0}
              key={index}
              className={`${metric.color} p-6 rounded-xl flex flex-col items-center text-center space-y-2`}>
              <i className={`${metric.icon} text-2xl`}></i>
              <span className="text-sm font-medium">{metric.label}</span>
              <span className="text-lg font-bold">{metric.value}</span>
            </div>
          ))}
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-black" tabIndex={0}>Ingrédients</h2>

          <h3 className="text-lg font-bold mb-4 text-black" tabIndex={0}>Dans notre magasin</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {recipeDetails.recipeIngredients.map((ingredient, index) => (
              <div key={index} className="group transition-transform transform hover:scale-105 p-4">
              <div className="grid place-items-center grid-rows-3 text-center space-y-3">
                <div className="w-24 h-24 flex items-center justify-center rounded-full overflow-hidden shadow-md p-2 group-hover:bg-primaryColor">
                <Image
                  src={ingredient.product.image}
                  alt={ingredient.product.name}
                  className="object-cover"
                  tabIndex={0}
                />
                </div>
                <div>
                <span className="block text-lg font-bold text-black" tabIndex={0}>
                  {ingredient.quantity} {ingredient.unit}
                </span>
                <span className="text-black/75" tabIndex={0}>
                  {ingredient.product.name}
                </span>
                </div>
                <button
                className="mt-2 flex items-center gap-2 px-4 py-2 bg-darkActionColor text-white rounded-full hover:bg-primaryColor transition"
                onClick={() => addProduct(ingredient.product, 1)}
                aria-label={`Ajouter ${ingredient.product.name} au panier`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l1 5h8l1-5M5 21h14M9 21a2 2 0 100-4 2 2 0 000 4M15 21a2 2 0 100-4 2 2 0 000 4" />
                </svg>
                Ajouter
                </button>
              </div>
              </div>
            ))}
            </div>

          <div className="flex justify-center mt-8">
            <button
              className="flex items-center gap-2 px-6 py-3 bg-darkActionColor text-white font-semibold rounded-full hover:bg-primaryColor transition"
              onClick={() => recipeDetails.recipeIngredients.forEach(ingredient => addProduct(ingredient.product, 1))}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l1 5h8l1-5M5 21h14M9 21a2 2 0 100-4 2 2 0 000 4M15 21a2 2 0 100-4 2 2 0 000 4" />
              </svg>
              Ajouter tous les ingrédients au panier
            </button>
          </div>

          <h3 className="text-lg font-bold mt-10 mb-4 text-black" tabIndex={0}>Pas encore dans notre magasin, mais c&apos;est pour bientôt</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {recipeDetails.recipeMissingIngredientReports.map((ingredient, index) => (
              <div key={index} className="group transition-transform transform hover:scale-105 p-4">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-24 h-24 rounded-full overflow-hidden shadow-md p-2">
                    <Image
                      tabIndex={0}
                      src="/images/default-image.png"
                      alt="Image manquante"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <span className="block text-lg font-bold text-black" tabIndex={0}>
                      {ingredient.quantity} {ingredient.unit}
                    </span>
                    <span className="text-black/75" tabIndex={0}>
                      {ingredient.missingIngredient.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-black" tabIndex={0}>Étapes de préparation</h2>
          {isLoadingSteps ? (
            <div className="flex justify-center p-8">
              <ProgressSpinner strokeWidth="3" />
            </div>
          ) : (
            <div className="space-y-6">
              {recipeDetails.steps.map((step, index) => (
                <div
                  tabIndex={0}
                  key={index}
                  className="flex gap-6 p-6 bg-white text-black hover:text-white rounded-xl hover:bg-primaryColor/65 transition-colors">
                  <div className="flex-none">
                    <div className="w-12 h-12 rounded-full bg-gray-100  text-primaryColor  flex items-center justify-center text-xl font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 items-center justify-center">
                    <p className="text-lg leading-relaxed">{step.description}</p>
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