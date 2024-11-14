export interface DialogContextType {
    header: string,
    message: string,
    showDialog: (title: string, message: string, onConfirm: () => void) => void;
}