"use client"
import ActionButton from "@/app/components/ui/action-button";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {Product} from "@prisma/client";
import {Table} from "@radix-ui/themes";
import {ProductDto} from "@/app/interface/product/productDto";
import {formatPrice} from "@/app/pipe/format";
import {getAllProducts} from "@/app/services/products/product";


export default function ProductPage() {
    const [products, setProducts] = useState<ProductDto[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const categoriesData: ProductDto[] = await getAllProducts();
            console.log(categoriesData)
            setProducts(categoriesData);
        }
        fetchCategories();
    }, []);


    const router = useRouter();

    const navigateToRoute = (): void => {
        router.push("product/create-product")
    }

    const handleDelete = (id: Product['id']): void => {

    }



    return (
        <div>
            <div className="flex flex-row-reverse">
                <ActionButton onClickAction={() => navigateToRoute()} message="Créer un produit" icon="plus" positionIcon='left' color="jade"></ActionButton>
            </div>
            {products.length === 0 ? (
                <p className="text-center text-gray-500">Aucuns produits disponible.</p>
            ) : (
                <div>
                    <Table.Root>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>Nom</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>prix</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>categorie</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>actions</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>

                            {products.map((product: ProductDto) => (
                                <Table.Row>
                                    <Table.RowHeaderCell>{product.name}</Table.RowHeaderCell>
                                    <Table.Cell>{formatPrice(product.price)} €</Table.Cell>
                                    <Table.Cell>{product.category ? product.category.name : ''}</Table.Cell>
                                    <Table.Cell>
                                        {product.id ? (
                                            <button
                                                onClick={() => handleDelete(product.id!)}
                                                className="text-red-600 hover:text-red-800"
                                                title="Supprimer cette catégorie"
                                            >
                                                ❌
                                            </button>) : ''}
                                    </Table.Cell>
                                </Table.Row>
                            ))}

                        </Table.Body>
                    </Table.Root>

                </div>

            )}
        </div>


    )
}