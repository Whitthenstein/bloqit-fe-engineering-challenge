import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Pokemon } from "../types";
import { getStat } from "../utils/helper";
import Pokeball from "./Pokeball";
import usePokemonData from "../hooks/usePokemonData";

interface Props {
    pokemon: Pokemon;
    toggleSelect?: (id: number) => void;
    isCondensed: boolean;
}

const PokemonCard: React.FC<Props> = ({
    pokemon,
    toggleSelect,
    isCondensed
}) => {
    const { updatePokemon } = usePokemonData();
    const navigate = useNavigate();
    const [pokemonNotes, setPokemonNotes] = useState(pokemon.notes);
    const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleNoteChange = (id: number, newNotesValue: string) => {
        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }

        setPokemonNotes(newNotesValue);

        typingTimeout.current = setTimeout(() => {
            updatePokemon(id, newNotesValue);
        }, 500);
    };

    return (
        <div
            className="hover:shadow-lg transition border rounded p-4 relative text-center"
            onClick={() => isCondensed && navigate(`/${pokemon.id}`)}
        >
            {toggleSelect && (
                <input
                    type="checkbox"
                    checked={pokemon.isSelected}
                    onChange={() => toggleSelect(pokemon.id)}
                    className="absolute top-2 left-2"
                />
            )}
            <img
                src={
                    pokemon.sprites.front_default ||
                    pokemon.sprites.other?.["official-artwork"]?.front_default
                }
                alt={pokemon.name}
                className="w-24 h-24 mx-auto"
            />
            <h3 className="flex flex-row items-center justify-center text-xl capitalize font-semibold mt-2">
                {pokemon.id}
                <Pokeball
                    isGrayscale={!pokemon.caughtAt}
                    className="ml-1 w-6"
                />
            </h3>
            <h3 className="text-2xl capitalize font-semibold mt-2">
                {pokemon.name}
            </h3>

            <div className="p-4">
                <div>
                    <strong>Height:</strong> {pokemon.height}
                </div>
                <div>
                    <strong>Weight:</strong> {pokemon.weight}
                </div>
                <div>
                    <strong>HP:</strong> {getStat(pokemon.stats, "hp")}
                </div>
                <div>
                    <strong>Speed:</strong> {getStat(pokemon.stats, "speed")}
                </div>
                <div>
                    <strong>Attack:</strong> {getStat(pokemon.stats, "attack")}
                </div>
                <div>
                    <strong>Defense:</strong>{" "}
                    {getStat(pokemon.stats, "defense")}
                </div>
                <div>
                    <strong>Sp. Atk:</strong>{" "}
                    {getStat(pokemon.stats, "special-attack")}
                </div>
                <div>
                    <strong>Sp. Def:</strong>{" "}
                    {getStat(pokemon.stats, "special-defense")}
                </div>
                <div>
                    <strong>Types:</strong>{" "}
                    {pokemon.types.map((t) => t.type.name).join(", ")}
                </div>
                <br />
                <div>
                    <strong>Date Added:</strong>{" "}
                    {new Date(Number(pokemon.caughtAt)).toLocaleString()}
                </div>
            </div>
            <textarea
                value={pokemonNotes || ""}
                onChange={(e) => handleNoteChange(pokemon.id, e.target.value)}
                placeholder="Add note…"
                className="border p-1 rounded w-full mt-2"
                rows={2}
            />
        </div>
    );
};

export default PokemonCard;
