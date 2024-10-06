export interface ActionButtonProps {
    onClickAction: () => void;
    message: string;
    positionIcon: 'right' | 'left';
    icon?: string;
}