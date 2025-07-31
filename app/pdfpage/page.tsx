"use client";
import "../../styling/pdf.css"
import { useState, DragEvent, ChangeEvent } from "react";

const PdfPage = () => {
    const [error, setError] = useState("");
    const [lines, setLines] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // logic when pdf is dropped
    const handleUpload = async (file: File) => {
        setError("");
        setLines([]);
        setLoading(true);

        if (file.type !== "application/pdf") {
            setError("Only PDF files are allowed!");
            setLoading(false);
            return;
        }

        // add file to formdata
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/pdf", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setLines(data.lines || []);
            } else {
                setError(data.error || "Extraction failed");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    // click to add file
    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
    };

    // if pdf is dropped to the box
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleUpload(file);
        }
    };

    return (
        <div className="container">
            <h1 className="container-title">Drop your pdf here!</h1>
            <div
                className="dropzone"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                <p>Drag & Drop your PDF here</p>
                <p>or</p>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileInput}
                />
            </div>

            {loading && <p className="loading">Processing...</p>}
            {error && <p className="error">Error: {error}</p>}

            {lines.length > 0 && (
                <pre className="output">
                    {lines.map((line, idx) => (
                        <div key={idx}>{line}</div>
                    ))}
                </pre>
            )}
        </div>
    );
};

export default PdfPage;