"use client"

import { RecipeDto } from "@/app/interface/recipe/RecipeDto";
import { generateRecipes } from "@/app/services/ia-integration/ia";
import { getRecipeBySlug, getUserFavoriteRecipes, toggleRecipeFavorite, updateRecipe } from "@/app/services/recipes";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Image } from "primereact/image";
import { Tag } from "primereact/tag";
import { Card } from "primereact/card";
import { ProgressSpinner } from 'primereact/progressspinner';
import { PrimeIcons } from 'primereact/api';
import { useSession } from "next-auth/react";
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

interface RecipeIngredient {
  product: {
    name: string;
    image: string;
  };
  quantity: number;
  unit: string;
}

interface RecipeStep {
  description: string;
}

const RecipeDetailPage = () => {
  // State
  const [recipeDetails, setRecipeDetails] = useState<RecipeDto | null>(null);
  const [isLoadingSteps, setIsLoadingSteps] = useState(false);
  const [isRecipeFavorite, setIsRecipeFavorite] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const params = useParams();
  const { data: sessionData } = useSession();
  const toastRef = useRef<Toast>(null);

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
        const userFavoriteRecipes = await getUserFavoriteRecipes(sessionData?.user?.id, 1, 10);
        setIsRecipeFavorite(userFavoriteRecipes.recipes.some(recipe => recipe.id === fetchedRecipe.id));
        // Generate steps if needed
        if (fetchedRecipe.steps?.length === 0 && !isLoadingSteps) {
          await generateRecipeSteps(fetchedRecipe);
        }
      } catch (err) {
        setError("Erreur lors du chargement de la recette");
        showErrorToast("Erreur lors du chargement de la recette");
      }
    };

    loadRecipeDetails();
  }, [params.slug, isLoadingSteps]);

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
      
      // Refresh recipe details
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
      showErrorToast("Erreur lors de la modification des favoris");
    }
  };

  const showErrorToast = (message: string) => {
    toastRef.current?.show({
      severity: 'error',
      summary: 'Erreur',
      detail: message,
      life: 3000
    });
  };

  const showSuccessToast = (message: string) => {
    toastRef.current?.show({
      severity: 'success',
      summary: 'Succès',
      detail: message,
      life: 3000
    });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!recipeDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <section className="p-4 bg-primaryBackgroundColor">
      <Toast ref={toastRef} />
      
      {/* Recipe Header */}
      <RecipeHeader 
        recipe={recipeDetails}
        isFavorite={isRecipeFavorite}
        onFavoriteToggle={handleFavoriteToggle}
      />

      {/* Recipe Metrics */}
      <RecipeMetrics recipe={recipeDetails} />

      {/* Recipe Ingredients */}
      <RecipeIngredients ingredients={recipeDetails.recipeIngredients} />

      {/* Recipe Steps */}
      <RecipeSteps 
        steps={recipeDetails.steps} 
        isLoading={isLoadingSteps}
      />
    </section>
  );
};

// Composant pour l'en-tête de la recette
const RecipeHeader = ({ 
  recipe, 
  isFavorite, 
  onFavoriteToggle 
}: { 
  recipe: RecipeDto; 
  isFavorite: boolean; 
  onFavoriteToggle: () => void;
}) => (
  <div className="mb-4">
    <div className="mb-4 flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold mb-2">{recipe.name}</h1>
        <p className="text-gray-600">{recipe.description}</p>
      </div>
      <Tag
        icon={isFavorite ? PrimeIcons.HEART_FILL : PrimeIcons.HEART}
        className={`p-tag-rounded cursor-pointer ${isFavorite ? 'p-tag-success' : 'p-tag-secondary'}`}
        onClick={onFavoriteToggle}
        value={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      />
    </div>
    {recipe.image && (
      <div className="mb-4">
        <Image
          src={recipe.image}
          alt={recipe.name}
          width="100%"
          className="border-round-lg"
          preview
        />
      </div>
    )}
  </div>
);

// Composant pour les métriques de la recette
const RecipeMetrics = ({ recipe }: { recipe: RecipeDto }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
    <MetricTag
      severity="info"
      value={`${recipe.preparationTime} min`}
      icon={PrimeIcons.CLOCK}
      label="Préparation"
    />
    <MetricTag
      severity="danger"
      value={`${recipe.cookingTime} min`}
      icon="pi-stopwatch"
      label="Cuisson"
    />
    <MetricTag
      severity="success"
      value={`${recipe.servings} portions`}
      icon={PrimeIcons.USERS}
      label="Parts"
    />
    <MetricTag
      severity="warning"
      value={recipe.difficulty}
      icon={PrimeIcons.STAR}
      label="Difficulté"
    />
  </div>
);

// Composant pour un tag métrique
const MetricTag = ({ 
  severity, 
  value, 
  icon, 
  label 
}: { 
  severity: string; 
  value: string; 
  icon: string; 
  label: string;
}) => (
  <div className="flex flex-col items-center">
    <span className="text-sm text-gray-600 mb-2">{label}</span>
    <Tag
      severity={severity}
      value={value}
      icon={icon}
      className="w-full text-center"
    />
  </div>
);

// Composant pour les ingrédients
const RecipeIngredients = ({ ingredients }: { ingredients: RecipeIngredient[] }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4">Ingrédients</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
      {ingredients.map((ingredient, index) => (
        <IngredientCard key={index} ingredient={ingredient} />
      ))}
    </div>
  </div>
);

// Composant pour une carte d'ingrédient
const IngredientCard = ({ ingredient }: { ingredient: RecipeIngredient }) => (
  <div className="flex flex-col items-center text-center">
    <div className="bg-white p-3 rounded-full shadow-md mb-3 w-24 h-24">
      <Image
        src={ingredient.product.image}
        alt={ingredient.product.name}
        width="100%"
        height="100%"
        imageClassName="w-full h-full object-cover rounded-full"
      />
    </div>
    <div className="text-lg font-semibold mb-1">
      {ingredient.quantity} {ingredient.unit}
    </div>
    <div className="text-gray-600">
      {ingredient.product.name}
    </div>
  </div>
);

// Composant pour les étapes
const RecipeSteps = ({ 
  steps, 
  isLoading 
}: { 
  steps: RecipeStep[]; 
  isLoading: boolean;
}) => (
  <div className="mb-4">
    <h2 className="text-xl font-semibold mb-4">Étapes</h2>
    {isLoading ? (
      <div className="flex justify-center p-4">
        <ProgressSpinner />
      </div>
    ) : (
      <div className="p-4">
        {steps.map((step, index) => (
          <StepCard key={index} step={step} stepNumber={index + 1} />
        ))}
      </div>
    )}
  </div>
);

// Composant pour une carte d'étape
const StepCard = ({ 
  step, 
  stepNumber 
}: { 
  step: RecipeStep; 
  stepNumber: number;
}) => (
  <div className="mb-4">
    <Card>
      <div className="flex gap-3">
        <div className="flex-none">
          <Tag 
            severity="info" 
            value={`${stepNumber}`} 
            className="w-2rem h-2rem flex align-items-center justify-content-center border-circle"
          />
        </div>
        <div className="flex-1">
          <p>{step.description}</p>
        </div>
      </div>
    </Card>
  </div>
);

export default RecipeDetailPage;