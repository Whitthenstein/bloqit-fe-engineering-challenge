type PokeballProps = {
    className?: string;
    isGrayscale: boolean;
    style?: React.CSSProperties;
};

const Pokeball: React.FC<PokeballProps> = ({
    className,
    isGrayscale,
    style
}) => {
    return (
        <img
            style={style}
            className={`${className} ${isGrayscale ? "filter grayscale" : "filter-none"}`}
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg"
            alt="Pokeball"
        />
    );
};

export default Pokeball;
