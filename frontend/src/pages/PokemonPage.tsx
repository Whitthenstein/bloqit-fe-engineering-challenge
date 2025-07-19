import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPokemonById } from "../utils/indexedDB"; // or similar IndexedDB helper
import PokemonCard from "../components/PokemonCard";
import type { Pokemon } from "../types";

const PokemonPage = () => {
    const { pokemonId } = useParams();
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);

    useEffect(() => {
        const load = async () => {
            const pokemonReceived = await getPokemonById(Number(pokemonId));

            if (pokemonReceived) {
                return setPokemon(pokemonReceived);
            }
        };

        load();
    }, [pokemonId]);

    if (!pokemon) return <div className="p-4">Loading Pokémon...</div>;

    return (
        <div className="p-4">
            <PokemonCard isCondensed={false} pokemon={pokemon} />
        </div>
    );
};

export default PokemonPage;
