"use client"
import {Button} from "@radix-ui/themes";
import * as RadixIcons from "@radix-ui/react-icons";
import {ActionButtonProps} from "@/app/interface/ui/button-action-interface";

export default function ActionButton({
                                         onClickAction,
                                         message,
                                         position,
                                         icon,
                                     }: ActionButtonProps) {
    const icons = {
        logout: RadixIcons.ExitIcon
    }

    const IconComponent = icons[icon];

    return (
        <Button onClick={onClickAction}
                color="jade"
                variant="outline">
            {IconComponent && position === 'left' ? <IconComponent/> : ''}
            {message}
            {IconComponent && position === 'right' ? <IconComponent/> : ''}

        </Button>
    )
}