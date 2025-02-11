"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useContext } from "react";
import { useSession } from "next-auth/react";
import { Image } from "primereact/image";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { PrimeIcons } from "primereact/api";
import {
  getRecipeBySlug,
  updateRecipe
} from "@/app/services/recipes";
import { generateRecipes } from "@/app/services/ia-integration/ia";
import { RecipeDto } from "@/app/interface/recipe/RecipeDto";
import { ToastContext } from "@/app/provider/toastProvider";
import ProductSelector from "@/app/components/ProductSelector";
import { uploadImageToCloudinary } from "@/lib/uploadImage";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RecipeStepDto } from "@/app/interface/recipe/RecipeStepDto";

const RecipeAdminDetailPage = () => {
  const [recipeDetails, setRecipeDetails] = useState<any>(null);
  const [isLoadingSteps, setIsLoadingSteps] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState([] as any[]);
  const [newStep, setNewStep] = useState({ stepNumber: 0, description: "" });
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [steps, setSteps] = useState<RecipeStepDto[]>([]); // Initial steps state

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

        // Set steps from fetched recipe details
        setSteps(fetchedRecipe.steps || []);

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

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
      setSteps(updatedRecipe.steps || []);
    } catch {
      showErrorToast("Erreur lors de la génération des étapes");
    } finally {
      setIsLoadingSteps(false);
    }
  };

  const showErrorToast = (message: string) => {
    show("Erreur", message, "error");
  };

  const showSuccessToast = (message: string) => {
    show("Succès", message, "success");
  };

  const handleMetricChange = (index: number, value: string) => {
    const updatedMetrics = [...metrics];
    updatedMetrics[index].value = value;

    switch (updatedMetrics[index].label) {
      case "Temps de préparation":
        setRecipeDetails(recipeDetails ? { ...recipeDetails, preparationTime: Number(value) } : null);
        break;
      case "Temps de cuisson":
        setRecipeDetails(recipeDetails ? { ...recipeDetails, cookingTime: Number(value) } : null);
        break;
      case "Nombre de parts":
        setRecipeDetails(recipeDetails ? { ...recipeDetails, servings: Number(value) } : null);
        break;
      case "Difficulté":
        setRecipeDetails(recipeDetails ? { ...recipeDetails, difficulty: value } : null);
        break;
      default:
        break;
    }

    setMetrics(updatedMetrics);
  };

  const handleIngredientChange = (index, field, value) => {
    if (!recipeDetails) return;
    const updatedIngredients = [...recipeDetails.recipeIngredients];
    updatedIngredients[index][field] = value;
    setRecipeDetails(recipeDetails ? { ...recipeDetails, recipeIngredients: updatedIngredients } : null);
  };

  const handleStepChange = (index, field, value) => {
    if (!recipeDetails) return;
    const updatedSteps = [...recipeDetails.steps];
    updatedSteps[index][field] = value;
    setRecipeDetails(recipeDetails ? { ...recipeDetails, steps: updatedSteps } : null);
  };

  const removeIngredient = (index) => {
    if (!recipeDetails) return;
    const updatedIngredients = recipeDetails.recipeIngredients.filter((_, i) => i !== index);
    setRecipeDetails({ ...recipeDetails, recipeIngredients: updatedIngredients });
  };

  const addStep = () => {
    if (!recipeDetails) return;
    const updatedSteps = [...recipeDetails.steps, { ...newStep }];
    setRecipeDetails({ ...recipeDetails, steps: updatedSteps });
    setNewStep({ stepNumber: 0, description: "" });
  };

  const removeStep = (index) => {
    if (!recipeDetails) return;
    const updatedSteps = recipeDetails.steps.filter((_, i) => i !== index);
    setRecipeDetails({ ...recipeDetails, steps: updatedSteps });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    setIsUploadingImage(true);
    try {
      const imageUrl = await uploadImageToCloudinary(formData);
      setRecipeDetails(recipeDetails ? { ...recipeDetails, image: imageUrl } : null);
      showSuccessToast("Image téléchargée veuillez sauvegarder pour valider");
    } catch {
      showErrorToast("Erreur lors du téléchargement de l'image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleUpdateRecipe = async () => {
    try {
      if (!recipeDetails) return;
      await updateRecipe(recipeDetails.id, {
        name: recipeDetails.name,
        image: recipeDetails.image,
        description: recipeDetails.description,
        steps: recipeDetails.steps,
        preparationTime: recipeDetails.preparationTime,
        cookingTime: recipeDetails.cookingTime,
        servings: recipeDetails.servings,
        difficulty: recipeDetails.difficulty,
        ingredients: recipeDetails.recipeIngredients.map(ingredient => ({
          productId: ingredient.product.id,
          name: ingredient.product.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit
        }))
      });
      showSuccessToast("Recette mise à jour avec succès");
    } catch {
      showErrorToast("Erreur lors de la mise à jour de la recette");
    }
  };

  const handleAddProduct = (product) => {
    if (!recipeDetails) return;
    const updatedIngredients = [...recipeDetails.recipeIngredients, { product, quantity: 0, unit: '' }];
    setRecipeDetails({ ...recipeDetails, recipeIngredients: updatedIngredients });
    setShowProductSelector(false);
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
  const SortableStep = ({ step, index }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: step.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="p-4 bg-white rounded-lg shadow-md border border-gray-200 relative"
      >
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-primaryColor text-white flex items-center justify-center text-lg font-bold">
            {index + 1}
          </div>
          <input
            type="text"
            value={step.description}
            onChange={(e) => handleStepChange(index, "description", e.target.value)}
            className="flex-1 bg-gray-50 border rounded-md outline-none px-3 py-2 focus:ring-2 focus:ring-primaryColor"
          />
        </div>
        <button
          onClick={() => removeStep(index)}
          className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
        >
          <i className="pi pi-trash"></i>
        </button>
      </div>
    );
  };

  const handleDragEnd = async ({ active, over }) => {
    if (active.id !== over.id) {
      const oldIndex = steps.findIndex((step) => step.id === active.id);
      const newIndex = steps.findIndex((step) => step.id === over.id);
      const updatedSteps = arrayMove(steps, oldIndex, newIndex).map((step, index) => ({
        ...step,
        stepNumber: index + 1,
        id: step.id,
        recipeId: step.recipeId,
      }));

      setSteps(updatedSteps);
      setRecipeDetails({ ...recipeDetails, steps: updatedSteps as RecipeStepDto[] });

      try {
        await updateRecipe(recipeDetails.id, { steps: updatedSteps });
        showSuccessToast("Ordre des étapes mis à jour avec succès");
      } catch {
        showErrorToast("Erreur lors de la mise à jour de l'ordre des étapes");
      }
    }
  };

  return (
    <div className="min-h-screen bg-primaryBackgroundColor">
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className=" rounded-2xl overflow-hidden">
          {recipeDetails.image && (
            <div className="relative rounded-full h-96 w-full">
              <Image
                src={recipeDetails.image !== "" ? recipeDetails.image : "/images/default-image.png"}
                alt={recipeDetails.name}
                imageClassName="w-full h-full object-cover object-center"
              />
            </div>
          )}
          <div className="p-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mettre à jour l&apos;image
            </label>
            <input
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:bg-primaryColor file:text-white hover:file:bg-primaryColor/90"
              disabled={isUploadingImage}
            />
            {isUploadingImage && <ProgressSpinner strokeWidth="3" />}
          </div>
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
              <input
                type="text"
                value={recipeDetails.name}
                onChange={(e) => setRecipeDetails({ ...recipeDetails, name: e.target.value })}
                className="w-full bg-gray-50 border rounded-md px-2 outline-none py-1 focus:ring-2 focus:ring-primaryColor"
              />
            </h1>
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
              {metric.label === "Difficulté" ? (
                <select
                  value={metric.value}
                  onChange={(e) => handleMetricChange(index, e.target.value)}
                  className="text-lg font-bold bg-transparent border-none text-center outline-none"
                >
                  <option value="Facile">Facile</option>
                  <option value="Moyenne">Moyenne</option>
                  <option value="Difficile">Difficile</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={metric.value}
                  onChange={(e) => handleMetricChange(index, e.target.value)}
                  className="text-lg font-bold bg-transparent border-none text-center outline-none"
                />
              )}
            </div>
          ))}
        </div>

        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Ingrédients</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recipeDetails.recipeIngredients.map((ingredient, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200 relative">
                <div className="relative w-full h-24 mb-4">
                  <Image
                    src={ingredient.product.image || "/images/default-image.png"}
                    alt={ingredient.product.name}
                    imageClassName="object-cover rounded-md h-full w-full"
                  />
                </div>

                <input
                  type="text"
                  value={ingredient.product.name}
                  onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                  className="block w-full font-semibold text-gray-800 bg-gray-50 border rounded-md outline-none px-2 py-1 focus:ring-2 focus:ring-primaryColor mb-2"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={ingredient.quantity}
                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                    className="w-1/2 bg-gray-50 border rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-primaryColor"
                    placeholder="Quantité"
                  />
                  <input
                    type="text"
                    value={ingredient.unit}
                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                    className="w-1/2 bg-gray-50 border outline-none rounded-md px-2 py-1 focus:ring-2 focus:ring-primaryColor"
                    placeholder="Unité"
                  />
                </div>

                <button
                  onClick={() => removeIngredient(index)}
                  className="absolute top-2 right-2 bg-red-500 outline-none text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors">
                  <i className="pi pi-trash"></i>
                </button>
              </div>
            ))}

            <div
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200 relative flex justify-center items-center cursor-pointer h-full"
              onClick={() => setShowProductSelector(true)}>
              <div className="relative w-full h-24 mb-4 flex justify-center items-center">
                <div className="w-16 h-16 rounded-full bg-gray-300 text-white flex items-center justify-center text-2xl">
                  <i className="pi pi-plus"></i>
                </div>
              </div>
            </div>
            {showProductSelector && (
              <ProductSelector
                onSelect={handleAddProduct}
                onClose={() => setShowProductSelector(false)}
              />
            )}
          </div>
        </div>

        <div className="p-8">
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Étapes de préparation</h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext items={steps.map((step) => step.id)}>
                <div className="space-y-6">
                  {steps.map((step, index) => (
                    <SortableStep key={step.id} step={step} index={index} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ajouter une nouvelle étape</h3>
              <input
                type="text"
                placeholder="Description de l'étape"
                value={newStep.description}
                onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                className="w-full bg-white border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primaryColor"
              />
              <button
                onClick={addStep}
                className="mt-4 bg-primaryColor text-white px-6 py-2 rounded-md hover:bg-primaryColor/90 transition-colors">
                Ajouter Étape
              </button>
            </div>
          </div>
        </div>
        <div className="p-8">
          <button onClick={handleUpdateRecipe} className="bg-primaryColor text-white px-4 py-2 rounded">Mettre à jour la recette</button>
        </div>
      </main>
    </div>
  );
};

export default RecipeAdminDetailPage;