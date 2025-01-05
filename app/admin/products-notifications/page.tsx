"use client";
import { getMissingIngredientReports, MissingIngredientReportDto } from "@/app/services/missingIngredientReport";
import { formatDateTime } from "@/app/utils/utils";
import Link from "next/link";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";

export default function ProductNotificaationsPage() {
    const [missingIngredientReports, setMissingIngredientReports] = useState<MissingIngredientReportDto[]>([]);
    useEffect(() => {
        async function fetchMissingIngredientReports() {
            const response: MissingIngredientReportDto[] = await getMissingIngredientReports();
            console.log(response);
            setMissingIngredientReports(response);
        }

        fetchMissingIngredientReports();
    }, []);
    return (
        <section className="min-h-screen p-12 bg-primaryBackgroundColor">
            <h1 className="text-3xl font-bold mb-6">Rapports d'ingrédients manquants</h1>
            <div className="card">
                <DataTable value={missingIngredientReports} stripedRows>
                    <Column field="name" header="Nom" sortable align="center" style={{ width: "30%" }} />
                    <Column field="count" header="Nombre de notifications" sortable align="center" style={{ width: "10%" }} />
                    <Column
                        field="updatedAt"
                        header="Dernière notification"
                        sortable
                        align="center"
                        body={(report) => formatDateTime(report.updatedAt, {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })}
                    />
                    <Column
                        header="Action"
                        align="center"
                        body={(report) => (
                            <Link className="flex justify-center items-center gap-3 p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                href={{
                                    pathname: "product/create-product",
                                    query: { name: report.name },
                                }}>
                                <i className="pi pi-plus"></i>
                                <p>Créer le produit</p>
                            </Link>
                        )} />
                </DataTable>
            </div>
        </section >
    );
}