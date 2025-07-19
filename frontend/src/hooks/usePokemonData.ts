import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
    getAllPokemons,
    savePokemons,
    clearPokemons,
    savePokemon,
    getPokemonById
} from "../utils/indexedDB";
import type { Pokemon } from "../types";
import { BASE_API_URL } from "../utils/constants";

const BATCH_SIZE = 100;

export default function usePokemonData() {
    const [detailedList, setDetailedList] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchProgress, setFetchProgress] = useState(0);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    // Load cache on mount
    useEffect(() => {
        (async () => {
            const cached = await getAllPokemons();
            if (cached.length > 0) {
                setDetailedList(cached);
            }
        })();
    }, []);

    // Listen for online/offline
    useEffect(() => {
        function goOnline() {
            setIsOffline(false);
            fetchAllInBatches();
        }
        function goOffline() {
            setIsOffline(true);
        }
        window.addEventListener("online", goOnline);
        window.addEventListener("offline", goOffline);

        if (navigator.onLine) {
            fetchAllInBatches();
        }

        return () => {
            window.removeEventListener("online", goOnline);
            window.removeEventListener("offline", goOffline);
        };
    }, []);

    // Fetch batch function
    const fetchBatch = useCallback(async (offset: number, limit: number) => {
        const res = await axios.get(
            `${BASE_API_URL}/pokemon?limit=${limit}&offset=${offset}`
        );

        const batchBasic = res.data;

        const detailedBatch =
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            batchBasic.map((p: any) => {
                return {
                    ...p,
                    isVisible: true,
                    isSelected: false
                };
            });

        return detailedBatch;
    }, []);

    // Fetch all in batches
    const fetchAllInBatches = useCallback(async () => {
        setLoading(true);
        setFetchProgress(0);
        await clearPokemons();

        const totalPokemonResponse = await axios.get(
            `${BASE_API_URL}/pokedex/total`
        );
        const totalPokemon = totalPokemonResponse.data.total;

        let allDetailed: Pokemon[] = [];
        for (let offset = 0; offset < totalPokemon; offset += BATCH_SIZE) {
            try {
                const batch = await fetchBatch(offset, BATCH_SIZE);
                allDetailed = allDetailed.concat(batch);
                setDetailedList([...allDetailed]);
                await savePokemons(batch);
                setFetchProgress(
                    Math.min(
                        100,
                        Math.round((allDetailed.length / totalPokemon) * 100)
                    )
                );
            } catch (error) {
                console.error("Error fetching batch:", error);
                break;
            }
        }
        setLoading(false);
    }, [fetchBatch]);

    const updatePokemon = async (
        pokemonId: number,
        newNotes?: string,
        newCaughtAt?: string
    ) => {
        try {
            const oldPokemon = await getPokemonById(pokemonId);

            const response = await axios.patch(
                `${BASE_API_URL}/pokemon/${pokemonId}`,
                {
                    notes: newNotes,
                    caughtAt: newCaughtAt || oldPokemon?.caughtAt
                }
            );

            if (response.status >= 200 && response.status < 300) {
                const updatedPokemon = {
                    ...response.data,
                    isVisible: oldPokemon?.isVisible,
                    isSelected: oldPokemon?.isSelected
                };
                console.log(
                    `Successfully updated notes for Pokémon ${pokemonId}`
                );

                savePokemon(updatedPokemon);
                setDetailedList((prev) =>
                    prev.map((p) =>
                        p.id === updatedPokemon.id ? updatedPokemon : p
                    )
                );

                return updatedPokemon;
            } else {
                console.warn(
                    `Failed to update Pokémon ${pokemonId}: status ${response.status}`
                );
            }
        } catch (err) {
            console.error(
                `Error updating notes for Pokémon ${pokemonId}:`,
                err
            );
        }
    };

    return {
        detailedList,
        setDetailedList,
        loading,
        fetchProgress,
        isOffline,
        fetchAllInBatches,
        updatePokemon
    };
}
