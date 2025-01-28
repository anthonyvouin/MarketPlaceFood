"use client"

import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
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
        getLastRecipes();
    }, []);

    async function getLastRecipes() {
        setLoading(true);
        const lastRecipes = await getAllRecipes();
        setRecipes(lastRecipes.recipes);
        setLoading(false);
    }

    async function handleDelete(id: string) {
        setLoading(true);
        await deleteRecipe(id);
        await getLastRecipes();
        setLoading(false);
    }

    function handleEdit(slug: string) {
        router.push(`/admin/recipes/${slug}`);
    }

    return (
        <div className="flex-1 p-6 bg-gray-100">
            <h1 className="text-3xl font-semibold text-gray-800 mb-4">Recipes</h1>
            <div className="mb-4">
                <Button
                    label="Create new recipe"
                    icon="pi pi-plus"
                    className="bg-primaryColor text-white"
                />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <DataTable
                    value={recipes}
                    className="w-full"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 15]}
                    loading={loading}>
                    <Column field="name" header="Name" sortable />
                    <Column field="description" header="Description" sortable />
                    <Column field="createdAt" header="Created At" sortable />
                    <Column field="updatedAt" header="Updated At" sortable />
                    <Column
                        header="Actions"
                        body={(rowData) => (
                            <>
                                <Button
                                    label="Delete"
                                    icon="pi pi-trash"
                                    className="p-button-danger"
                                    onClick={() => handleDelete(rowData.id)}
                                />
                                <Button 
                                    label="Edit" 
                                    icon="pi pi-pencil" 
                                    className="p-button-primary"
                                    onClick={() => handleEdit(rowData.slug)}
                                />
                            </>
                        )}
                    />
                </DataTable>
            </div>
        </div>
    );
}