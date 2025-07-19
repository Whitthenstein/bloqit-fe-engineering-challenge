type Props = {
    className?: string;
    isGrayscale: boolean;
    style?: React.CSSProperties;
};

function Pokeball({ className, isGrayscale, style }: Props) {
    return (
        <img
            style={style}
            className={`${className} ${isGrayscale ? "filter grayscale" : "filter-none"}`}
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg"
            alt="Pokeball"
        />
    );
}

export default Pokeball;
