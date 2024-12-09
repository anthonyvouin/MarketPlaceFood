import {CategoryDto} from "@/app/interface/category/categoryDto";

export interface CategoryListProps {
    categories: CategoryDto[];
    handleUpdate:(categorie: CategoryDto) => void;
    handleDelete:(categorie: CategoryDto) => void;
}