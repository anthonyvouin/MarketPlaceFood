"use client"
import {Button} from "@radix-ui/themes";
import * as RadixIcons from "@radix-ui/react-icons";
import {ActionButtonProps} from "@/app/interface/ui/button-action-interface";

export default function ActionButton({
                                         onClickAction,
                                         message,
                                         icon
                                     }: ActionButtonProps) {
    const icons = {
        logout: RadixIcons.BackpackIcon
    }

    const IconComponent = icons[icon];

    return (
        <Button onClick={onClickAction}>
            {IconComponent ? <IconComponent/> : ''}
            {message}
        </Button>
    )
}