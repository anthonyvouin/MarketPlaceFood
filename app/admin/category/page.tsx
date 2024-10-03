'use client';

import CreateCategory from "@/app/components/category/createCategory";
import CategoryList from "@/app/components/category/categoryList";
import {Category} from "@prisma/client";
import {getAllCategories} from "@/app/services/category/category";
import {useEffect, useState} from "react";

const CategoryPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const categoriesData: Category[] = await getAllCategories();
            setCategories(categoriesData);
        }
        fetchCategories();
    }, []);

    const handleAddCategory = (data: Category) => {
        const updatedCategories = [...categories, data];
        updatedCategories.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(updatedCategories);
    };

    return (
        <div>
            <h1>Page de gestion des catégories</h1>
            <CreateCategory emitAddCategory={handleAddCategory}/>
            <CategoryList categories={categories}/>

        </div>
    );
};

export default CategoryPage;
