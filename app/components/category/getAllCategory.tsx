'use client';

import { useEffect, useState } from 'react';
import { getAllCategories } from '../../services/category/category';
import { Category } from '../../interface/category';

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (err) {
        setError('Erreur lors de la récupération des catégories');
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">Liste des Catégories</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id} className="border-b border-gray-200 py-2">
            <span className="font-medium">{category.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
