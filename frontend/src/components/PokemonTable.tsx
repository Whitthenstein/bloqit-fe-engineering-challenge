import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Pokemon } from "../types";
import { getStat } from "../utils/helper";
import Pokeball from "./Pokeball";
import usePokemonData from "../hooks/usePokemonData";

type PokemonTableProps = {
    pokemons: Pokemon[];
    toggleSelect?: (id: number) => void;
};

const PokemonTable: React.FC<PokemonTableProps> = ({
    pokemons,
    toggleSelect
}) => {
    const { updatePokemon } = usePokemonData();
    const navigate = useNavigate();
    const [pokemonNotes, setPokemonNotes] = useState<{ [id: number]: string }>(
        {}
    );
    const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (pokemons.length > 0) {
            const notesMap = pokemons.reduce(
                (prev, current) => {
                    prev[current.id] = current.notes ?? "";
                    return prev;
                },
                {} as { [id: number]: string }
            );

            setPokemonNotes(notesMap);
        }
    }, [pokemons]);

    const handleNoteChange = (id: number, newNoteValue: string) => {
        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }

        setPokemonNotes({ ...pokemonNotes, [id]: newNoteValue });

        typingTimeout.current = setTimeout(() => {
            updatePokemon(id, newNoteValue);
        }, 500);
    };

    return (
        <table className="table-auto w-full border-collapse">
            <thead>
                <tr>
                    {toggleSelect && (
                        <th className="px-4 py-2 text-left whitespace-nowrap">
                            Select
                        </th>
                    )}
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                        Id
                    </th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                        Image
                    </th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                        Name
                    </th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                        Height
                    </th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                        Weight
                    </th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                        HP
                    </th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                        Speed
                    </th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                        Attack
                    </th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                        Defense
                    </th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                        Sp.Atk
                    </th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                        Sp.Def
                    </th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                        Types
                    </th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                        Note
                    </th>
                </tr>
            </thead>
            <tbody>
                {pokemons.map((p) => (
                    <tr
                        key={p.id}
                        className="hover:bg-stone-800 cursor-pointer"
                        onClick={() => navigate(`/${p.id}`)}
                    >
                        {toggleSelect && (
                            <td className="px-4 py-2 whitespace-nowrap">
                                <input
                                    type="checkbox"
                                    checked={p.isSelected}
                                    onChange={() => toggleSelect(p.id)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </td>
                        )}
                        <td className="px-4 py-2 whitespace-nowrap capitalize">
                            <div className="flex flex-row items-center justify-center">
                                {p.id}
                                <Pokeball
                                    isGrayscale={!p.caughtAt}
                                    className="ml-1"
                                />
                            </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                            <img
                                className="w-12 h-12"
                                src={
                                    p.sprites.front_default ||
                                    p.sprites.other?.["official-artwork"]
                                        ?.front_default
                                }
                                alt={p.name}
                            />
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap capitalize">
                            {p.name}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                            {p.height}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                            {p.weight}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                            {getStat(p.stats, "hp")}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                            {getStat(p.stats, "speed")}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                            {getStat(p.stats, "attack")}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                            {getStat(p.stats, "defense")}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                            {getStat(p.stats, "special-attack")}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                            {getStat(p.stats, "special-defense")}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                            {p.types.map((t) => t.type.name).join(", ")}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                            <textarea
                                value={pokemonNotes[p.id] || ""}
                                onChange={(e) =>
                                    handleNoteChange(p.id, e.target.value)
                                }
                                placeholder="Add note…"
                                className="border p-1 rounded w-full"
                                rows={2}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PokemonTable;
