"use client";
import { getPageName } from "@/app/utils/utils";
import React, { useContext, useEffect, useState } from "react";
import RoundedButton from "@/app/components/ui/rounded-button";
import { InputText } from 'primereact/inputtext';
import { confirmDialog } from "primereact/confirmdialog";
import { InputNumber } from "primereact/inputnumber";
import { createDiscount, getAllDiscount } from "@/app/services/discount/discount";
import { ToastContext } from "@/app/provider/toastProvider";
import { DiscountDto } from "@/app/interface/discount/discountDto";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function Discount() {
    const { show } = useContext(ToastContext);
    const [discounts, setDiscounts] = useState<DiscountDto[]>([]);

    const fetchDiscount = async () => {
        const discountData: DiscountDto[] = await getAllDiscount();
        setDiscounts(discountData);
    }

    useEffect(() => {
        fetchDiscount();
        getPageName();
    }, []);

    const addDiscount = async (name: string, rate: number | null): Promise<void> => {
        createDiscount({ name, rate: rate ? rate : 0, visible: true })
            .then(() => {
                show('création de remise', `La remise ${name} a bien été créée`, 'success');
                fetchDiscount();
            })
            .catch((e: Error) => show('création de remise', e.message, 'error'));
    }

    const handleDelete = (discountId: string) => {
        console.log(discountId);
    }

    const deleteDiscount = (discount: DiscountDto) => {
        return <button
            onClick={() => handleDelete(discount.id!)}
            className="text-red-600 hover:text-red-800"
            title="Supprimer cette remise"
        >
            ❌
        </button>
    }

    const openPopup = (): void => {
        let nameRate: string = '';
        let rate: number | null = 0;

        confirmDialog({
            message: <div>
                <form>
                    <div className='mt-2.5'>
                        <label>Nom</label> <br />
                        <div className="p-inputgroup w-full bg-actionColor rounded">
                            <InputText
                                type="text"
                                defaultValue={nameRate}
                                onChange={(e) => nameRate = e.target.value}
                                className='rounded-none pl-2.5 border'
                            />
                            <span className="p-inputgroup-addon text-white bg-actionColor">
                                <span className="pi pi-tag"></span>
                            </span>
                        </div>
                    </div>

                    <div className='mt-2.5'>
                        <label>Taux</label> <br />
                        <div className="p-inputgroup w-full bg-actionColor rounded">
                            <InputNumber value={rate}
                                onChange={(e) => rate = e.value}
                                inputClassName="pl-2.5 rounded-none border" />
                            <span className="p-inputgroup-addon text-white bg-actionColor">%</span>
                        </div>
                    </div>
                </form>
            </div>,
            header: 'Ajouter un taux',
            acceptLabel: 'Valider',
            rejectLabel: 'Annuler',
            rejectClassName: 'mr-2.5 p-1.5 text-redColor',
            acceptClassName: 'bg-actionColor text-white p-1.5',
            accept: () => addDiscount(nameRate, rate)
        })
    };

    return (
        <div className="p-6 bg-primaryBackgroundColor h-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Remises</h1>

            <div className="flex flex-row-reverse mb-6">
                <RoundedButton onClickAction={openPopup} message="Ajouter un taux" positionIcon="left" classes="border-actionColor text-actionColor"></RoundedButton>
            </div>

            {discounts.length > 0 ? (
                <DataTable value={discounts} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="name" header="Nom"></Column>
                    <Column field="rate" header="Taux(%)"></Column>
                    <Column header="Action" body={deleteDiscount}></Column>
                </DataTable>
            ) : (
                <div className="flex justify-center items-center w-full bg-secondaryBackgroundColor p-6 rounded-md">
                    <div className="text-center text-gray-600">
                        <p>Il semble que vous n'avez pas encore de remises dans votre liste. Ajoutez-en en cliquant sur "Ajouter un taux".</p>
                    </div>
                </div>
            )}
        </div>
    );
}
