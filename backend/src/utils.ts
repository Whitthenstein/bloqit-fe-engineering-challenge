import fs from "fs/promises";
import { Pokemon } from "./types";
import { CAUGHT_POKEMON_PATH, POKEDEX_PATH } from "./constants";

export async function saveToFile(
    data: Pokemon[],
    filePath: string
): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function loadCaughtPokemonData(): Promise<Array<{
    id: number;
    caughtAt: string;
}> | null> {
    try {
        const data = await fs.readFile(CAUGHT_POKEMON_PATH, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return null;
    }
}

export async function loadPokedex(): Promise<Pokemon[]> {
    try {
        const data = await fs.readFile(POKEDEX_PATH, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}
