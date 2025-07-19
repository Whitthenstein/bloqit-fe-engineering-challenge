type DownloadCSVButtonProps<T> = {
    data: T[];
    filename?: string;
    label?: string;
};

const DownloadCSVButton = <T extends object>({
    data,
    filename = "all_pokemon.csv",
    label = "Download CSV"
}: DownloadCSVButtonProps<T>) => {
    const downloadCSV = () => {
        if (!data || data.length === 0) return;

        const filteredKeys = Object.keys(data[0]).filter(
            (key) => key !== "isSelected" && key !== "isVisible"
        );

        const headers = filteredKeys as (keyof T)[];
        const csvRows = [
            headers.join(","), // Header row
            ...data.map((row) =>
                headers
                    .map((field) => {
                        const cell = row[field];
                        let cellStr = JSON.stringify(cell);
                        cellStr = cellStr.replace(/"/g, '""'); // Escape quotes
                        return `"${cellStr}"`; // Wrap in quotes
                    })
                    .join(",")
            )
        ];

        const csvContent = csvRows.join("\n");
        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;"
        });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return <button onClick={downloadCSV}>{label}</button>;
};

export default DownloadCSVButton;
