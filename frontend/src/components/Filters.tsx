import { formatLabel } from "../utils/helper";

type FiltersProps<T extends string> = {
    filterName: string;
    filterHeight: number | null;
    filterType: string | null;
    setFilterName: (val: string) => void;
    setFilterHeight: (val: number | null) => void;
    setFilterType: (val: string) => void;
    sortKey: T;
    setSortKey: (val: T) => void;
    sortOrder: "asc" | "desc";
    setSortOrder: (val: "asc" | "desc") => void;
    sortOptions: readonly T[];
    availableTypes: string[];
    onRemove: () => void;
    canRemove: boolean;
    onUndo: () => void;
    removedCount: number;
};

const Filters = <T extends string>({
    filterName,
    filterHeight,
    filterType,
    setFilterName,
    setFilterHeight,
    setFilterType,
    sortKey,
    setSortKey,
    sortOrder,
    setSortOrder,
    sortOptions,
    availableTypes,
    onRemove,
    canRemove,
    onUndo,
    removedCount
}: FiltersProps<T>) => {
    return (
        <section className="mb-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                    type="text"
                    placeholder="Filter by name"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    className="border p-2 rounded"
                />
                <input
                    type="number"
                    placeholder="Filter by height"
                    value={filterHeight ?? ""}
                    onChange={(e) =>
                        setFilterHeight(Number(e.target.value) || null)
                    }
                    className="border p-2 rounded"
                />
                <select
                    value={filterType ?? ""}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">Filter by type</option>
                    {availableTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>

                <div className="flex gap-2">
                    <select
                        value={sortKey}
                        onChange={(e) => setSortKey(e.target.value as T)}
                        className="border p-2 rounded"
                    >
                        {sortOptions.map((key) => (
                            <option key={key} value={key}>
                                Sort by {formatLabel(key)}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={() =>
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                        }
                        className="border px-2 rounded"
                    >
                        {sortOrder === "asc" ? "↑" : "↓"}
                    </button>
                </div>
            </div>

            {removedCount > 0 && (
                <div className="bg-stone-700 p-2 rounded flex justify-between">
                    <span>{removedCount} Pokémon removed.</span>
                    <button
                        onClick={onUndo}
                        className="text-blue-600 underline"
                    >
                        Undo
                    </button>
                </div>
            )}

            <button
                onClick={onRemove}
                disabled={!canRemove}
                className="bg-red-500 text-white px-4 py-1 rounded disabled:opacity-50"
            >
                Remove Selected
            </button>
        </section>
    );
};

export default Filters;
