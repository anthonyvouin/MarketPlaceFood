import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { classNames } from 'primereact/utils';

const ImageUploadDialog = ({ visible, onHide, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false); // 🔄 Loader State

  const handleFileSelect = (e) => {
    setSelectedFile(e.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setLoading(true); // 🔄 Démarrer le loader
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        await onUpload(formData);
        onHide();
      } catch (error) {
        console.error('Erreur lors de l\'upload de l\'image :', error);
      } finally {
        setLoading(false); // ✅ Arrêter le loader après upload
      }
    }
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Importer une image"
      className="p-6 rounded-lg shadow-2xl bg-primaryBackgroundColor w-10/12 md:w-[35rem]">

      <div className="flex flex-col items-center space-y-6">
        <FileUpload
          name="file"
          accept="image/*"
          chooseLabel="Choisir un fichier"
          maxFileSize={2 * 1024 * 1024}
          auto={true}
          mode="advanced"
          multiple={false}
          onSelect={(e) => handleFileSelect(e)}
          onRemove={() => setSelectedFile(null)}
          emptyTemplate={
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-borderGrey bg-light rounded-lg p-6 text-gray-500 cursor-pointer hover:border-primaryColor transition-all">
              <i className="pi pi-cloud-upload text-4xl text-primaryColor mb-2"></i>
              <p className="font-semibold">Glissez-déposez une image ici</p>
              <p className="text-sm">Ou cliquez pour sélectionner un fichier</p>
            </div>
          }
          className={classNames('w-full', { 'border-redColor': !selectedFile })}
        />

        {/* Bouton avec Loader */}
        <Button
          label={loading ? 'Analyse en cours...' : 'Analyser l\'image'}
          icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
          onClick={handleUpload}
          className="px-6 py-2 font-semibold text-white bg-actionColor rounded-lg shadow-md transition-all hover:bg-darkActionColor disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!selectedFile || loading} // Désactiver pendant le chargement
        />
      </div>
    </Dialog>
  );
};

export default ImageUploadDialog;