"use server"

import {Prisma, PrismaClient, Product} from '@prisma/client';

const prisma = new PrismaClient();

export async function getMissingIngredientReportById(id: string): Promise<MissingIngredientReportDto | null> {
    try {
        return await prisma.missingIngredientReport.findUnique({
            where: {id},
            include: {product: true},
        });
    } catch (error) {
        console.error("Erreur lors de la récupération du rapport d'ingrédient manquant :", error);
        throw new Error("La récupération du rapport d'ingrédient manquant a échoué.");
    }
}

export async function createOrUpdateMissingIngredientReport(data: Prisma.MissingIngredientReportCreateInput): Promise<MissingIngredientReportDto> {
    try {
        // Si le rapport d'ingrédient manquant existe déjà par rapport à son nom, on le met à jour
        const existingReport = await prisma.missingIngredientReport.findFirst({
            where: {
                name: data.name,
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
        console.error("Erreur lors de la création ou de la mise à jour du rapport d'ingrédient manquant :", error);
        throw new Error("La création ou la mise à jour du rapport d'ingrédient manquant a échoué.");
    }
}