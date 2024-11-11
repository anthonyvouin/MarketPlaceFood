import { RecipeDto } from "./RecipeDto";

export interface RecipeCardDto {
    image: string | undefined;
    recipe: RecipeDto;
}