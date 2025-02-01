import { formatDateTime } from '@/app/utils/utils';

describe('formatDateTime', () => {
    it('devrait formater la date avec les options par défaut', () => {
        const date = new Date('2024-03-20T14:30:45');
        const formattedDate = formatDateTime(date);
        expect(formattedDate).toBe('20 mars 2024 à 14:30:45');
    });

    it('devrait formater la date avec des options personnalisées', () => {
        const date = new Date('2024-03-20T14:30:45');
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        const formattedDate = formatDateTime(date, options);
        expect(formattedDate).toBe('20 mars 2024, 14:30');
    });

    it('devrait formater correctement une date à minuit', () => {
        const date = new Date('2024-03-20T00:00:00');
        const formattedDate = formatDateTime(date);
        expect(formattedDate).toBe('20 mars 2024 à 00:00:00');
    });

    it('devrait formater correctement le dernier jour de l\'année', () => {
        const date = new Date('2024-12-31T23:59:59');
        const formattedDate = formatDateTime(date);
        expect(formattedDate).toBe('31 décembre 2024 à 23:59:59');
    });

    it('devrait retourner un message d\'erreur pour une date invalide', () => {
        const invalidDate = new Date('invalid date');
        const formattedDate = formatDateTime(invalidDate);
        expect(formattedDate).toBe('Date invalide');
    });

    it('devrait formater la date avec des options minimales', () => {
        const date = new Date('2024-03-20T14:30:45');
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        };
        const formattedDate = formatDateTime(date, options);
        expect(formattedDate).toBe('20/03/2024');
    });
}); 