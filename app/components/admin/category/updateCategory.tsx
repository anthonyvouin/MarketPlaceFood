import React, { useState, useEffect } from 'react';
import { Category } from '@/app/interface/category/category';
import { updateCategory } from '@/app/services/category/category';


const UpdateCategory: React.FC<Category> = ({ categories, onUpdateCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCategory) {
      setNewName(selectedCategory.name);
    }
  }, [selectedCategory]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedCategory) {
      setError('Veuillez sélectionner une catégorie');
      return;
    }

    if (newName.trim() === '') {
      setError('Le nom de la catégorie ne peut pas être vide');
      return;
    }

    try {
      const updatedCategory: Category = await updateCategory({
        id: selectedCategory.id,
        name: newName.trim()
      });
      onUpdateCategory(updatedCategory);
      setSuccess('Catégorie mise à jour avec succès');
      setSelectedCategory(null);
      setNewName('');
    } catch (err) {
      setError('Erreur lors de la mise à jour de la catégorie');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">Mettre à jour une catégorie</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="category-select" className="block text-sm font-medium text-gray-700">
            Sélectionner une catégorie :
          </label>
          <select
            id="category-select"
            value={selectedCategory?.id || ''}
            onChange={(e) => setSelectedCategory(categories.find(c => c.id === e.target.value) || null)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="new-name" className="block text-sm font-medium text-gray-700">
            Nouveau nom :
          </label>
          <input
            type="text"
            id="new-name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Mettre à jour
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
    </div>
  );
};

export default UpdateCategory;