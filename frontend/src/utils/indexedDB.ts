import { openDB } from "idb";
import type { Pokemon } from "../types";
import axios from "axios";
import { BASE_API_URL } from "./constants";

const DB_NAME = "pokeDB";
const STORE_NAME = "pokemonStore";
const DB_VERSION = 1;

export async function getDB() {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        }
    });
}

export async function savePokemons(pokemons: Pokemon[]) {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    for (const p of pokemons) {
        await tx.store.put(p);
    }
    await tx.done;
}

export async function savePokemon(pokemon: Pokemon) {
    const db = await getDB();
    db.put(STORE_NAME, pokemon);
}

export async function getAllPokemons(): Promise<Pokemon[]> {
    const db = await getDB();
    return db.getAll(STORE_NAME);
}

export async function getPokemonById(
    pokemonId: number
): Promise<Pokemon | undefined> {
    const db = await getDB();
    const cachedPokemon = await db.get(STORE_NAME, pokemonId);

    if (cachedPokemon) {
        return cachedPokemon;
    } else {
        const res = await axios.get(`${BASE_API_URL}/pokemon/${pokemonId}`);

        return res.data;
    }
}

export async function clearPokemons() {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    await tx.store.clear();
    await tx.done;
}
