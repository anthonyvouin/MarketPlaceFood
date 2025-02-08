import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { RecipeDto } from "@/app/interface/recipe/RecipeDto";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getUserFavoriteRecipes, toggleRecipeFavorite } from "@/app/services/recipes";
import { useContext, useEffect, useState } from "react";
import { ToastContext } from "@/app/provider/toastProvider";

const RecipeCard = ({ recipe, favorite = false, onUnfavorite }: { recipe: RecipeDto, favorite?: boolean, onUnfavorite?: () => void }) => {
    const [isRecipeFavorite, setIsRecipeFavorite] = useState(favorite);
    const { data: sessionData } = useSession();
    const { show } = useContext(ToastContext);

    const handleFavoriteToggle = async () => {
        if (!sessionData?.user?.id) {
            show("Erreur", "Vous devez être connecté pour ajouter des recettes aux favoris", "error");
            return;
        }

        try {
            const response = await toggleRecipeFavorite(recipe.id, sessionData.user.id);
            setIsRecipeFavorite(response.isFavorited);
            if (response.isFavorited === false && onUnfavorite) {
                onUnfavorite();
            }
            show(response.isFavorited ? "Recette ajoutée aux favoris" : "Recette retirée des favoris", "", "success");
        } catch (error) {
            console.error("Erreur lors de l'ajout aux favoris:", error);
            show("Erreur", "Une erreur est survenue lors de l'ajout aux favoris", "error");
        }
    };

    return (
        <div className="w-full bg-light shadow-lg rounded-xl overflow-hidden transform transition-transform duration-300 hover:scale-105 flex flex-col justify-between h-full">
            <div className="relative">
                <img src={recipe.image} alt={recipe.name} className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="p-4 flex-grow">
            <h2 className="text-lg font-bold text-foreground">{recipe.name}</h2>
            <p className="text-sm text-grey">{recipe.category}</p>
            <p className="text-gray-700 mt-2 line-clamp-3">{recipe.description}</p>
            </div>

            <div className="px-4 pb-4 flex justify-between items-center">
            <Link href={`/recipes/${recipe.slug}`}>
                <Button
                label="Voir la recette"
                icon="pi pi-eye"
                className="bg-actionColor hover:bg-darkActionColor text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
                />
            </Link>
            <Button 
                icon={isRecipeFavorite ? "pi pi-heart-fill" : "pi pi-heart"}
                onClick={handleFavoriteToggle}
                disabled={!sessionData?.user?.id}
                aria-label={isRecipeFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                className={`text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 ${isRecipeFavorite ? "bg-primaryColor hover:bg-redColor" : "bg-borderGrey hover:bg-grey"}`}
            />
            </div>
        </div>
    );
};

export default RecipeCard;