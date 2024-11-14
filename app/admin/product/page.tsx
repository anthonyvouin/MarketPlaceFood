"use client"
import RoundedButton from "@/app/components/ui/rounded-button";
import {useRouter} from "next/navigation";
import React, {useContext, useEffect, useState} from "react";
import {Product} from "@prisma/client";
import {ProductDto} from "@/app/interface/product/productDto";
import {formatPriceEuro} from "@/app/pipe/format";
import {changeDiscount, getAllProducts} from "@/app/services/products/product";
import {getPageName} from "@/app/utils/utils";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {confirmPopup, ConfirmPopup} from "primereact/confirmpopup";
import {DiscountDto} from "@/app/interface/discount/discountDto";
import {getAllDiscount} from "@/app/services/discount/discount";
import {PopupAddDiscount} from "@/app/admin/product/popup-add-discount/popup-add-discount";
import {ToastContext} from "@/app/provider/toastProvider";


export default function ProductPage() {
    const {show} = useContext(ToastContext);
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [discounts, setDiscounts] = useState<DiscountDto[]>([]);


    useEffect(() => {
        const fetchCategories = async () => {
            const categoriesData: ProductDto[] = await getAllProducts();
            setProducts(categoriesData);
        }

        const fetchDiscounts = async () => {
            const discountData: DiscountDto[] = await getAllDiscount();
            setDiscounts(discountData);
        }
        getPageName();
        fetchDiscounts()
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
        return formatPriceEuro(product.price)
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

    const actionBody = (product: ProductDto) => {
        if (product.discount) {
            return <p>{product.discount.rate} %</p>
        } else {
            return <div>
                <ConfirmPopup group="templating"/>
                <p onClick={(e) => showTemplate(e, product)}>+ ajouter une remise</p>
            </div>
        }
    }

    const acceptDiscount = async (selectedDiscount: DiscountDto | null, selectedProduct: ProductDto | null): Promise<void> => {
        await changeDiscount(selectedProduct, selectedDiscount).then((newProduct: ProductDto) => {
            show('Changement de remise', 'Le changement de remise a été effectué', 'success')
            if (selectedProduct) {
                setProducts(prevProducts =>
                    prevProducts.map(p =>
                        p.id === newProduct.id ? newProduct : p
                    )
                );
            }
        }).catch((e: Error) => show('Changement de remise', e.message, 'error'))
    }


    const showTemplate = (event, product: ProductDto | null) => {
        let selectedDiscountLocal: DiscountDto | null = null
        const handleChangeDiscount = (e: string) => {
            if (e) {
                const indexDiscount: number = discounts.findIndex((discount: DiscountDto | null) => {
                    if (discount) {
                        return discount.id === e
                    }
                    return null
                });
                if (indexDiscount !== -1) {
                    selectedDiscountLocal = discounts[indexDiscount]
                }
            }
        }

        confirmPopup({
            target: event.currentTarget,
            group: 'templating',
            message: ((
                    <PopupAddDiscount
                        discounts={discounts}
                        onChangeDiscount={handleChangeDiscount}
                    />
                )
            )
            ,
            acceptIcon: 'pi pi-check',
            rejectIcon: 'pi pi-times',
            rejectClassName: 'p-button-sm',
            acceptClassName: 'p-button-outlined p-button-sm',
            accept: () => acceptDiscount(selectedDiscountLocal, product),
        });
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
                        <Column header="Remise" body={actionBody}></Column>
                        <Column header="Action" body={deleteAction}></Column>
                    </DataTable>
                </div>

            )}
        </div>


    )
}