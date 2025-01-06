export interface ActionButtonProps {
    onClickAction: () => void;
    message?: string;
    classes: string;
    positionIcon?: 'right' | 'left';
    icon?: string;

}