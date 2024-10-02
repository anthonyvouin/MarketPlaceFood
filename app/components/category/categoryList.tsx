'use client';

import React from 'react';
import {Category} from '../../interface/category/category';
import {CategoryListProps} from '../../interface/category/props'

const CategoryList : React.FC<CategoryListProps>= ({categories}) => {
    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">Liste des Catégories</h2>
            <ul className="space-y-2">
                {categories.map((category:Category) => (
                    <li key={category.id} className="border-b border-gray-200 py-2">
                        <span className="font-medium">{category.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;
