'use client';

import React, { useState, useEffect } from 'react';
import { ContactDto } from '@/app/interface/contact/contactDto';
import { deleteContactById } from '@/app/services/contact/contact';

const ContactList: React.FC<{ contacts: ContactDto[] }> = ({ contacts: initialContacts }) => {
    const [contacts, setContacts] = useState<ContactDto[]>([]);

    useEffect(() => {
        if (initialContacts && Array.isArray(initialContacts)) {
            setContacts(initialContacts);
        }
    }, [initialContacts]);

    const handleDelete = async (id: ContactDto['id']) => {
        try {
            await deleteContactById(id);
            setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== id));
        } catch (error) {
            console.error('Erreur lors de la suppression du contact:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">Liste des Contacts</h2>
            {contacts.length === 0 ? (
                <p className="text-center text-gray-500">Aucun contact disponible.</p>
            ) : (
                <ul className="space-y-2">
                    {contacts.map((contact: ContactDto) => (
                        <li key={contact.id} className="border-b border-gray-200 py-2">
                            <div className="flex justify-between items-center">
                                <div className="flex-1">
                                    <p className="font-medium">{`${contact.firstName} ${contact.lastName}`}</p>
                                    <p className="text-gray-700">{`Email: ${contact.email}`}</p>
                                    <p className="text-gray-700">{`Objet: ${contact.subject}`}</p>
                                    <p className="text-gray-700">{`Message: ${contact.message}`}</p>
                                    <p className="text-gray-500 text-sm">{`Soumis le: ${new Date(contact.submittedAt as Date).toLocaleString()}`}</p>
                                    </div>
                                <button
                                    onClick={() => handleDelete(contact.id)} 
                                    className="text-red-600 hover:text-red-800 ml-4"
                                    title="Supprimer ce contact"
                                >
                                    ❌
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ContactList;
