"use client"
import RoundedButton from "@/app/components/ui/rounded-button";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {Product} from "@prisma/client";
import {ProductDto} from "@/app/interface/product/productDto";
import {formatPrice} from "@/app/pipe/format";
import {getAllProducts} from "@/app/services/products/product";
import {getPageName} from "@/app/utils/utils";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";


export default function ProductPage() {
    const [products, setProducts] = useState<ProductDto[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const categoriesData: ProductDto[] = await getAllProducts();
            setProducts(categoriesData);
        }
        getPageName();
        fetchCategories();
    }, []);


    const router: AppRouterInstance = useRouter();

    const navigateToRoute = (): void => {
        router.push("product/create-product")
    }

    const handleDelete = (id: Product['id']): void => {
        console.log(id)
    }

    const priceFormated = (product: ProductDto) => {
        return formatPrice(product.price)
    }

    const deleteAction = (product: ProductDto) => {
        return <button
            onClick={() => handleDelete(product.id!)}
            className="text-red-600 hover:text-red-800"
            title="Supprimer cette catégorie"
        >
            ❌
        </button>
    }


    return (
        <div>
            <div className="flex flex-row-reverse pt-1 pb-2.5">
                <RoundedButton onClickAction={() => navigateToRoute()} message="Créer un produit" icon="pi pi-plus" positionIcon='left' classes="border-actionColor text-actionColor"></RoundedButton>
            </div>
            {products.length === 0 ? (
                <p className="text-center text-gray-500">Aucuns produits disponible.</p>
            ) : (
                <div>
                    <DataTable value={products} tableStyle={{minWidth: '50rem'}}>
                        <Column field="name" header="Nom"></Column>
                        <Column field="price" header="Prix" body={priceFormated}></Column>
                        <Column field="name" header="Categorie"></Column>
                        <Column header="Action" body={deleteAction}></Column>
                    </DataTable>
                </div>
            )}
        </div>


    )
}