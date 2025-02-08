"use client"

import { useEffect, useContext, useState } from "react";
import { useSession } from "next-auth/react";
import { ToastContext } from "../provider/toastProvider";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { createRecipe, getAllRecipes, getRandomRecipes } from "../services/recipes";
import { analysePicture, generateRecipes } from "../services/ia-integration/ia";
// import Link from "next/link";
import { getImageFromGoogle, getImageFromPixabay, getImageFromUnsplash, searchProduct } from "../services/products/product";
import { ProgressSpinner } from 'primereact/progressspinner';
import { createOrUpdateMissingIngredientReport } from "../services/missingIngredientReport";
import RecipeCard from "../components/recipe/RecipeCard";
import IngredientsDialog from "../components/IngredientsDialog";
import { useSideBarBasket } from "../provider/sideBar-cart-provider";
import { CartDto } from "../interface/cart/cartDto";
import { getClientCart } from "../services/cart/cart";
import { formatPriceEuro } from "../pipe/formatPrice";
import ImageUploadDialog from "../components/uploadImageDialog";
import { uploadImage, uploadTemporaryImageToCloudinary } from "@/lib/uploadImage";
import { RecipeDto } from "../interface/recipe/RecipeDto";

export default function RecipesPage() {
    const { data: session } = useSession();
    const { show } = useContext(ToastContext);
    const [recipes, setRecipes] = useState([]);
    const [recipeName, setRecipeName] = useState<string | null>(null);
    const [ingredients, setIngredients] = useState<{
        products_not_found: string[],
        products_found: any[],
        original_ingredients: { name: string; quantity: string; }[],
    }>({
        products_not_found: [],
        products_found: [],
        original_ingredients: [],
    });
    const [loading, setLoading] = useState(false);
    const [ingredientsDialogVisible, setIngredientsDialogVisible] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState("");
    const [imageUploadVisible, setImageUploadVisible] = useState(false);
    const [selectedAction, setSelectedAction] = useState<"analyse-recipe" | "fridge" | null>(null); // Pour différencier l'action (analyse ou frigo)

    const handleImageUpload = async (formData) => {
        try {
            const imagePath = await uploadTemporaryImageToCloudinary(formData);
            if (selectedAction === "analyse-recipe") {
                await analysePictureWithAI("recipe", imagePath);
            } else if (selectedAction === "fridge") {
                await analysePictureWithAI("fridge", imagePath);
            }

            return imagePath;
        } catch (error) {
            console.error("Erreur lors de l'upload de l'image:", error);
            throw error;
        }
    };

    async function analysePictureWithAI(format, imagePath) {
        try {
            if (!session) {
                show("Erreur", "Vous devez être connecté pour générer des recettes", "error");
                return;
            }
            setSelectedFormat(format);
            setLoading(true);
            const recipe: RecipeDto = await analysePicture(format, imagePath);
            if (!recipe) {
                show("Erreur", "Erreur lors de l'analyse de la recette", "error");
                setLoading(false);
                return;
            }
            setRecipeName(recipe.name);

            const foundProducts: any[] = [];
            const notFoundProducts: string[] = [];
            const originalIngredients: { name: string; quantity: string; }[] = [];

            for (const ingredient of recipe.ingredients) {
                const ingredientInBdd = await searchProduct(ingredient?.name)
                const isIngredientExist = ingredientInBdd ? true : false;
                if (ingredient) {
                    originalIngredients.push(ingredient);
                    if (!isIngredientExist) {
                        notFoundProducts.push(ingredient.name);
                    } else {
                        foundProducts.push(ingredientInBdd);
                    }
                }
            }

            setIngredients({
                original_ingredients: originalIngredients,
                products_not_found: notFoundProducts,
                products_found: foundProducts,
            });

            setIngredientsDialogVisible(true);
            setLoading(false);
        } catch (error) {
            show("Erreur", "Erreur lors de l'analyse de la recette", "error");
            setLoading(false);
        }
    }

    const { addProduct } = useSideBarBasket();

    async function randomizeRecipeFromBDD() {
        try {
            setLoading(true);
            const recipes = await getRandomRecipes(9);
            setRecipes(recipes);
            // show("Succès", "Recette générée avec succès", "success");
        } catch (error) {
            show("Erreur", "Erreur lors de la génération de la recette", "error");
        } finally {
            setLoading(false);
        }
    }

    async function generateRecipe(format) {
        try {
            if (!session) {
                show("Erreur", "Vous devez être connecté pour générer des recettes", "error");
                return;
            }
            setLoading(true);
            const user = session.user.id;
            let recipes = [];
            const localStorageBasket: CartDto | null = await getClientCart(session.user.id);
            if (localStorageBasket?.cartItems.length === 0) {
                show("Erreur", "Votre panier est vide", "error");
                return;
            }
            let products = localStorageBasket?.cartItems;
            if (!products || products.length === 0) {
                show("Erreur", "Votre panier est vide", "error");
                return;
            }
            products = products.map((product: any) => {
                return {
                    id: product.product.id,
                    name: product.product.name,
                    price: formatPriceEuro(product.product.price),
                    quantity: product.quantity,
                    product: product.product,
                    totalPrice: product.totalPrice,
                    productId: product.product.id,
                }
            });

            recipes = await generateRecipes(format, "", products);

            const generatedRecipes: any[] = [];
            for (const recipe of recipes as any) {
                const generatedImageForRecipe = await getImageFromPixabay(recipe.englishName);
                recipe.image = generatedImageForRecipe;
                delete recipe.englishName;
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
        <div className="min-h-screen flex flex-col items-center bg-primaryBackgroundColor p-4">
            <Card className="w-full max-w-4xl shadow-2 mb-6" title="Recettes">
                <p className="text-gray-700 mb-6">
                    Découvrez nos délicieuses recettes et régalez-vous en famille ou entre amis.
                </p>
                <div className="flex gap-5">
                    <Button
                        label="Pas d'idées ?"
                        icon="pi pi-refresh"
                        className="p-button-success"
                        onClick={() => randomizeRecipeFromBDD()}
                        // onClick={() => generateRecipe("generate-recipes-from-bdd")}
                        disabled={loading}
                    />
                    <Button
                        label="Générer des recettes à partir de votre panier"
                        icon="pi pi-refresh"
                        className="p-button-success"
                        onClick={() => generateRecipe("generate-recipes-from-cart")}
                        disabled={loading}
                    />

                    <Button
                        label="Analyser une recette"
                        icon="pi pi-refresh"
                        className="p-button-success"
                        onClick={() => {
                            setSelectedAction("analyse-recipe");
                            setImageUploadVisible(true);
                        }}
                        disabled={loading}
                    />
                    <Button
                        label="Générer des recettes depuis votre frigo"
                        icon="pi pi-refresh"
                        className="p-button-success"
                        onClick={() => {
                            setSelectedAction("fridge");
                            setImageUploadVisible(true);
                        }}
                        disabled={loading}
                    />
                </div>
            </Card>

            <ImageUploadDialog
                visible={imageUploadVisible}
                onHide={() => setImageUploadVisible(false)}
                onUpload={handleImageUpload}
            />

            <IngredientsDialog
                visible={ingredientsDialogVisible}
                ingredients={ingredients}
                recipeName={recipeName}
                onHide={() => setIngredientsDialogVisible(false)}
                addProduct={addProduct}
                format={selectedFormat}
            />

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