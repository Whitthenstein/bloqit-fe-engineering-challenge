export type Stat = {
    base_stat: number;
    stat: { name: string };
};

export type PokemonType = {
    type: { name: string };
};

export type Pokemon = {
    id: number;
    name: string;
    url: string;
    notes: string;
    caughtAt: string | null;
    height: number;
    weight: number;
    stats: Stat[];
    types: PokemonType[];
    sprites: {
        front_default: string;
        other?: {
            ["official-artwork"]?: { front_default: string };
        };
    };
};
