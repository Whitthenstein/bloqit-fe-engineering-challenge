import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import PokemonTable from "../components/PokemonTable";
import type { Pokemon } from "../types";
import PokedexProgressBar from "../components/PokedexProgressBar";
import PokemonCard from "../components/PokemonCard";
import { useMediaQuery } from "react-responsive";
import { BASE_API_URL } from "../utils/constants";

const LIMIT = 20;

const PokedexProgressPage: React.FC = () => {
    const [caughtPokemons, setCaughtPokemons] = useState<Pokemon[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState(false);
    const hasFetchedInitially = useRef(false);
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

    const fetchCaughtPokemons = async () => {
        if (loading || !hasMore) return;

        // Only allow one fetch on mount
        if (!hasFetchedInitially.current) {
            hasFetchedInitially.current = true;
        } else if (offset === 0) {
            return; // prevent duplicate fetch with offset 0
        }

        try {
            setLoading(true);

            const response = await axios.get<Pokemon[]>(
                `${BASE_API_URL}/pokemon-caught?limit=${LIMIT}&offset=${offset}`
            );
            const newPokemons = response.data;

            setCaughtPokemons((prev) => [...prev, ...newPokemons]);
            setOffset((prev) => prev + newPokemons.length);

            if (newPokemons.length < LIMIT) {
                setHasMore(false);
            }
        } catch (err) {
            console.error("Failed to fetch more Pokémon", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCaughtPokemons();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <h1>Caught Pokémon</h1>
            <PokedexProgressBar />
            <InfiniteScroll
                dataLength={caughtPokemons.length}
                next={fetchCaughtPokemons}
                hasMore={hasMore}
                loader={<p>Loading more Pokémon...</p>}
                endMessage={<p>No more Pokémon to load.</p>}
            >
                {isMobile ? (
                    <section className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {caughtPokemons.map((pokemon) => (
                            <PokemonCard
                                key={pokemon.id}
                                pokemon={pokemon}
                                isCondensed={true}
                            />
                        ))}
                    </section>
                ) : (
                    <PokemonTable pokemons={caughtPokemons} />
                )}
            </InfiniteScroll>
        </div>
    );
};

export default PokedexProgressPage;
