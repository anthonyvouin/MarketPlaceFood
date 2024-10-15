export const getPageName = (): string => {
    const pathParts: string[] = window.location.pathname.split("/").filter(Boolean);
    const siteName: string = 'Snap&Shop'
    document.title = pathParts.length === 0 ? `${siteName}-Accueil` : `${siteName}-${pathParts[pathParts.length - 1]}`
    return document.title
}