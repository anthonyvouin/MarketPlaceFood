import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Slider } from "primereact/slider";
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';

export default function ProductFiltersAside({
    categories,
    handlePriceChange,
    handleCategoryChange,
    isFilterOpen,
    setIsFilterOpen,
    priceRange,
    selectedCategories,
    onReset,
    selectedOption,
    updateFilters,
    booleanOptions
}) {
    return (
        <>
            <div
                className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsFilterOpen(false)}
            />

            <aside className={`fixed top-0 right-0 w-full xl:w-1/3 2xl:w-1/4 h-screen p-8 bg-white border-l border-gray-300 shadow-2xl space-y-8 overflow-y-auto transform transition-all duration-500 ease-in-out ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}>
                <h2 className="text-3xl font-bold text-primaryColor mb-6">🎛️ Filtres</h2>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">💰 Prix</h3>
                    <p className="text-sm text-gray-600">{priceRange[0]}€ - {priceRange[1]}€</p>
                    <Slider
                        value={priceRange}
                        onChange={handlePriceChange}
                        range
                        min={0}
                        max={50}
                        step={1}
                        className="w-full"
                    />
                </div>

                <FloatLabel>
                    <Dropdown inputId="is-discounted" value={selectedOption} onChange={(e) => updateFilters(e)} options={booleanOptions} optionLabel="label" className="w-40 border-r-2 border-black rounded-none" />
                    <label htmlFor="is-discounted">En promotion ?</label>
                </FloatLabel>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">📦 Catégories</h3>
                    <div className="flex flex-wrap gap-4">
                        {categories.map((category) => (
                            <label
                                key={category.id}
                                className={`flex items-center gap-3 cursor-pointer p-3 w-full border border-gray-300 rounded-xl transition-all duration-300 ${selectedCategories.includes(category.id)
                                    ? 'bg-green-500 text-white'
                                    : 'hover:bg-gray-100'
                                    }`}
                            >
                                <Checkbox
                                    inputId={category.id}
                                    value={category.id}
                                    checked={selectedCategories.includes(category.id)}
                                    onChange={() => handleCategoryChange(category.id)}
                                />

                                <span className="text-sm font-medium">{category.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-4 pt-4 border-t border-gray-200">
                    <Button
                        label="🔄 Réinitialiser"
                        onClick={onReset}
                        className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                    />
                    <Button
                        label="Fermer les filtres"
                        icon="pi pi-times"
                        onClick={() => setIsFilterOpen(false)}
                        className="w-full bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-all"
                    />
                </div>
            </aside>
        </>
    );
}
