import { formatPriceEuro, calculAndformatPriceWithDiscount } from '@/app/pipe/formatPrice';

describe('Fonctions de formatage de prix', () => {
    describe('formatPriceEuro', () => {
        it('devrait formater correctement un prix entier', () => {
            expect(formatPriceEuro(1000)).toBe('10.00');
        });

        it('devrait formater correctement un prix avec décimales', () => {
            expect(formatPriceEuro(1050)).toBe('10.50');
        });

        it('devrait formater correctement un petit prix', () => {
            expect(formatPriceEuro(99)).toBe('0.99');
        });

        it('devrait formater correctement zéro', () => {
            expect(formatPriceEuro(0)).toBe('0.00');
        });
    });

    describe('calculAndformatPriceWithDiscount', () => {
        it('devrait calculer correctement un prix avec remise sans quantité', () => {
            expect(calculAndformatPriceWithDiscount(2000, 10)).toBe('18.00');
        });

        it('devrait calculer correctement un prix avec remise et quantité', () => {
            expect(calculAndformatPriceWithDiscount(2000, 10, 3)).toBe('54.00');
        });

        it('devrait gérer une remise de 0%', () => {
            expect(calculAndformatPriceWithDiscount(1000, 0, 2)).toBe('20.00');
        });

        it('devrait gérer une remise de 100%', () => {
            expect(calculAndformatPriceWithDiscount(1000, 100)).toBe('0.00');
        });

        it('devrait gérer les arrondis correctement', () => {
         
            expect(calculAndformatPriceWithDiscount(1999, 15)).toBe('16.99');
        });

        it('devrait gérer les petits montants avec remise', () => {
            expect(calculAndformatPriceWithDiscount(99, 10)).toBe('0.89');
        });
    });
}); 