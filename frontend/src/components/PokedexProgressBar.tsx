import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Pokeball from "./Pokeball";

const API_URL = "http://localhost:5000/api/pokedex/progress";

const PokedexProgressBar: React.FC = () => {
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const res = await axios.get<{ progress: number }>(API_URL);
                setProgress(res.data.progress); // Expecting a number from 0 to 100
            } catch (err) {
                console.error("Failed to fetch progress:", err);
            }
        };

        fetchProgress();
    }, []);

    return (
        <Link
            className="w-full flex items-center justify-center"
            to="/pokedex-progress"
        >
            <div
                style={{
                    width: "20%",
                    height: "24px",
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    overflow: "hidden",
                    position: "relative"
                }}
            >
                <div
                    style={{
                        height: "100%",
                        width: `${progress}%`,
                        backgroundColor: "red",
                        transition: "width 0.3s ease-in-out"
                    }}
                />
                <Pokeball
                    className="absolute top-0 h-full transition-[left] duration-300 ease-in-out"
                    style={{ left: `calc(${progress}% - 12px)` }} // Adjust -12px based on Pokeball size
                    isGrayscale={false}
                />
            </div>
        </Link>
    );
};

export default PokedexProgressBar;
