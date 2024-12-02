"use client";

import React, { useEffect, useState } from "react";
import { getAllContacts } from "@/app/services/contact/contact";
import ContactList from "@/app/components/admin/contact/contactList";
import { ContactDto } from "@/app/interface/contact/contactDto";
import { getPageName } from "@/app/utils/utils";

const ContactsPage: React.FC = () => {
    const [contacts, setContacts] = useState<ContactDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const fetchedContacts = await getAllContacts();
                setContacts(fetchedContacts);
            } catch (error) {
                console.error("Erreur lors de la récupération des contacts:", error);
            } finally {
                setLoading(false);
            }
        };

        getPageName();
        fetchContacts();
    }, []);

    return (
        <div className=" h-screen bg-primaryBackgroundColor p-10">
            
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-lg font-medium text-gray-600">Chargement des contacts...</div>
                </div>
            ) : (
                <div className="">
                    {contacts.length > 0 ? (
                        <ContactList contacts={contacts} />
                    ) : (
                        <div className="text-center text-gray-600">
                            <p>Aucun contact disponible pour le moment.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ContactsPage;
