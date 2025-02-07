"use client";

import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ProgressSpinner } from "primereact/progressspinner";
import { deleteRecipe, getAllRecipes } from "@/app/services/recipes";
import { useRouter } from "next/navigation";

interface Recipe {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export default function RecipesAdminPage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchRecipes();
    }, []);

    async function fetchRecipes() {
        setLoading(true);
        try {
            const response = await getAllRecipes();
            setRecipes(response.recipes);
        } catch (error) {
            console.error("Erreur lors de la récupération des recettes :", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        setLoading(true);
        try {
            await deleteRecipe(id);
            await fetchRecipes();
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        } finally {
            setLoading(false);
        }
    }

    function handleEdit(slug: string) {
        router.push(`/admin/recipes/${slug}`);
    }

    function formatDate(date: string) {
        return new Date(date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-6">
            <div className="w-full max-w-6xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Gestion des Recettes</h1>

                {loading && recipes.length === 0 ? (
                    <div className="flex justify-center py-20">
                        <ProgressSpinner />
                    </div>
                ) : (
                    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <DataTable
                            value={recipes}
                            paginator
                            rows={5}
                            rowsPerPageOptions={[5, 10, 20]}
                            loading={loading}
                            className="w-full text-gray-700"
                            emptyMessage="Aucune recette disponible."
                        >
                            <Column 
                                field="name" 
                                header="Nom" 
                                sortable 
                                className="w-2/12 font-semibold text-gray-900" 
                            />
                            <Column
                                field="description" 
                                header="Description" 
                                sortable 
                                body={(rowData) => (
                                    <span className="text-gray-600">
                                        {rowData.description.length > 100 
                                            ? `${rowData.description.slice(0, 100)}...` 
                                            : rowData.description}
                                    </span>
                                )}
                                className="w-5/12"
                            />
                            <Column 
                                field="createdAt" 
                                header="Créé le" 
                                sortable 
                                body={(rowData) => (
                                    <span className="text-gray-500">{formatDate(rowData.createdAt)}</span>
                                )}
                                className="w-2/12"
                            />
                            <Column 
                                field="updatedAt" 
                                header="Mis à jour le" 
                                sortable 
                                body={(rowData) => (
                                    <span className="text-gray-500">{formatDate(rowData.updatedAt)}</span>
                                )}
                                className="w-2/12"
                            />
                            <Column
                                header="Actions"
                                className="w-2/12 text-center"
                                body={(rowData) => (
                                    <div className="flex justify-center space-x-2">
                                        <Button 
                                            icon="pi pi-pencil" 
                                            className="p-button-sm p-button-rounded p-button-text p-button-primary"
                                            tooltip="Modifier"
                                            onClick={() => handleEdit(rowData.slug)}
                                        />
                                        <Button 
                                            icon="pi pi-trash" 
                                            className="p-button-sm p-button-rounded p-button-text p-button-danger"
                                            tooltip="Supprimer"
                                            onClick={() => handleDelete(rowData.id)}
                                        />
                                    </div>
                                )}
                            />
                        </DataTable>
                    </div>
                )}
            </div>
        </div>
    );
}