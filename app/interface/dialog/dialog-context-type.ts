export interface DialogContextType {
    showDialog: (title: string, message: string, onConfirm: () => void) => void;
}