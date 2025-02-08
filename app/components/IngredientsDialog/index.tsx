"use client";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useState, useEffect, useContext } from "react";
import { generateRecipes } from "@/app/services/ia-integration/ia";
import { getImageFromPixabay } from "@/app/services/products/product";
import { createRecipe } from "@/app/services/recipes";
import { ToastContext } from "@/app/provider/toastProvider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ProgressSpinner } from "primereact/progressspinner";

interface Ingredient {
  name: string;
  quantity: string;
  mustBeUsed: boolean;
}

export default function IngredientsDialog({ visible, ingredients, recipeName, onHide, addProduct, format }) {
    const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
    const [loading, setLoading] = useState(false);
    const { show } = useContext(ToastContext);
    const router = useRouter();
    const { data: session } = useSession();
  
    async function createAnalyzedRecipe(ingredients) {
      try {
        setLoading(true);
        const userConnected = session?.user?.id;
        const recipes = await generateRecipes("generate-recipe-from-image-of-recipe", "", ingredients.original_ingredients, recipeName);
  
        for (const recipe of recipes) {
          recipe.image = await getImageFromPixabay(recipe.englishName);
          console.log(recipe);
          delete recipe.englishName;
  
          if (userConnected) {
            const createdRecipe: any = await createRecipe(recipe, userConnected);
            router.push(`/recipes/${createdRecipe.slug}`);
          } else {
            throw new Error("User is not connected");
          }
        }
  
        show("Succès", "Recette créée avec succès !", "success");
      } catch (error) {
        console.error(error);
        show("Erreur", "Erreur lors de la création de la recette", "error");
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
        const ingredientsToUse = selectedIngredients.filter((ingredient) => ingredient.mustBeUsed);
        const recipes = await generateRecipes(format, "", ingredientsToUse);
        const generatedRecipes: any[] = [];
  
        for (const recipe of recipes) {
          recipe.image = await getImageFromPixabay(recipe.englishName);
          delete recipe.englishName;
          const createdRecipe: any = await createRecipe(recipe, user);
          generatedRecipes.push(createdRecipe);
        }
  
        if (generatedRecipes.length > 0) {
          show("Succès", "Recettes générées avec succès", "success");
          router.push(`/recipes/${generatedRecipes[0].slug}`);
        } else {
          show("Erreur", "Erreur lors de la génération des recettes", "error");
        }
      } catch (error) {
        console.error(error);
        show("Erreur", "Erreur lors de la génération des recettes", "error");
      } finally {
        setLoading(false);
      }
    }
  
    useEffect(() => {
      if (ingredients?.original_ingredients) {
        setSelectedIngredients(
          ingredients.original_ingredients.map((ingredient) => ({
            ...ingredient,
            mustBeUsed: true,
          }))
        );
      }
    }, [ingredients]);
  
    const toggleIngredientUsage = (index) => {
      const updatedIngredients = [...selectedIngredients];
      updatedIngredients[index].mustBeUsed = !updatedIngredients[index].mustBeUsed;
      setSelectedIngredients(updatedIngredients);
    };

  const foundIngredientsFooter = (
    <div className="flex justify-between w-full">
      <Button label="Fermer" icon="pi pi-times" onClick={onHide} className="p-button-text" />
      {format === "fridge" && (
        <Button
          label="Générer une recette"
          icon={loading ? "pi pi-spin pi-spinner" : "pi pi-external-link"}
          disabled={loading}
          onClick={() => generateRecipe("generate-recipes-from-fridge")}
        />
      )}
      {format === "recipe" && (
        <>
          {ingredients.products_found.length > 0 && (
            <Button
              label="Tout ajouter au panier"
              icon="pi pi-shopping-cart"
              onClick={() => {
                ingredients.products_found.forEach((ingredient) => addProduct(ingredient, 1));
                onHide();
              }}
              className="p-button-success"
            />
          )}
          <Button
            label="Générer une recette"
            icon={loading ? "pi pi-spin pi-spinner" : "pi pi-external-link"}
            disabled={loading}
            onClick={() => createAnalyzedRecipe(ingredients)}
          />
        </>
      )}
    </div>
  );

  return (
    <Dialog
      header="Résultat de l'analyse des ingrédients"
      visible={visible}
      style={{ width: "90vw", minHeight: "50vh" }}
      footer={foundIngredientsFooter}
      onHide={onHide}
    >
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <ProgressSpinner />
        </div>
      ) : (
        <>
          {format === "recipe" && (
            <>
              {ingredients.products_found.length === 0 && ingredients.products_not_found.length === 0 ? (
                <div className="text-center">
                  <h3 className="text-red-600 font-bold text-lg">Aucun ingrédient trouvé</h3>
                  <p>Aucun ingrédient n'a été trouvé pour cette recette.</p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <h3 className="font-bold text-lg">Pour réaliser votre {recipeName} :</h3>
                    <ul className="list-disc pl-5">
                      {ingredients?.original_ingredients?.map((ingredient, index) => (
                        <li key={index}>
                          {ingredient.name} - {ingredient.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Produits non trouvés */}
                  {ingredients.products_not_found.length > 0 && (
                    <div className="mb-4 p-4 border border-red-500 bg-red-100 rounded-md">
                      <h3 className="text-red-600 font-bold text-lg">Produits non trouvés :</h3>
                      <p>Une notification a été envoyée à nos vendeurs pour ces produits.</p>
                      <ul className="list-disc pl-5 text-red-500">
                        {ingredients.products_not_found.map((product, index) => (
                          <li key={index}>{product}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Produits trouvés */}
                  {ingredients.products_found.length > 0 && (
                    <div className="p-4 border border-green-500 bg-green-100 rounded-md">
                      <h3 className="text-green-600 font-bold text-lg">Produits trouvés :</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {ingredients.products_found.map((ingredient, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 border rounded bg-white shadow-sm"
                          >
                            <span className="text-gray-800">{ingredient.name}</span>
                            <Button
                              icon="pi pi-plus"
                              className="p-button-rounded p-button-success p-button-sm"
                              onClick={() => addProduct(ingredient, 1)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {format === "fridge" && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-10">
              {selectedIngredients.map((ingredient, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center p-4 border rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all
                    ${ingredient.mustBeUsed ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500"}`}
                  onClick={() => toggleIngredientUsage(index)}
                >
                  <span className="font-semibold text-gray-800">{ingredient.name}</span>
                  <Button
                    icon={ingredient.mustBeUsed ? "pi pi-check" : "pi pi-times"}
                    className={`p-button-rounded ${ingredient.mustBeUsed ? "p-button-success" : "p-button-danger"}`}
                    onClick={() => toggleIngredientUsage(index)}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Dialog>
  );
}
