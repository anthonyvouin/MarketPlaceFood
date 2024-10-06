'use client';

import React, { useState, useEffect } from 'react';
import { CategoryDto } from '@/app/interface/category/categoryDto';
import { CategoryListProps } from '@/app/interface/category/props';
import { deleteCategoryById } from '@/app/services/category/category'; // Import de la fonction delete

const CategoryList: React.FC<CategoryListProps> = ({ categories: initialCategories }) => {
    const [categories, setCategories] = useState<CategoryDto[]>([]);

    useEffect(() => {
        if (initialCategories && Array.isArray(initialCategories)) {
            setCategories(initialCategories);
        }
    }, [initialCategories]);

    const handleDelete = async (id: CategoryDto['id']) => {
        try {
            await deleteCategoryById(id);
            setCategories((prevCategories) => prevCategories.filter((category) => category.id !== id));
        } catch (error) {
            console.error('Erreur lors de la suppression de la catégorie:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">Liste des Catégories</h2>
            {categories.length === 0 ? (
                <p className="text-center text-gray-500">Aucune catégorie disponible.</p>
            ) : (
                <ul className="space-y-2">
                    {categories.map((category: CategoryDto) => (
                        <li key={category.id} className="border-b border-gray-200 py-2 flex justify-between items-center">
                            <span className="font-medium">{category.name}</span>

                            <button
                                onClick={() => handleDelete(category.id)} 
                                className="text-red-600 hover:text-red-800"
                                title="Supprimer cette catégorie"
                            >
                                ❌
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CategoryList;
