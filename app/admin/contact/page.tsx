'use client';

import React, { useEffect, useState } from 'react';
import { getAllContacts } from '@/app/services/contact/contact';
import ContactList from '@/app/components/admin/contact/contactList';
import { ContactDto } from '@/app/interface/contact/contactDto';
const ContactsPage: React.FC = () => {
    const [contacts, setContacts] = useState<ContactDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const fetchedContacts = await getAllContacts();
                setContacts(fetchedContacts);
            } catch (error) {
                console.error('Erreur lors de la récupération des contacts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    if (loading) {
        return <p>Chargement des contacts...</p>;
    }

    return (
        <div>
            <ContactList contacts={contacts} />
        </div>
    );
};

export default ContactsPage;
