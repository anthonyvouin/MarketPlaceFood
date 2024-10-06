"use client";
import React, { useState, useEffect } from 'react';
import { getAllCategories } from '@/app/services/category/category';
import { createProduct } from '@/app/services/products/product';
import { CategoryDto } from '@/app/interface/category/categoryDto';
import { uploadImage } from '@/lib/uploadImage';

export default function CreateProductPage() {
    const [product, setProduct] = useState({
        name: '',
        slug: '',
        description: '',
        image: '',
        price: 0,
        categoryId: '',
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
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
            [name]: value,
        }));
    };


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);


        try {
            let imagePath = product.image;
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                imagePath = await uploadImage(formData);
            }

            const productWithImage = { ...product, image: imagePath };
            await createProduct(productWithImage);
            setSuccess("Produit créé avec succès !");
            setProduct({
                name: '',
                slug: '',
                description: '',
                image: '',
                price: 0,
                categoryId: '',
            });
            setImageFile(null);
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
                        <label>Image:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
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
                            step="0.01"
                            min="0"
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
