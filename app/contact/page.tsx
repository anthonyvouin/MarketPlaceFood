"use client";

import React, {SetStateAction, useEffect, useState} from 'react';
import {createContact} from '@/app/services/contact/contact';
import {ContactDto} from '@/app/interface/contact/contactDto';
import ReCAPTCHA from "react-google-recaptcha";
import Image from "next/image";
import {getPageName} from "@/app/utils/utils";

const CreateContact = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [captchaValue, setCaptchaValue] = useState<string | null>(null);

    useEffect(() => {
        getPageName()
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!captchaValue) {
            setError('Veuillez prouver que vous n\'êtes pas un robot.');
            return;
        }

        const newContact: ContactDto = {firstName, lastName, email, subject, message};

        try {
            await createContact(newContact);
            setSuccess('Contact créé avec succès.');
            setFirstName('');
            setLastName('');
            setEmail('');
            setSubject('');
            setMessage('');
            setCaptchaValue(null);
            setError(null);
        } catch (err : unknown) {
            if (err instanceof Error) {
                setError('Erreur lors de la création du contact.');
            }
            setSuccess(null);
        }
    };

    return (
        <div className="flex items-center bg-primaryBackgroundColor height-full">

            <div className="w-3/6 pl-12">
                <h1 className="text-2xl mb-2.5 text-darkActionColor font-semibold">Contactez-Nous</h1>
                <p>Vous avez des questions, des suggestions ou un besoin d&apos;assistance ?
                    <br/> Nous sommes là pour vous aider !
                    <br/>N&apos;hésitez pas à nous écrire en utilisant le formulaire.</p> <br/>
                <Image src="/images/contact.png" width={424} height={327} alt="DriveFood"/>
            </div>
            <div className="w-3/6  p-6 mr-12 bg-white shadow-md rounded-md">
                <form onSubmit={handleSubmit}
                      className="space-y-6">
                    <div>
                        <label htmlFor="firstName"
                        >
                            Prénom :
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                            Nom :
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email :
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                            Objet :
                        </label>
                        <input
                            type="text"
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                            Message :
                        </label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ""}
                        onChange={(value: SetStateAction<string | null>) => setCaptchaValue(value)}
                    />

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-actionColor transition ease-in-out delay-150 hover:bg-darkActionColor text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Envoyer
                    </button>
                </form>
                {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
                {success && <p className="mt-4 text-green-500 text-center">{success}</p>}
            </div>
        </div>

    );
};

export default CreateContact;
