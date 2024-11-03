import {RefObject, useRef, useState} from "react";

const Dropzone = ({onDrop}) => {
    const [highlight, setHighlight] = useState(false);
    const fileInputRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setHighlight(true);
    };

    const openFileDialog = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFilesAdded = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onDrop(files[0]);
        }
    };

    const handleDragLeave = () => {
        setHighlight(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setHighlight(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onDrop(e.dataTransfer.files[0]);
        }
    };

    return (
        <div
            style={{
                border: highlight ? "2px solid blue" : "2px dashed gray",
                padding: "50px",
                textAlign: "center",
                cursor: "pointer",
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileDialog}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{display: "none"}}
                onChange={handleFilesAdded}
            />
            Déposez vos images ici
        </div>
    );
};

export default Dropzone;