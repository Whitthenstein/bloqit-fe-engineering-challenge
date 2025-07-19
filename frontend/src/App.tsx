import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PokemonPage from "./pages/PokemonPage";
import PokedexProgressPage from "./pages/PokedexProgressPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/:pokemonId" element={<PokemonPage />} />
            <Route path="/pokedex-progress" element={<PokedexProgressPage />} />
        </Routes>
    );
}

export default App;
