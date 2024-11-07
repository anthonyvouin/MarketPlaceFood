export interface ActionButtonProps {
    onClickAction: () => void;
    message: string;
    positionIcon: 'right' | 'left';
    classes: string;
    icon?: string;

}