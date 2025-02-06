'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { filterProduct } from '../services/products/product';
import ProductCard from '../components/ProductCard/ProductCard';
import { getAllCategories } from '../services/category/category';
import { ProductDto } from '../interface/product/productDto';
import { CategoryDto } from '../interface/category/categoryDto';
import { getPageName } from '@/app/utils/utils';
import { SliderChangeEvent } from 'primereact/slider';
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import ProductFiltersAside from '../components/ProductFiltersAside';
import SelectCategories from '../components/SelectCategories';
import Pagination from '../components/Pagination';

const bgColors = ['bg-tertiaryColorPink', 'bg-tertiaryColorOrange', 'bg-tertiaryColorBlue', 'bg-tertiaryColorPurple'];
const booleanOptions = [
  { label: 'Oui', value: true },
  { label: 'Non', value: false },
];

export default function Products() {
    const [filteredProducts, setFilteredProducts] = useState<ProductDto[]>([]);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
    const [filters, setFilters] = useState<{ price?: { gte: number; lte: number }; categoryId?: { in: string[] }; discountId?: boolean }>({});
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 12;

    const handlePageChange = (page: number): void => {
        setCurrentPage(page);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const allCategories = await getAllCategories();
        setCategories(allCategories);
        await fetchProducts(filters);
        getPageName();
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => fetchProducts(filters), 300);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const fetchProducts = async (currentFilters: any): Promise<void> => {
    try {
      const filteredProducts = await filterProduct(currentFilters);
      setFilteredProducts(filteredProducts);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits :', error);
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: any): void => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
  };

    const handlePriceChange = (e: SliderChangeEvent): void => {
        const newPriceRange = e.value as [number, number];
        setPriceRange(newPriceRange);
        handleFilterChange('price', { gte: newPriceRange[0] * 100, lte: newPriceRange[1] * 100 });
    };

    const handleCategoryChange = (categoryId: string | string[]): void => {
        const updatedCategories =
            Array.isArray(categoryId) ? categoryId : selectedCategories.includes(categoryId)
                ? selectedCategories.filter((id) => id !== categoryId)
                : [...selectedCategories, categoryId];

        setSelectedCategories(updatedCategories);
        handleFilterChange('categoryId', { in: updatedCategories });
        setCurrentPage(1);
    };

    const updateFilters = (e: { value: boolean }): void => {
        setSelectedOption(e.value);
        handleFilterChange('discountId', e.value ? { not: null } : null);
        setCurrentPage(1);
    };

    const resetFilters = (): void => {
        setSelectedCategories([]);
        setPriceRange([0, 50]);
        setSelectedOption(null);
        setFilters({});
        setCurrentPage(1);
    };

    return (
        <section className="w-full">
            <Banner />
            <div className="flex flex-col gap-8 p-8 bg-gray-50 rounded-lg shadow-lg">
                <FilterControls
                    categories={categories}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    handleCategoryChange={handleCategoryChange}
                    selectedOption={selectedOption}
                    updateFilters={updateFilters}
                    isFilterOpen={isFilterOpen}
                    setIsFilterOpen={setIsFilterOpen}
                />
                <ProductFiltersAside
                    categories={categories}
                    handlePriceChange={handlePriceChange}
                    handleCategoryChange={handleCategoryChange}
                    isFilterOpen={isFilterOpen}
                    setIsFilterOpen={setIsFilterOpen}
                    priceRange={priceRange}
                    selectedCategories={selectedCategories}
                    onReset={resetFilters}
                    selectedOption={selectedOption}
                    updateFilters={updateFilters}
                    booleanOptions={booleanOptions}
                />
                <ProductGrid filteredProducts={currentProducts} />
                <Pagination
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredProducts.length}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </section>
    );
}

const Banner = () => (
  <div className="relative h-[30vh] md:h-[40vh] lg:h-[85vh]">
    <Image
      src="/images/hero-banner-product-page.jpg"
      alt="Banner"
      layout="fill"
      className="object-cover brightness-50"
    />
    <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
      <h1 className="text-4xl font-bold">Découvrez Nos Produits</h1>
      <p className="text-lg mt-2">Trouvez ce que vous cherchez facilement !</p>
    </div>
  </div>
);

const FilterControls = ({
  categories,
  selectedCategories,
  setSelectedCategories,
  handleCategoryChange,
  selectedOption,
  updateFilters,
  isFilterOpen,
  setIsFilterOpen,
}) => (
  <div className="flex flex-col  md:flex-row md:border-y-2 md:border-l-2 border-2 border-black w-max items-stretch">
    <SelectCategories
      categories={categories}
      selectedCategories={selectedCategories}
      setSelectedCategories={setSelectedCategories}
      handleCategoryChange={handleCategoryChange}
    />
    <FloatLabel className="mt-8 md:mt-0 md:mb-0">
      <Dropdown
        inputId="is-discounted"
        value={selectedOption}
        onChange={updateFilters}
        options={booleanOptions}
        optionLabel="label"
        className="w-full md:w-48 md:border-r-2 border-black rounded-none px-4"
      />
      <label htmlFor="is-discounted" className="border-black">En promotion ?</label>
    </FloatLabel>
    <p className="w-full md:w-48 md:border-r-2 px-4 mt-8 md:mt-0 md:mb-0 min-h-full border-black bg-white text-black hover:bg-black hover:text-white flex items-center justify-center cursor-pointer gap-4 font-manrope"
       onClick={() => setIsFilterOpen(!isFilterOpen)}>
      <i className={`pi ${isFilterOpen ? 'pi-times' : 'pi-filter'}`}></i>
      {isFilterOpen ? 'Fermer les filtres' : 'Plus de filtres'}
    </p>
  </div>
);

const ProductGrid = ({ filteredProducts }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
    {filteredProducts.length > 0 ? (
      filteredProducts.map((product, index) => (
        <ProductCard
          key={product.id}
          productSlug={product.slug}
          product={product}
          bgColor={bgColors[index % bgColors.length]}
        />
      ))
    ) : (
      <div className="col-span-full flex justify-center items-center text-gray-500 text-lg">
        Aucun produit ne correspond aux critères sélectionnés.
      </div>
    )}
  </div>
);