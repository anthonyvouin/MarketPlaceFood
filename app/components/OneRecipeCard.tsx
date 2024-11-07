import { useEffect, useState } from "react";
import { getProductById } from "../services/products/product";
import { RecipeCardDto } from "../interface/recipe/recipeCardDto";
import { ProductDto } from "../interface/product/productDto";
import { formatPrice } from "../pipe/format";

const RecipeCard = ({ recipe }: RecipeCardDto) => {
    const [ingredients, setIngredients] = useState<ProductDto[]>([]);
    useEffect( () => {
        const ingredientsTab = []
        const fetchIngredients = async () => {
            for (const ingredient of recipe.ingredients) {
                console.log(ingredient.id);
                const product = await getProductById(ingredient.id);
                ingredientsTab.push({ ...product, quantity: ingredient.quantity });
            }
            setIngredients(ingredientsTab);
        }
        fetchIngredients();
    }, [recipe.ingredients]);

    console.log(ingredients);

    return (
        <div className="bg-red-400 p-5 gap-5 grid items-center grid-rows-[0.5fr,1fr] h-max font-manrope">
            <span className="bg-blue-400 p-2">{recipe.category}</span>
            <div>
                <h2 className="font-bold">{recipe.name}</h2>
                <p>{recipe.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-5">
                {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2">
                        <span>{ingredient.name}</span>
                        <span>{ingredient.quantity}</span>
                    </div>
                ))}
            </div>
          
        </div>
    )
}

export default RecipeCard;