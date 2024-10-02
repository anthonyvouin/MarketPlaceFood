'use client';

import CreateCategory from "@/app/components/category/createCategory";
import CategoryList from "@/app/components/category/getAllCategory";

const CategoryPage = () => {
  
  return (
    <div>
      <h1>Page de gestion des catégories</h1>
      <CreateCategory />
      <CategoryList />

  </div>
  );
};

export default CategoryPage;
