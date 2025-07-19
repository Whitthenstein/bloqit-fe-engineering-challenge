import express from "express";
import cors from "cors";
import {
    initPokedex,
    getPaginatedPokemons,
    getPokemonById,
    updatePokemon,
    getCaughtPokemons,
    getProgress,
    getTotalPokemons
} from "./pokeService";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

initPokedex();

// GET /api/pokemon?offset=0&limit=20
app.get("/api/pokemon", async (req, res) => {
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 20;
    const pokemons = await getPaginatedPokemons(offset, limit);
    res.json(pokemons);
});

// GET /api/pokemon/:id
app.get("/api/pokemon/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const pokemon = await getPokemonById(id);
    if (!pokemon) return res.status(404).json({ message: "Pokemon not found" });
    res.json(pokemon);
});

// PATCH /api/pokemon/:id
app.patch("/api/pokemon/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { notes, caughtAt } = req.body;

    const updated = await updatePokemon(id, { notes, caughtAt });
    if (!updated) return res.status(404).json({ message: "Pokemon not found" });
    res.json(updated);
});

// GET /api/pokemon-caught
app.get("/api/pokemon-caught", async (req, res) => {
    // Parse limit and offset from query params with defaults
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    console.log("pokemon-caught", limit, offset);

    const caught = await getCaughtPokemons();
    const pagedPokemons = caught.slice(offset, offset + limit);

    res.json(pagedPokemons);
});

// GET /api/pokedex/progress
app.get("/api/pokedex/progress", async (_req, res) => {
    const progress = await getProgress();
    res.json({ progress }); // in percentage
});

// GET /api/pokedex/total
app.get("/api/pokedex/total", async (_req, res) => {
    const total = await getTotalPokemons();
    res.json({ total });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
