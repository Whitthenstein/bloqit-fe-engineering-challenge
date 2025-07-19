import React, { useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";

import type { Pokemon } from "../types";
import Filters from "../components/Filters";
import PokemonCard from "../components/PokemonCard";
import PokemonTable from "../components/PokemonTable";
import Pagination from "../components/Pagination";
import { getSortValue } from "../utils/sorting";
import usePokemonData from "../hooks/usePokemonData";
import PokedexProgressBar from "../components/PokedexProgressBar";
import DownloadCSVButton from "../components/DownloadCsvButton";

const PAGE_SIZE = 30;

const HomePage: React.FC = () => {
    const { detailedList, setDetailedList, loading, fetchProgress, isOffline } =
        usePokemonData();

    const sortOptions = ["id", "name", "height", "types", "caughtAt"] as const;
    type SortKey = (typeof sortOptions)[number];

    // Filter/Sort/Pagination state
    const [filterName, setFilterName] = useState("");
    const [filterHeight, setFilterHeight] = useState<number | null>(null);
    const [filterType, setFilterType] = useState<string | null>(null);
    const [sortKey, setSortKey] = useState<SortKey>("id");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(1);

    const [removed, setRemoved] = useState<Pokemon[]>([]);
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

    const filteredAndSorted = useMemo(() => {
        return detailedList
            .filter((p) => p.isVisible)
            .filter((p) =>
                p.name.toLowerCase().includes(filterName.toLowerCase())
            )
            .filter((p) => (filterHeight ? p.height === filterHeight : true))
            .filter((p) =>
                filterType
                    ? p.types.some((t) => t.type.name === filterType)
                    : true
            )
            .sort((a, b) => {
                let valA = getSortValue(a, sortKey);
                let valB = getSortValue(b, sortKey);

                if (sortKey === "types") {
                    valA = a.types[0]?.type.name || "";
                    valB = b.types[0]?.type.name || "";
                }

                if (typeof valA === "string" && typeof valB === "string") {
                    return sortOrder === "asc"
                        ? valA.localeCompare(valB)
                        : valB.localeCompare(valA);
                } else if (
                    typeof valA === "number" &&
                    typeof valB === "number"
                ) {
                    return sortOrder === "asc" ? valA - valB : valB - valA;
                }
                return 0;
            });
    }, [
        detailedList,
        filterName,
        filterHeight,
        filterType,
        sortKey,
        sortOrder
    ]);

    const pageCount = Math.ceil(filteredAndSorted.length / PAGE_SIZE);
    const currentPageData = useMemo(() => {
        return filteredAndSorted.slice(
            (page - 1) * PAGE_SIZE,
            page * PAGE_SIZE
        );
    }, [filteredAndSorted, page]);

    const toggleSelect = (id: number) => {
        setDetailedList((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, isSelected: !p.isSelected } : p
            )
        );
    };

    const removeSelected = () => {
        const toRemove = detailedList.filter((p) => p.isSelected);
        setRemoved([...removed, ...toRemove]);
        setDetailedList((prev) =>
            prev.map((p) =>
                p.isSelected ? { ...p, isVisible: false, isSelected: false } : p
            )
        );
    };

    const undoRemove = () => {
        const restoredIds = removed.map((p) => p.id);
        setDetailedList((prev) =>
            prev.map((p) =>
                restoredIds.includes(p.id) ? { ...p, isVisible: true } : p
            )
        );
        setRemoved([]);
    };

    const availableTypes = [
        ...new Set(detailedList.flatMap((p) => p.types.map((t) => t.type.name)))
    ].sort();

    const handleSetPage = (newPage: number) => {
        setPage(newPage);

        window.scrollTo({ top: 0, behavior: "smooth" }); // return to the top of the page
    };

    return (
        <div className="container mx-auto p-4">
            <section className="flex flex-col items-center justify-center p-4 gap-2">
                <h1 className="text-2xl font-bold text-center mb-4">Pokédex</h1>
                <PokedexProgressBar />
                <DownloadCSVButton data={detailedList} />
            </section>

            {isOffline && (
                <div className="bg-yellow-300 text-black p-2 text-center mb-4 rounded">
                    You are offline. Showing cached Pokémon data.
                </div>
            )}

            {loading && (
                <div className="text-center mb-4">
                    <progress
                        className="w-full"
                        value={fetchProgress}
                        max={100}
                    />
                    <div>{fetchProgress}% loaded</div>
                </div>
            )}

            <Filters
                filterName={filterName}
                filterHeight={filterHeight}
                filterType={filterType}
                setFilterName={setFilterName}
                setFilterHeight={setFilterHeight}
                setFilterType={setFilterType}
                sortKey={sortKey}
                setSortKey={setSortKey}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                sortOptions={sortOptions}
                availableTypes={availableTypes}
                onRemove={removeSelected}
                canRemove={detailedList.some((p) => p.isSelected)}
                onUndo={undoRemove}
                removedCount={removed.length}
            />

            <Pagination
                currentPage={page}
                pageCount={pageCount}
                setPage={setPage}
            />

            {isMobile ? (
                <section className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {currentPageData.map((pokemon) => (
                        <PokemonCard
                            key={pokemon.id}
                            pokemon={pokemon}
                            toggleSelect={toggleSelect}
                            isCondensed={true}
                        />
                    ))}
                </section>
            ) : (
                <PokemonTable
                    pokemons={currentPageData}
                    toggleSelect={toggleSelect}
                />
            )}

            {currentPageData.length > 0 && (
                <Pagination
                    currentPage={page}
                    pageCount={pageCount}
                    setPage={handleSetPage}
                />
            )}
        </div>
    );
};

export default HomePage;
