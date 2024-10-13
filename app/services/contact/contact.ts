'use server';

import { PrismaClient } from '@prisma/client';
import { ContactDto } from '@/app/interface/contact/contactDto';

const prisma = new PrismaClient();

// Function pour créer un nouveau contact
export async function createContact(contact: ContactDto) {
    if (!contact.firstName || !contact.lastName || !contact.email || !contact.subject || !contact.message) {
        throw new Error('Tous les champs (prénom, nom, email, objet, message) sont requis.');
    }

    if (!/\S+@\S+\.\S+/.test(contact.email)) {
        throw new Error('L\'adresse email est invalide.');
    }

    try {
        const newContact: ContactDto = await prisma.contact.create({
            data: {
                firstName: contact.firstName,
                lastName: contact.lastName,
                email: contact.email,
                subject: contact.subject,
                message: contact.message,
            },
        });
        return newContact;
    } catch (error: any) {
        throw new Error('La création du contact a échoué');
    }
}

// Function pour récupérer tous les contacts
export async function getAllContacts() {
    try {
        return await prisma.contact.findMany();
    } catch (error) {
        throw new Error('La récupération des contacts a échoué');
    }
}



// Function pour supprimer un contact par son id
export async function deleteContactById(id: ContactDto['id']) {
    if (!id) {
        throw new Error('L\'ID du contact est requis pour la suppression.');
    }

    try {
        await prisma.contact.delete({
            where: {
                id: id,
            },
        });
        return { message: 'Contact supprimée avec succès.' };
    } catch (error) {
        throw new Error('La suppression du contact a échoué');
    }
}