'use server';

import { PrismaClient } from '@prisma/client';
import { Contact } from '@/app/interface/contact/contact';

const prisma = new PrismaClient();

export async function createContact(contact: Contact) {
    if (!contact.firstName || !contact.lastName || !contact.email || !contact.subject || !contact.message) {
        throw new Error('Tous les champs (prénom, nom, email, objet, message) sont requis.');
    }

    if (!/\S+@\S+\.\S+/.test(contact.email)) {
        throw new Error('L\'adresse email est invalide.');
    }

    try {
        const newContact: Contact = await prisma.contact.create({
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
        console.error('Erreur lors de la création du contact:', error); 
        throw new Error('La création du contact a échoué');
    }
}
