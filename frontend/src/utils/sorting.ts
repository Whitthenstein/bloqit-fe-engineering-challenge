import type { Pokemon } from "../types";

export function getSortValue<SortKey extends string>(
    pokemon: Pokemon,
    key: SortKey
): string | number {
    switch (key) {
        case "id":
            return pokemon.id;
        case "name":
            return pokemon.name;
        case "height":
            return pokemon.height;
        case "types":
            return pokemon.types[0]?.type.name ?? "";
        case "caughtAt":
            return pokemon.caughtAt;
        default:
            return "";
    }
}
