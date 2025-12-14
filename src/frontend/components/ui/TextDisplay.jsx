const TextDisplay = ({ value = 0, label = "Warnings" }) => {
    const valueColor = value === 0 ? "text-green-500" : "text-red-500";

    return (
        <div className="relative flex flex-col items-center justify-center h-full w-full text-white">
            <div className="absolute top-4 text-2xl font-bold">{label}</div>
            <div className={`text-6xl font-bold ${valueColor} pt-8`}>
                {value}
            </div>
        </div>
    );
};

export default TextDisplay;
