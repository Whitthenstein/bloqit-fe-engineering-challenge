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
    caughtAt: string;
    notes?: string;
    isVisible?: boolean;
    isSelected?: boolean;
};
