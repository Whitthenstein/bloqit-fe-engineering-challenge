import type { Pokemon } from "../types";

export function getStat(stats: Pokemon["stats"], name: string): number {
    return stats.find((s) => s.stat.name === name)?.base_stat ?? 0;
}

export function formatLabel(attr: string): string {
    // Insert a space before all capital letters
    const spaced = attr.replace(/([a-z])([A-Z])/g, "$1 $2");
    // Capitalize the first letter of each word
    return spaced.replace(/\b\w/g, (char) => char.toUpperCase());
}
