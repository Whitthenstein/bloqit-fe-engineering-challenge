export interface Stat {
    base_stat: number;
    stat: { name: string };
}

export interface Type {
    type: { name: string };
}

export interface Pokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    stats: Stat[];
    types: Type[];
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
}
