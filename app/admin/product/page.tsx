"use client";
import React, { useState, useEffect } from 'react';
import { getAllCategories } from '@/app/services/category/category';
import { createProduct } from '@/app/services/products/product';

import { Category } from '@/app/interface/category/category';

export default function CreateProductPage() {
  const [product, setProduct] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    price: 0,
    categoryId: '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getAllCategories();
        setCategories(fetchedCategories);
      } catch (err) {
        console.error("Erreur lors de la récupération des catégories :", err);
        setError("Erreur lors de la récupération des catégories.");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: name === 'price' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

  

    try {
      await createProduct(product);
      setSuccess("Produit créé avec succès !");
      setProduct({
        name: '',
        slug: '',
        description: '',
        image: '',
        price: 0,
        categoryId: '',
      });
    } catch (err: any) {
      setError("Erreur lors de la création du produit : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Créer un Produit</h1>
      {loadingCategories ? (
        <p>Chargement des catégories...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}

          <div>
            <label>Nom:</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Slug:</label>
            <input
              type="text"
              name="slug"
              value={product.slug}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Image (URL):</label>
            <input
              type="text"
              name="image"
              value={product.image}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Prix:</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
              min="0"
              step="1"
            />
          </div>
          <div>
            <label>Catégorie:</label>
            <select
              name="categoryId"
              value={product.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Création en cours...' : 'Créer le produit'}
          </button>
        </form>
      )}
    </div>
  );
}
