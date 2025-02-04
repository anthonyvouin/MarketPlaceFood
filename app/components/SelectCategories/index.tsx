import { FloatLabel } from "primereact/floatlabel";
import { MultiSelect } from "primereact/multiselect";

export default function SelectCategories({
    categories,
    selectedCategories,
    setSelectedCategories,
    handleCategoryChange
}) {
    const selectedCategoryObjects = categories.filter(cat =>
        selectedCategories.includes(cat.id)
    );

    const handleChange = (e) => {
        const newSelectedIds = e.value
        setSelectedCategories(newSelectedIds);
        handleCategoryChange(newSelectedIds);
    };

    return (
        <FloatLabel>
            <MultiSelect
                inputId="categories"
                value={selectedCategoryObjects.map(cat => cat.id)}
                options={categories}
                onChange={handleChange}
                optionLabel="name"
                optionValue="id"
                placeholder="Sélectionner une ou plusieurs catégories"
                className="md:border-r-2 px-4 border-black rounded-none w-80 outline-none focus:shadow-none"
                display="chip"
            />
            <label htmlFor="categories">Catégories</label>
        </FloatLabel>
    );
}