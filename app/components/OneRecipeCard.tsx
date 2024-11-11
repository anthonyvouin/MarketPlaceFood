import { useEffect, useState } from "react";
import { getProductById } from "../services/products/product";
import { RecipeCardDto } from "../interface/recipe/recipeCardDto";
import { ProductDto } from "../interface/product/productDto";
// import { formatPrice } from "../pipe/format"; // Unused import
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Image from 'next/image';

const RecipeCard = ({ recipe }: { recipe: RecipeCardDto }) => {
    const [ingredients, setIngredients] = useState<ProductDto[]>([]);
    useEffect(() => {
        const ingredientsTab: ProductDto[] = []
        const fetchIngredients = async () => {
            for (const ingredient of recipe.ingredients) {
                const product = await getProductById(ingredient.productId);
                ingredientsTab.push({ ...product, quantity: ingredient.quantity });
            }
            setIngredients(ingredientsTab);
        }
        fetchIngredients();
    }, [recipe.ingredients]);
    
    const image = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png";
    const header = (
        <Image alt="Card" src={image} width={300} height={150} />
    );
    
    const footer = (
        <>
            <Button label="En savoir plus" className="p-button-text p-button-primary" />
        </>
    );

    return (
        <div className="card flex justify-content-center">
            <Card title={recipe.name} subTitle={recipe.category} footer={footer} header={header} className="md:w-25rem">
                <p>{recipe.description}</p>
                {/* <div className="grid grid-cols-2 gap-5">
                    {ingredients.map((ingredient, index) => (
                        <div key={index} className="flex gap-2">
                            <span>{ingredient.name}</span>
                            <span>{ingredient.quantity}</span>
                        </div>
                    ))}
                </div> */}
            </Card>
        </div>
    );
}

export default RecipeCard;
