    "use client"

    import { useEffect, useContext, useState } from "react";
    import { useSession } from "next-auth/react";
    import { ToastContext } from "../provider/toastProvider";
    import { Button } from "primereact/button";
    import { Card } from "primereact/card";
    import { Dialog } from "primereact/dialog";
    import { createRecipe, getAllRecipes } from "../services/recipes";
    import { analysePicture, generateRecipes } from "../services/ia-integration/ia";
    // import Link from "next/link";
    import { getImageFromGoogle, searchProduct } from "../services/products/product";
    import { ProgressSpinner } from 'primereact/progressspinner';
    import { createOrUpdateMissingIngredientReport } from "../services/missingIngredientReport";
    import { useSideBarBasket } from "../provider/sideBar-basket-provider";
    import RecipeCard from "../components/recipe/RecipeCard";
import IngredientsDialog from "../components/IngredientsDialog";

    export default function RecipesPage() {
        const { data: session } = useSession();
        const { show } = useContext(ToastContext);
        const [recipes, setRecipes] = useState([]);
        const [recipeName, setRecipeName] = useState(null);
        const [ingredients, setIngredients] = useState({
            products_not_found: [],
            products_found: [],
            original_ingredients: [],
        });
        const [loading, setLoading] = useState(false);
        const [ingredientsDialogVisible, setIngredientsDialogVisible] = useState(false);

        async function analyseRecipe() {
            try {
                setLoading(true);
                const recipe = await analysePicture("recipe");
                setRecipeName(recipe.name);
                // const recipe = {
                //     "name": "Moussaka",
                //     "ingredients": [
                //         {
                //             "name": "Aubergine",
                //             "quantity": "150 g"
                //         },
                //         {
                //             "name": "Viande hachée (bœuf ou agneau)",
                //             "quantity": "100 g"
                //         },
                //         {
                //             "name": "Oignon",
                //             "quantity": "1 petit"
                //         },
                //         {
                //             "name": "Ail",
                //             "quantity": "1 gousse"
                //         },
                //         {
                //             "name": "Tomate concassée",
                //             "quantity": "100 g"
                //         },
                //         {
                //             "name": "Huile d'olive",
                //             "quantity": "1 cuillère à soupe"
                //         },
                //         {
                //             "name": "Cannelle",
                //             "quantity": "une pincée"
                //         },
                //         {
                //             "name": "Cornichon",
                //             "quantity": "2 petits"
                //         },
                //         {
                //             "name": "Sel",
                //             "quantity": "une pincée"
                //         },
                //         {
                //             "name": "Poivre",
                //             "quantity": "une pincée"
                //         },
                //         {
                //             "name": "Pommes de terre",
                //             "quantity": "100 g"
                //         },
                //         {
                //             "name": "Beurre",
                //             "quantity": "20 g"
                //         },
                //         {
                //             "name": "Farine",
                //             "quantity": "20 g"
                //         },
                //         {
                //             "name": "Lait",
                //             "quantity": "200 ml"
                //         },
                //         {
                //             "name": "Fromage râpé",
                //             "quantity": "30 g"
                //         }
                //     ]
                // };

                const foundProducts = [];
                const notFoundProducts = [];
                const originalIngredients = []

                for (const ingredient of recipe.ingredients) {
                    const ingredientInBdd = await searchProduct(ingredient.name)
                    const isIngredientExist = ingredientInBdd ? true : false;
                    originalIngredients.push(ingredient);
                    if (!isIngredientExist) {
                        notFoundProducts.push(ingredient.name);
                        const report = createOrUpdateMissingIngredientReport({ name: ingredient.name });
                    } else {
                        console.log(ingredientInBdd);
                        foundProducts.push(ingredientInBdd);
                    }
                }

                setIngredients({
                    products_not_found: notFoundProducts,
                    products_found: foundProducts,
                    original_ingredients: originalIngredients
                });

                setIngredientsDialogVisible(true);
                setLoading(false);
            } catch (error) {
                show("Erreur", "Erreur lors de l'analyse de la recette", "error");
                setLoading(false);
            }
        }

        const { addProduct } = useSideBarBasket();

        async function generateRecipe(format) {
            try {
                if (!session) {
                    show("Erreur", "Vous devez être connecté pour générer des recettes", "error");
                    return;
                }
                setLoading(true);
                const user = session.user.id;
                let recipes = [];
                if (format === "generate-recipes-from-bdd") {
                    recipes = await generateRecipes(format);
                } else {
                    const localStorageBasket: string | null = localStorage.getItem('basketSnapAndShop')
                    if (!localStorageBasket) {
                        show("Erreur", "Votre panier est vide", "error");
                        return;
                    }
                    const basket = JSON.parse(localStorageBasket);
                    let products = basket.basket
                    if (!products || products.length === 0) {
                        show("Erreur", "Votre panier est vide", "error");
                        return;
                    }
                    products = products.map((product: any) => {
                        return {
                            id: product.product.id,
                            name: product.product.name,
                            price: product.product.price,
                        }
                    });

                    recipes = await generateRecipes(format, "", products);
                }
                const generatedRecipes = [];
                for (const recipe of recipes) {
                    const generatedImageForRecipe = await getImageFromGoogle(recipe.name);
                    recipe.image = generatedImageForRecipe;
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
            <div className="min-h-[85vh] flex flex-col items-center bg-primaryBackgroundColor p-4">
                <Card className="w-full max-w-4xl shadow-2 mb-6" title="Recettes">
                    <p className="text-gray-700 mb-6">
                        Découvrez nos délicieuses recettes et régalez-vous en famille ou entre amis.
                    </p>
                    <div className="flex gap-5">
                        <Button
                            label="Pas d'idées ?"
                            icon="pi pi-refresh"
                            className="p-button-success"
                            onClick={() => generateRecipe("generate-recipes-from-bdd")}
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
                            onClick={() => analyseRecipe()}
                            disabled={loading}
                        />
                    </div>
                </Card>

                <IngredientsDialog
                    visible={ingredientsDialogVisible}
                    ingredients={ingredients}
                    recipeName={recipeName}
                    onHide={() => setIngredientsDialogVisible(false)}
                    addProduct={addProduct}
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