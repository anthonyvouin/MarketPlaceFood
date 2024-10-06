export interface ActionButtonProps {
    onClickAction: () => void;
    message: string;
    position: 'right' | 'left';
    icon?: string;
}