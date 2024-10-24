// import { useEffect, useState } from "react";
// import { getProductById } from "../services/products/product";
import { RecipeCardDto } from "../interface/recipe/recipeCardDto";
// import { ProductDto } from "../interface/product/productDto";
// import { formatPrice } from "../pipe/format";

const RecipeCard = ({ recipe }: RecipeCardDto) => {
    // useEffect( () => {
    //     const ingredientsTab = []
    //     const fetchIngredients = async () => {
    //         for (const ingredient of recipe.ingredients) {
    //             const product = await getProductById(ingredient.id);
    //             ingredientsTab.push({ ...product, quantity: ingredient.quantity });
    //         }
    //         setIngredients(ingredientsTab);
    //     }
    //     fetchIngredients();
    // }, [recipe.ingredients]);

    return (
        <div className="bg-red-400 p-5 gap-5 grid items-center grid-rows-[0.5fr,1fr] h-max font-manrope">
            <span className="bg-blue-400 p-2">{recipe.category}</span>
            <div>
                <h2 className="font-bold">{recipe.name}</h2>
                <p>{recipe.description}</p>
            </div>
          
        </div>
    )
}

export default RecipeCard;