'use client';

import React, {useState, useEffect} from 'react';
import {CategoryDto} from '@/app/interface/category/categoryDto';
import {CategoryListProps} from '@/app/interface/category/props';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";

const CategoryList: React.FC<CategoryListProps> = ({categories: initialCategories, handleUpdate, handleDelete}) => {
        const [categories, setCategories] = useState<CategoryDto[]>([]);

        useEffect((): void => {
            if (initialCategories && Array.isArray(initialCategories)) {
                setCategories(initialCategories);
            }
        }, [initialCategories]);


        const actionsTemplate = (category: CategoryDto) => {
            return <div>
                <button
                    className="mr-8"
                    onClick={() => handleUpdate(category)}
                    title="Modifier cette catégorie"
                >
                    <span className="pi pi-pencil"></span>
                </button>
                <button
                    onClick={() => handleDelete(category)}
                    className="text-red-600 hover:text-red-800"
                    title="Supprimer cette catégorie"
                >
                    <span className="pi pi-times text-red-500"></span>
                </button>
            </div>
        }

        return (
            <div>
                {categories.length === 0 ? (
                    <p className="text-center text-gray-500">Aucune catégorie disponible.</p>
                ) : (
                    <DataTable value={categories} tableStyle={{minWidth: '50rem'}}>
                        <Column field="name" header="Nom"></Column>
                        <Column header="Action" body={actionsTemplate}></Column>
                    </DataTable>
                )}
            </div>
        );
    }
;

export default CategoryList;
