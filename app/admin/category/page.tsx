'use client';
import CategoryList from "@/app/components/admin/category/categoryList";
import {Category} from "@prisma/client";
import {createCategory, deleteCategoryById, getAllCategories, updateCategory} from "@/app/services/category/category";
import React, {useContext, useEffect, useState} from "react";
import {getPageName} from "@/app/utils/utils";
import RoundedButton from "@/app/components/ui/rounded-button";
import {confirmDialog} from "primereact/confirmdialog";
import {CategoryDto} from "@/app/interface/category/categoryDto";
import {ToastContext} from "@/app/provider/toastProvider";

const CategoryPage = () => {
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const {show} = useContext(ToastContext);

    useEffect(() => {
        const fetchCategories = async () => {
            const categoriesData: Category[] = await getAllCategories();
            setCategories(categoriesData);
        }
        getPageName();
        fetchCategories();
    }, []);


    const deleteCategory = async (id: string): Promise<void> => {
        try {
            await deleteCategoryById(id);
            const filteredCategories: CategoryDto[] = categories.filter((category): boolean => category.id !== id);
            setCategories(filteredCategories)
            show('Suppression de catégorie', 'La catégorie a été supprimée avec succès.', 'success');

        } catch (error) {

            console.error('Erreur lors de la suppression de la catégorie:', error);
            show('Erreur de suppression', 'La categorie est rattachée à des produits.', 'error');

        }
    };

    const openDeleteCategorieDialog = (e?, categorie?: CategoryDto): void => {
        if(categorie){
            confirmDialog({
                message: <div>
                    <p>Êtes vous sure de vouloir supprimer la catégorie {categorie.name} ?</p>
                </div>
                ,
                header: 'Suppression de catégorie',
                acceptLabel: 'Oui',
                rejectLabel: 'Non',
                rejectClassName: 'mr-2.5 p-1.5 text-redColor',
                acceptClassName: 'bg-actionColor text-white p-1.5',
                async accept(): Promise<void> {
                    if (categorie.id) {
                        await deleteCategory(categorie.id);
                    }
                },

            })

        }

    }

    const openPopupCreateUpdate = (e?, categorie?: CategoryDto): void => {
        let newName: string = categorie?.name ? categorie.name : '';

        confirmDialog({
            message: <div>
                <form>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Nom de la catégorie :
                        </label>
                        <input
                            type="text"
                            id="name"
                            defaultValue={categorie ? categorie.name : ''}
                            onChange={(e) => newName = e.target.value}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                </form>
            </div>,
            header: categorie ? `modification de la catégorie  ${categorie.name}` : `Création d'une catégorie`,
            acceptLabel: 'Valider',
            rejectLabel: 'Annuler',
            rejectClassName: 'mr-2.5 p-1.5 text-redColor',
            acceptClassName: 'bg-actionColor text-white p-1.5',
            accept: async (): Promise<void> => {
                if (!categorie) {
                    await addCategory(newName)
                } else {
                    if (categorie.id) {
                        await updateCat(categorie, newName)
                    }

                }

            }
        })
    }
    const addCategory = async (name: string): Promise<void> => {

        const newCategory: CategoryDto = {name, visible: true};
        await createCategory(newCategory).then((res: CategoryDto): void => {
            const updatedCategories: CategoryDto[] = [...categories, res];
            updatedCategories.sort((a, b) => a.name.localeCompare(b.name));
            setCategories(updatedCategories);
            show('Ajout catégorie', `${res.name} a été ajouté à la liste des catégories`, "success")
        }).catch((e: Error) => show(`Erreur lors de l'enregistrement de la catégorie`, e.message, "error"));

    };

    const handleUpdate = (categorie: CategoryDto): void => {
        openPopupCreateUpdate(undefined, categorie)
    }

    const handleDelete = (categorie: CategoryDto): void => {
        openDeleteCategorieDialog(undefined, categorie)
    }

    const updateCat = async (categorie: CategoryDto, name: string) => {
        if (name.trim() === '') {
            show('Modification de catégorie', 'Le nom de la catégorie ne peut être vide', 'error');
            return
        }

        await updateCategory({
            id: categorie.id,
            name: name.trim(),
            visible: categorie.visible
        }).then((res) => {
            const updatedCategories: CategoryDto[] = categories.map(category =>
                category.id === res.id ? res : category
            );
            updatedCategories.sort((a, b) => a.name.localeCompare(b.name));
            setCategories(updatedCategories);
            show('Modification catégorie', `${categorie.name} a été remplacé par ${res.name}`, "success")
        }).catch((e: Error) => show(`Erreur lors de l'enregistrement de la catégorie`, e.message, "error"));

    };

    return (
        <div className="p-6 bg-primaryBackgroundColor h-full">
            <h1 className="text-3xl font-bold mb-8 text-center">Gestion des catégories</h1>
            <div className="flex flex-row-reverse mb-6">
                <RoundedButton onClickAction={openPopupCreateUpdate}
                               message="Ajouter une catégorie"
                               positionIcon="left"
                               classes="border-actionColor text-actionColor">
                </RoundedButton>

            </div>
            <CategoryList categories={categories} handleUpdate={handleUpdate} handleDelete={handleDelete}/>
        </div>
    );
};

export default CategoryPage;