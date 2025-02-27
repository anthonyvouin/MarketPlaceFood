"use server"

import {Prisma, PrismaClient, Product, MissingIngredientReport} from '@prisma/client';
import { verifyAuth } from '@/app/core/verifyAuth';

export interface MissingIngredientReportDto extends MissingIngredientReport {
    product: Product;
}

const prisma = new PrismaClient();

export async function getMissingIngredientReports(): Promise<any[]> {
    await verifyAuth(['ADMIN']);
    try {
        return await prisma.missingIngredientReport.findMany();
    } catch (error) {
        console.error("Erreur lors de la récupération des rapports d'ingrédient manquant :", error);
        throw new Error("La récupération des rapports d'ingrédient manquant a échoué.");
    }
}

export async function getMissingIngredientReportById(id: string): Promise<any> {
    await verifyAuth(['ADMIN']);
    try {
        return await prisma.missingIngredientReport.findUnique({
            where: {id},
        });
    } catch (error) {
        console.error("Erreur lors de la récupération du rapport d'ingrédient manquant :", error);
        throw new Error("La récupération du rapport d'ingrédient manquant a échoué.");
    }
}

export async function createOrUpdateMissingIngredientReport(data: Prisma.MissingIngredientReportCreateInput): Promise<any> {
    await verifyAuth(['ADMIN', 'USER']);
    try {
        const existingReport = await prisma.missingIngredientReport.findFirst({
            where: {
                name: data.name
            },
        });

        if (existingReport) {
            return await prisma.missingIngredientReport.update({
                where: {id: existingReport.id},
                data: {
                    count: existingReport.count + 1,
                },
            });
        }

        return await prisma.missingIngredientReport.create({
            data: {
                name: data.name,
                count: 1,
            },
        });
    } catch (error) {
        console.log("Erreur lors de la création ou de la mise à jour du rapport d'ingrédient manquant :", error);
        throw new Error("La création ou la mise à jour du rapport d'ingrédient manquant a échoué.");
    }
}