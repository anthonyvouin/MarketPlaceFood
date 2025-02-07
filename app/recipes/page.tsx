"use client";

import { useEffect, useContext, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { ToastContext } from "../provider/toastProvider";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import RecipeCard from "../components/recipe/RecipeCard";
import IngredientsDialog from "../components/IngredientsDialog";
import ImageUploadDialog from "../components/uploadImageDialog";
import { useSideBarBasket } from "../provider/sideBar-cart-provider";
import { createRecipe, getAllRecipes, getRandomRecipes, getUserFavoriteRecipes } from "../services/recipes";
import { generateRecipes, analysePicture } from "../services/ia-integration/ia";
import { getImageFromPixabay, searchProduct } from "../services/products/product";
import { uploadTemporaryImageToCloudinary } from "@/lib/uploadImage";
import { formatPriceEuro } from "../pipe/formatPrice";
import { getClientCart } from "../services/cart/cart";
import { RecipeDto } from "../interface/recipe/RecipeDto";
import { CartDto } from "../interface/cart/cartDto";
import { useRouter } from "next/navigation";

export default function RecipesPage() {
    const { data: session } = useSession();
    const { show } = useContext(ToastContext);
    const [recipes, setRecipes] = useState<RecipeDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [imageUploadVisible, setImageUploadVisible] = useState(false);
    const [selectedAction, setSelectedAction] = useState<"recipe" | "fridge" | null>(null);
    const [ingredients, setIngredients] = useState<{
        products_not_found: string[],
        products_found: any[],
        original_ingredients: { name: string; quantity: string; }[],
    }>({
        products_not_found: [],
        products_found: [],
        original_ingredients: [],
    });
    const [ingredientsDialogVisible, setIngredientsDialogVisible] = useState(false);
    const [recipeName, setRecipeName] = useState("");
    const [selectedFormat, setSelectedFormat] = useState("");
    
    const router = useRouter();

    async function handleImageUpload(formData) {
        try {
            const imagePath = await uploadTemporaryImageToCloudinary(formData);
            if (selectedAction) {
                await analysePictureWithAI(selectedAction, imagePath);
            }
            return imagePath;
        } catch (error) {
            console.error("Erreur lors de l'upload de l'image:", error);
            throw error;
        }
    }

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

    // async function randomizeRecipeFromBDD() {
    //     try {
    //         setLoading(true);
    //         const recipes = await getRandomRecipes(9);
    //         setRecipes(recipes);
    //     } catch {
    //         show("Erreur", "Erreur lors de la génération", "error");
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    async function generateRecipe() {
        try {
            if (!session) {
                show("Erreur", "Vous devez être connecté", "error");
                return;
            }
            setLoading(true);
            const user = session.user.id;
            const cart: CartDto | null = await getClientCart(user);

            if (!cart || cart.cartItems.length === 0) {
                show("Erreur", "Votre panier est vide", "error");
                setLoading(false);
                return;
            }

            const products = cart.cartItems.map((item) => ({
                id: item.product.id,
                name: item.product.name,
                price: formatPriceEuro(item.product.price),
                quantity: item.quantity,
            }));

            const recipes = await generateRecipes("generate-recipes-from-cart", "", products);
            const userConnected = session?.user?.id;
            for (const recipe of recipes) {
                const generatedImageForRecipe = await getImageFromPixabay(recipe.englishName);
                recipe.image = generatedImageForRecipe;
                delete recipe.englishName;
                if (userConnected) {
                    const createdRecipe = await createRecipe(recipe, userConnected) as { slug: string };
                    router.push(`/recipes/${createdRecipe.slug}`);
                } else {
                    throw new Error("User is not connected");
                }
            }
        } catch (error) {
            show("Erreur", "Erreur lors de la génération", "error");
            console.error("Erreur lors de la génération:", error);
        } finally {
            setLoading(false);
        }
    }

    const { addProduct } = useSideBarBasket();

      const fetchRecipesAndFavorites = useCallback(async (fetchRandom = false) => {
        setLoading(true);
        try {
            let fetchedRecipes: RecipeDto[] = [];
            if (fetchRandom) {
                fetchedRecipes = await getRandomRecipes(9);
            } else {
                fetchedRecipes = await getAllRecipes();
                if (fetchedRecipes) {
                    fetchedRecipes = (fetchedRecipes as unknown as { recipes: RecipeDto[] })?.recipes;
                }
            }
            
            let favoriteRecipesIds: string[] = [];
            if (session?.user?.id) {
                const favoriteRecipes = await getUserFavoriteRecipes(session.user.id);
                favoriteRecipesIds = favoriteRecipes?.recipes.map(recipe => recipe.id) || [];
            }
            
            setRecipes(fetchedRecipes.map(recipe => ({
                ...recipe,
                isFavorite: favoriteRecipesIds.includes(recipe.id),
            })));
        } catch (error) {
            show("Erreur", "Erreur lors du chargement des recettes", "error");
        } finally {
            setLoading(false);
        }
    }, [session, show]);

    useEffect(() => {
        if (session) {
            fetchRecipesAndFavorites();
        }
    }, [session, fetchRecipesAndFavorites]);

    return (
        <div className="min-h-screen flex flex-col items-center p-6 sm:p-10 bg-gray-100 mt-16">
            <div className="w-full max-w-4xl text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-primaryColor">
                    <span role="img" aria-label="Recettes Gourmandes">🍽️</span> Recettes Gourmandes
                </h1>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                    Découvrez, générez et savourez des recettes adaptées à vos envies !
                </p>
            </div>
    
            <div className="w-3/4 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <Button 
                    label="🔄 Aléatoires" 
                    className="bg-pink-600 text-white shadow-lg h-16 focus:ring-4 focus:ring-pink-300"
                    aria-label="Générer des recettes aléatoires"
                    onClick={() => fetchRecipesAndFavorites(true)}
                />
                <Button 
                    label="🛒 Panier → Recette" 
                    className="bg-orange-600 text-white shadow-lg h-16 focus:ring-4 focus:ring-orange-300"
                    aria-label="Convertir panier en recette"
                    onClick={generateRecipe} 
                />
                <Button
                    label="📷 Analyser une recette"
                    className="bg-blue-600 text-white shadow-lg h-16 focus:ring-4 focus:ring-blue-300"
                    aria-label="Analyser une image de recette"
                    onClick={() => {
                        setSelectedAction("recipe");
                        setImageUploadVisible(true);
                    }}
                />
                <Button
                    label="🥦 Frigo"
                    className="bg-purple-600 text-white shadow-lg h-16 focus:ring-4 focus:ring-purple-300"
                    aria-label="Analyser le contenu du frigo"
                    onClick={() => {
                        setSelectedAction("fridge");
                        setImageUploadVisible(true);
                    }}
                />
            </div>
    
            {loading ? (
                <ProgressSpinner className="mt-6" />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6 w-full max-w-6xl">
                    {recipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} favorite={recipe.isFavorite} />
                    ))}
                </div>
            )}
    
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
        </div>
    );
}    