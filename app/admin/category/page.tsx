'use client';

import CreateCategory from "@/app/components/admin/category/createCategory";
import CategoryList from "@/app/components/admin/category/categoryList";
import UpdateCategory from "@/app/components/admin/category/updateCategory";
import { Category } from "@prisma/client";
import { getAllCategories } from "@/app/services/category/category";
import { useEffect, useState } from "react";

const CategoryPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const categoriesData: Category[] = await getAllCategories();
            setCategories(categoriesData);
        }
        fetchCategories();
    }, []);

    const handleAddCategory = (newCategory: Category) => {
        const updatedCategories = [...categories, newCategory];
        updatedCategories.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(updatedCategories);
    };

    const handleUpdateCategory = (updatedCategory: Category) => {
        const updatedCategories = categories.map(category =>
            category.id === updatedCategory.id ? updatedCategory : category
        );
        updatedCategories.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(updatedCategories);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Gestion des catégories</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CreateCategory emitAddCategory={handleAddCategory} />
                <UpdateCategory categories={categories} onUpdateCategory={handleUpdateCategory} />
            </div>
            <CategoryList categories={categories} />
        </div>
    );
};

export default CategoryPage;