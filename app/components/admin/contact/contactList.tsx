'use client';

import React, { useState, useEffect } from 'react';
import { ContactDto } from '@/app/interface/contact/contactDto';
import { deleteContactById } from '@/app/services/contact/contact';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const ContactList: React.FC<{ contacts: ContactDto[] }> = ({ contacts: initialContacts }) => {
    const [contacts, setContacts] = useState<ContactDto[]>([]);
    const [contactToDelete, setContactToDelete] = useState<ContactDto | null>(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);

    useEffect(() => {
        if (initialContacts && Array.isArray(initialContacts)) {
            setContacts(initialContacts);
        }
    }, [initialContacts]);

    const showConfirmation = (contact: ContactDto) => {
        setContactToDelete(contact);
        setIsDialogVisible(true);
    };

    const handleDelete = async () => {
        if (!contactToDelete) return;

        try {
            await deleteContactById(contactToDelete.id);
            setContacts((prevContacts) =>
                prevContacts.filter((contact) => contact.id !== contactToDelete.id)
            );
        } catch (error) {
            console.error('Erreur lors de la suppression du contact:', error);
        } finally {
            setIsDialogVisible(false);
            setContactToDelete(null);
        }
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
                                    onClick={() => showConfirmation(contact)}
                                    label="Supprimer"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog
                header="Confirmation"
                visible={isDialogVisible}
                style={{ width: '400px' }}
                onHide={() => setIsDialogVisible(false)}
                footer={
                    <div className="flex justify-end gap-4">
                        <Button
                            label="Annuler"
                            icon="pi pi-times"
                            onClick={() => setIsDialogVisible(false)}
                            className="p-button-text"
                        />
                        <Button
                            label="Supprimer"
                            icon="pi pi-check"
                            onClick={handleDelete}
                            className="p-button-danger p-button-text"
                            style={{ color: 'red' }}
                        />
                    </div>
                }
            >

                <p>Voulez-vous vraiment supprimer ce contact ?</p>
                {contactToDelete && (
                    <p className="text-gray-800 mt-2">
                        <strong>{`${contactToDelete.firstName} ${contactToDelete.lastName}`}</strong>
                    </p>
                )}
            </Dialog>
        </div>
    );
};

export default ContactList;
