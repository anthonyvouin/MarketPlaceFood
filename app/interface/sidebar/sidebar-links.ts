export interface SidebarLinks {
    name: string;
    href?: string;
    icon: string;
    subLinks?: { name: string; href: string; icon: string; }[];
}