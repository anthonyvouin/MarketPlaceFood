export interface SidebarLinks {
    name: string
    subLinks?: SidebarLinks[]
    href: string
    icon: string
}