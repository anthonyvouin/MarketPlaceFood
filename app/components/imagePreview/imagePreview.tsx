import {useEffect, useState} from "react";

const ImagePreview = ({ file }) => {
    const [previewUrl, setPreviewUrl] = useState("");

    useEffect(() => {
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);  // Libérer l'URL en mémoire
    }, [file]);

    return (
        <div style={{ marginTop: '10px' }}>
            <img src={previewUrl} alt="Preview" style={{ maxHeight: "300px" }} />
        </div>
    );
};

export default ImagePreview;