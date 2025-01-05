export const getPageName = (): string => {
    const pathParts: string[] = window.location.pathname.split("/").filter(Boolean);
    const siteName: string = 'Snap&Shop'
    document.title = pathParts.length === 0 ? `${siteName}-Accueil` : `${siteName}-${pathParts[pathParts.length - 1]}`
    return document.title
}

export const formatDateTime = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    };
    return new Intl.DateTimeFormat('fr-FR', options || defaultOptions).format(date);
}