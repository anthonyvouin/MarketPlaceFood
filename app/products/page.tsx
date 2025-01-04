'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { filterProduct } from '../services/products/product';
import ProductCard from '../components/ProductCard/ProductCard';
import { getAllCategories } from '../services/category/category';
import { ProductDto } from '../interface/product/productDto';
import { CategoryDto } from '../interface/category/categoryDto';
import { getPageName } from '@/app/utils/utils';
import { Slider, SliderChangeEvent } from 'primereact/slider';
import { Checkbox } from 'primereact/checkbox';

export default function Products() {
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductDto[]>([]);
    const [filters, setFilters] = useState<{ [key in keyof ProductDto]?: any }>({});
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const bgColors = ['bg-tertiaryColorPink', 'bg-tertiaryColorOrange', 'bg-tertiaryColorBlue', 'bg-tertiaryColorPurple'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allCategories = await getAllCategories();
                setCategories(allCategories);
                await fetchProducts(filters);
            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
            }
        };
        fetchData();
        getPageName();
    }, []);

    useEffect(() => {
        handleFilterChange('price', { gte: priceRange[0] * 100, lte: priceRange[1] * 100 });
        handleFilterChange('categoryId', selectedCategories.length > 0 ? { in: selectedCategories } : undefined);
    }, [priceRange, selectedCategories]);

    const fetchProducts = async (filters: any): Promise<void> => {
        try {
            const filteredProducts = await filterProduct(filters);
            setProducts(filteredProducts);
            setFilteredProducts(filteredProducts);
        } catch (error) {
            console.error('Erreur lors de la récupération des produits :', error);
        }
    };

    const handleFilterChange = (key: keyof ProductDto, value: any): void => {
        setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
        fetchProducts({ ...filters, [key]: value });
    };

    const handlePriceChange = (e: SliderChangeEvent): void => {
        setPriceRange(e.value as [number, number]);
    };

    const handleCategoryChange = (categoryId: string): void => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
        );
    };

    return (
        <section className="w-full">
            <div className="h-[30vh] md:h-[40vh] lg:h-[85vh]">
                <Image 
                    src="/images/hero-banner-product-page.jpg"
                    alt="Banner"
                    width={1400}
                    height={1000}
                    className="w-full h-full object-cover brightness-50"
                />
            </div>

            <div className="mb-8 px-4 md:px-10">
                <h2 className="text-xl font-bold mb-4">Filtres</h2>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Prix</h3>
                    {priceRange[0]} - {priceRange[1]} €
                    <Slider
                        value={priceRange}
                        onChange={handlePriceChange}
                        range
                        min={0}
                        max={50}
                        step={1}
                        pt={{
                            handle: { className: 'bg-actionColor' },
                            range: { className: 'bg-actionColor' },
                        }}
                    />
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Catégories</h3>
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2 mt-2">
                            <Checkbox
                                inputId={category.id}
                                value={category.id}
                                onChange={() => handleCategoryChange(category.id)}
                                checked={selectedCategories.includes(category.id)}
                            />
                            <label htmlFor={category.id} className="text-sm">{category.name}</label>
                        </div>
                    ))}
                </div>
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4 md:px-10 gap-6">
                    {filteredProducts.map((product, index) => (
                        <ProductCard
                            key={product.id}
                            productSlug={product.slug}
                            product={product}
                            bgColor={bgColors[index % bgColors.length]}
                        />
                    ))}
                </div>
            ) : (
                <div className="h-[30vh] text-center text-gray-500 mt-20">
                    <p>Aucun produit ne correspond aux critères sélectionnés.</p>
                </div>
            )}
        </section>
    );
}
