"use client"
import { ActionButtonProps } from "@/app/interface/ui/button-action-interface";
import { Button } from "primereact/button";

export default function RoundedButton({
    onClickAction,
    message,
    positionIcon,
    icon,
    classes
}: ActionButtonProps) {

    return (
        <Button onClick={onClickAction}
            className={` ${classes} border-solid border p-1.5 text-sm flex items-center justify-center`}>
            {icon && positionIcon && positionIcon === 'left' ? <span className={`pi ${icon} pr-1.5`}></span> : ''}
            {message}
            {icon && positionIcon && positionIcon === 'right' ? <span className={`pi ${icon} pl-1.5`}></span> : ''}
        </Button>
    )
}