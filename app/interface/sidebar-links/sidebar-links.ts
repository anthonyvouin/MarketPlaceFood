import {ForwardRefExoticComponent, RefAttributes} from "react";
import {IconProps} from "@radix-ui/themes";

export interface SidebarLinks {
    name: string
    href: string
    icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
}