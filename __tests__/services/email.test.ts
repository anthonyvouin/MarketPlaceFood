import { sendWelcomeEmail, sendPasswordResetEmail, sendPaymentConfirmationEmail } from '@/app/services/mail/email';

// Mock de nodemailer
jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValue({ response: 'Success' })
    })
}));

describe('Services Email', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('sendWelcomeEmail', () => {
        it('devrait inclure les bonnes informations dans l\'email de bienvenue', async () => {
            const email = 'test@example.com';
            const name = 'John Doe';
            const token = 'test-token';
            
            await sendWelcomeEmail(email, name, token, false);
            
            const transporter = require('nodemailer').createTransport();
            const sendMailMock = transporter.sendMail;
            const call = sendMailMock.mock.calls[0][0];

            expect(call.to).toBe(email);
            expect(call.subject).toBe('Confirmation de compte et Bienvenue');
            expect(call.html).toContain(name);
            expect(call.html).toContain(token);
        });

        it('devrait avoir un contenu différent pour les utilisateurs Google', async () => {
            const email = 'test@example.com';
            const name = 'John Doe';
            const token = 'test-token';
            
            await sendWelcomeEmail(email, name, token, true);
            
            const transporter = require('nodemailer').createTransport();
            const sendMailMock = transporter.sendMail;
            const call = sendMailMock.mock.calls[0][0];

            expect(call.html).toContain('utilisé Google pour vous connecter');
        });
    });

    describe('sendPasswordResetEmail', () => {
        it('devrait inclure le token de réinitialisation dans l\'email', async () => {
            const email = 'test@example.com';
            const token = 'reset-token';
            
            await sendPasswordResetEmail(email, token);
            
            const transporter = require('nodemailer').createTransport();
            const sendMailMock = transporter.sendMail;
            const call = sendMailMock.mock.calls[0][0];

            expect(call.to).toBe(email);
            expect(call.subject).toBe('Réinitialisation de mot de passe');
            expect(call.html).toContain(token);
        });
    });

    describe('sendPaymentConfirmationEmail', () => {
        it('devrait inclure les détails de la commande dans l\'email', async () => {
            const email = 'test@example.com';
            const orderDetails = {
                orderNumber: 'ORDER123',
                totalAmount: 2000, // 20.00€
                shippingAddress: '123 Rue Test',
                shippingCity: 'Paris',
                shippingZipCode: '75000'
            };
            
            await sendPaymentConfirmationEmail(email, orderDetails);
            
            const transporter = require('nodemailer').createTransport();
            const sendMailMock = transporter.sendMail;
            const call = sendMailMock.mock.calls[0][0];

            expect(call.to).toBe(email);
            expect(call.subject).toBe('Confirmation de votre commande');
            expect(call.html).toContain(orderDetails.orderNumber);
            expect(call.html).toContain('20.00€');
            expect(call.html).toContain(orderDetails.shippingAddress);
        });
    });
}); 