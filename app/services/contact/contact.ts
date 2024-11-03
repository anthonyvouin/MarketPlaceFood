'use server';

import {PrismaClient} from '@prisma/client';
import { ContactDto } from '@/app/interface/contact/contactDto';
import { verifyAuth } from '@/app/core/verifyAuth';

const prisma = new PrismaClient();

export async function createContact(contact: ContactDto): Promise<ContactDto> {
    if (!contact.firstName || !contact.lastName || !contact.email || !contact.subject || !contact.message) {
        throw new Error('Tous les champs (prénom, nom, email, objet, message) sont requis.');
    }

    if (!/\S+@\S+\.\S+/.test(contact.email)) {
        throw new Error(`L'adresse email est invalide.`);
    }

    try {
        return await prisma.contact.create({
            data: {
                firstName: contact.firstName,
                lastName: contact.lastName,
                email: contact.email,
                subject: contact.subject,
                message: contact.message,
            },
        });
    } catch (error: any) {
        throw new Error('La création du contact a échoué');
    }
}

export async function getAllContacts(): Promise<ContactDto[]> {
    try {

        await verifyAuth(["ADMIN"]);

        return await prisma.contact.findMany();
    } catch (error) {
        throw new Error('La récupération des contacts a échoué');
    }
}


export async function deleteContactById(id: ContactDto['id']): Promise<{ message: string }> {
    if (!id) {
        throw new Error('L\'ID du contact est requis pour la suppression.');
    }

    try {
        await prisma.contact.delete({
            where: {
                id: id,
            },
        });
        return {message: 'Contact supprimée avec succès.'};
    } catch (error) {
        throw new Error('La suppression du contact a échoué');
    }
}