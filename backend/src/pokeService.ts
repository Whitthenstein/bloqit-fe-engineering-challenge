import axios from "axios";
import pLimit from "p-limit";
import { Pokemon } from "./types";
import { saveToFile, loadCaughtPokemonData, loadPokedex } from "./utils";
import { CAUGHT_POKEMON_PATH, POKEDEX_PATH } from "./constants";

const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=100000";

export async function initPokedex(): Promise<void> {
    const existing = (await loadPokedex()) as Pokemon[];
    if (existing.length) {
        return;
    }

    const { data } = await axios.get(API_URL);
    const results = data.results; // Full list from PokéAPI

    const limit = pLimit(10); // Max 10 concurrent requests

    console.log(`Fetching Pokemon to populate db file.`);

    const fetchDetailsTasks = results.map((base: any) =>
        limit(async () => {
            try {
                const res = await axios.get(base.url);
                const details = res.data;

                const pokemon: Pokemon = {
                    id: details.id,
                    url: base.url,
                    name: details.name,
                    notes: "",
                    caughtAt: null,
                    height: details.height,
                    weight: details.weight,
                    stats: details.stats,
                    types: details.types,
                    sprites: {
                        front_default: details.sprites.front_default,
                        other: {
                            "official-artwork": {
                                front_default:
                                    details.sprites.other["official-artwork"]
                            }
                        }
                    }
                };

                return pokemon;
            } catch (err) {
                if (err instanceof Error) {
                    console.warn(
                        `Failed to fetch ${base.name}: ${err.message}`
                    );
                } else {
                    console.warn(`Failed to fetch ${base.name}:`, err);
                }

                return null;
            }
        })
    );

    const detailedPokemons = await Promise.all(fetchDetailsTasks);
    const filtered = detailedPokemons.filter((p): p is Pokemon => p !== null);

    console.log(`Populated db file with ${results.length} pokemon.`);

    // populate pokedex with caught pokemon
    // this is just to simplify the project,
    // later it should have integration with a third-party, probably
    const caughtPokemonData = await loadCaughtPokemonData();

    const filteredWithCaughtPokemonData = caughtPokemonData
        ? filtered.map((p) => {
              const caughtPokemonIndex = caughtPokemonData.findIndex(
                  (val) => val.id === p.id
              );
              const newPokemon =
                  caughtPokemonIndex !== -1
                      ? {
                            ...p,
                            caughtAt:
                                caughtPokemonData[caughtPokemonIndex].caughtAt
                        }
                      : p;

              return newPokemon;
          })
        : filtered;

    await saveToFile(filteredWithCaughtPokemonData, POKEDEX_PATH);
}

export async function getAllPokemons(): Promise<Pokemon[]> {
    return await loadPokedex();
}

export async function getPaginatedPokemons(
    offset = 0,
    limit = 20
): Promise<Pokemon[]> {
    const data = await loadPokedex();
    return data.slice(offset, offset + limit);
}

export async function getPokemonById(id: number): Promise<Pokemon | null> {
    const data = await loadPokedex();
    return data.find((p) => p.id === id) || null;
}

export async function updatePokemon(
    id: number,
    updates: Partial<Pick<Pokemon, "notes" | "caughtAt">>
): Promise<Pokemon | null> {
    const data = await loadPokedex();
    const index = data.findIndex((p) => p.id === id);
    if (index === -1) return null;

    data[index] = { ...data[index], ...updates };
    await saveToFile(data, POKEDEX_PATH);
    return data[index];
}

export async function getCaughtPokemons(): Promise<Pokemon[]> {
    const data = await loadPokedex();
    return data.filter((p) => p.caughtAt !== null);
}

export async function getProgress(): Promise<number> {
    const data = await loadPokedex();
    const caught = data.filter((p) => p.caughtAt !== null).length;
    return parseFloat(((caught / data.length) * 100).toFixed(2));
}

export async function getTotalPokemons(): Promise<number> {
    const data = await loadPokedex();
    return data.length;
}
