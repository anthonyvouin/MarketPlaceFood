import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";

const ImageUploadDialog = ({ visible, onHide, onUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileSelect = (e) => {
        setSelectedFile(e.files[0]);
    };

    const handleUpload = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append("file", selectedFile);

            try {
                const imagePath = await onUpload(formData);
                onHide();
            } catch (error) {
                console.error("Erreur lors de l'upload de l'image:", error);
            }
        }
    };

    return (
        <Dialog visible={visible} onHide={onHide} header="Uploader une image">
            <div>
                <FileUpload 
                    name="file" 
                    mode="basic" 
                    accept="image/*" 
                    maxFileSize={2 * 1024 * 1024} // Limite de 2MB 
                    customUpload={true} 
                    auto={false}
                    chooseOptions={{ label: 'Choisir un fichier' }}
                    onSelect={handleFileSelect}
                />
                <Button
                    label="Analyser l'image"
                    icon="pi pi-check"
                    onClick={handleUpload}
                    className="mt-4"
                    disabled={!selectedFile}
                />
            </div>
        </Dialog>
    );
};

export default ImageUploadDialog;
