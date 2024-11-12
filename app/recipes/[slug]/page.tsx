"use client"

import { RecipeDto } from "@/app/interface/recipe/RecipeDto";
import { generateRecipes } from "@/app/services/ia-integration/ia";
import { getRecipeBySlug, updateRecipe } from "@/app/services/recipes";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Image } from "primereact/image";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import { Panel } from "primereact/panel";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import { ProgressSpinner } from 'primereact/progressspinner';
import { PrimeIcons } from 'primereact/api';

export default function RecipesPage() {
    const [recipe, setRecipe] = useState<RecipeDto>();
    const [isGenerating, setIsGenerating] = useState(false);
    const params = useParams();

    useEffect(() => {
        const slug = params.slug;
        if (!slug) return;

        const fetchRecipes = async () => {
            const recipe = await getRecipeBySlug(slug as string);
            if (recipe?.steps?.length === 0 && !isGenerating) {
                setIsGenerating(true);
                const ingredients = recipe.recipeIngredients.map((ingredient) => ({
                    name: ingredient.product.name,
                    quantity: ingredient.quantity,
                    unit: ingredient.unit,
                }));

                const steps = await generateRecipes("generate-steps", {
                    name: recipe.name,
                    description: recipe.description,
                    ingredients: ingredients,
                });

                updateRecipe(recipe.id, { steps: steps });
                setIsGenerating(false);
            }

            setRecipe(recipe);
        };

        fetchRecipes();
    }, [params.slug, isGenerating]);

    if (!recipe) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <ProgressSpinner />
            </div>
        );
    }

    const headerTemplate = (
        <div className="flex justify-content-between align-items-center">
            <h2 className="text-xl font-semibold">Ingrédients</h2>
            <div className="flex gap-2">
                <i className="pi pi-user"></i>
                <i className="pi pi-bookmark"></i>
            </div>
        </div>
    );

    return (
        <div className="max-w-[1200px] mx-auto p-4">
            {/* Header avec image et infos basiques */}
            <Card className="mb-4">
                <div className="text-center mb-4">
                    <h1 className="text-4xl font-bold mb-2">{recipe.name}</h1>
                    <p className="text-gray-600">{recipe.description}</p>
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

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 border-round-lg">
                    <div className="flex items-center content-center">
                        <Tag severity="info" value={`${recipe.preparationTime} min`} icon={PrimeIcons.CLOCK}></Tag>
                    </div>
                    <div className="flex align-items-center justify-content-center">
                        <Tag severity="danger" value={`${recipe.cookingTime} min`} icon="pi-stopwatch"></Tag>
                    </div>
                    <div className="flex align-items-center justify-content-center">
                        <Tag severity="success" value={`${recipe.servings} portions`} icon={PrimeIcons.USERS} />
                    </div>
                    <div className="flex align-items-center justify-content-center">
                        <Tag severity="warning" value={recipe.difficulty} icon={PrimeIcons.STAR}></Tag>
                    </div>
                </div>
            </Card>

            {/* Section Ingrédients */}
            <Panel header={headerTemplate} className="mb-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                    {recipe.recipeIngredients.map((ingredient, index) => (
                        <div key={index} className="flex flex-col items-center text-center">
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
                    ))}
                </div>
            </Panel>

            {/* Section Étapes */}
            <Panel header="Étapes de préparation" className="mb-4">
                <div className="p-4">
                    {recipe.steps.map((step, index) => (
                        <div key={index} className="mb-4">
                            <Card>
                                <div className="flex gap-3">
                                    <div className="flex-none">
                                        <Tag 
                                            severity="info" 
                                            value={`${index + 1}`} 
                                            className="w-2rem h-2rem flex align-items-center justify-content-center border-circle"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p>{step.description}</p>
                                    </div>
                                </div>
                            </Card>
                            {/* {index < recipe.steps.length - 1 && <Divider />} */}
                        </div>
                    ))}
                </div>
            </Panel>
        </div>
    );
}