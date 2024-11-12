export interface RecipeStepDto {
    id: string;
    recipeId: string;
    stepNumber: number;
    description: string;
    image?: string;
    duration?: number;
}