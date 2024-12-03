import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

export default function IngredientsDialog({ visible, ingredients, recipeName, onHide, addProduct }) {
    const foundIngredientsFooter = (
        <div className="flex justify-between w-full">
            <Button
                label="Fermer"
                icon="pi pi-times"
                onClick={onHide}
                className="p-button-text"
            />
            {ingredients.products_found.length > 0 && (
                <Button
                    label="Tout ajouter au panier"
                    icon="pi pi-shopping-cart"
                    onClick={() => {
                        ingredients.products_found.forEach(ingredient => {
                            addProduct(ingredient, 1);
                        });
                        onHide();
                    }}
                    className="p-button-success"
                />
            )}
        </div>
    );

    return (
        <Dialog
            header="Résultat de l'analyse des ingrédients"
            visible={visible}
            style={{ width: '50vw', minHeight: '50vh' }}
            footer={foundIngredientsFooter}
            onHide={onHide}
        >
            {ingredients.products_found.length === 0 && ingredients.products_not_found.length === 0 && (
                <div>
                    <h3 className="text-red-600">Aucun ingrédient trouvé</h3>
                    <p>Aucun ingrédient n'a été trouvé pour cette recette.</p>
                </div>
            )}
            <div className="mb-4">
                <h3 className="font-bold text-lg">Pour réaliser votre {recipeName} :</h3>
                <ul className="list-disc pl-5">
                    {ingredients?.original_ingredients?.map((ingredient, index) => (
                        <li key={index}>{ingredient.name} - {ingredient.quantity}</li>
                    ))}
                </ul>
            </div>
            {ingredients.products_not_found.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-red-600 font-bold text-lg">Produits non trouvés :</h3>
                    <p>Une notification a été envoyée à nos vendeurs pour ces produits.</p>
                    <ul className="list-disc pl-5">
                        {ingredients.products_not_found.map((product, index) => (
                            <li key={index} className="text-red-500">{product}</li>
                        ))}
                    </ul>
                </div>
            )}
            {ingredients.products_found.length > 0 && (
                <div>
                    <h3 className="text-green-600 font-bold text-lg">Produits trouvés :</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {ingredients.products_found.map((ingredient, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center p-3 border rounded"
                            >
                                <span>{ingredient.name}</span>
                                <Button
                                    icon="pi pi-plus"
                                    className="p-button-rounded p-button-success p-button-sm"
                                    onClick={() => addProduct(ingredient, 1)} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Dialog>
    );
}

