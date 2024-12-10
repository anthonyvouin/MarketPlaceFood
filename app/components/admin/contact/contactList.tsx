'use client';

import React, { useState, useEffect, useContext } from 'react';
import { ContactDto } from '@/app/interface/contact/contactDto';
import { deleteContactById } from '@/app/services/contact/contact';
import { confirmDialog } from 'primereact/confirmdialog';
import { ToastContext } from '@/app/provider/toastProvider';
import { Button } from 'primereact/button';

const ContactList: React.FC<{ contacts: ContactDto[] }> = ({ contacts: initialContacts }) => {
    const [contacts, setContacts] = useState<ContactDto[]>([]);
    const { show } = useContext(ToastContext); 

    useEffect(() => {
        if (initialContacts && Array.isArray(initialContacts)) {
            setContacts(initialContacts);
        }
    }, [initialContacts]);

    const handleDelete = async (contact: ContactDto) => {
        try {
            await deleteContactById(contact.id);
            setContacts((prevContacts) =>
                prevContacts.filter((c) => c.id !== contact.id)
            );
            show(
                'Suppression réussie',
                `Le contact ${contact.firstName} ${contact.lastName} a été supprimé.`,
                'success'
            );
        } catch (error) {
            console.error('Erreur lors de la suppression du contact:', error);
            show(
                'Erreur lors de la suppression',
                `Impossible de supprimer le contact ${contact.firstName} ${contact.lastName}.`,
                'error'
            );
        }
    };

    const openDeleteContactDialog = (contact: ContactDto) => {
        confirmDialog({
            message: (
                <div>
                    <p>
                        Êtes-vous sûr de vouloir supprimer le contact{' '}
                        <strong>{`${contact.firstName} ${contact.lastName}`}</strong> ?
                    </p>
                </div>
            ),
            header: 'Confirmation de suppression',
            acceptLabel: 'Supprimer',
            rejectLabel: 'Annuler',
            rejectClassName: 'mr-2.5 p-1.5 text-redColor',
            acceptClassName: 'bg-actionColor text-white p-1.5',
            accept: async () => {
                await handleDelete(contact);
            },
        });
    };

    return (
        <div className="p-6 bg-primaryBackgroundColor min-h-[80vh]">
            {contacts.length === 0 ? (
                <p className="text-center text-gray-600">Aucun contact disponible.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contacts.map((contact: ContactDto) => (
                        <div
                            key={contact.id}
                            className="bg-white shadow-lg rounded-lg p-5 hover:shadow-xl transition"
                        >
                            <div>
                                <p className="text-lg font-bold text-gray-800">{`${contact.firstName} ${contact.lastName}`}</p>
                                <p className="text-gray-700">{`Email: ${contact.email}`}</p>
                                <p className="text-gray-700">{`Objet: ${contact.subject}`}</p>
                                <p className="text-gray-700">{`Message: ${contact.message}`}</p>
                                <p className="text-gray-500 text-sm mt-2">{`Soumis le: ${new Date(
                                    contact.submittedAt as Date
                                ).toLocaleString()}`}</p>
                            </div>
                            <div className="flex justify-end mt-4">
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-danger"
                                    onClick={() => openDeleteContactDialog(contact)}
                                    label="Supprimer"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContactList;
