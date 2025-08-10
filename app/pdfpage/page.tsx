"use client";

import { useState, DragEvent, ChangeEvent } from "react";
import ExpandableBox from "@/components/expandablebox";
const Pdfpage = () => {
  const [error, setError] = useState("");
  const [lines, setLines] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [boxActive, setBoxActive] = useState<boolean>(false)

  const resetState = () => {
    setError("");
    setLines([]);
    setAnswer("");
  };

  // handle uploading
  const handleUpload = async (file: File) => {
    resetState();
    setLoading(true);

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed!");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/pdf", { method: "POST", body: formData });
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

  const handleFile = (file?: File) => {
    if (file) {
      handleUpload(file);
    }
  };

  // click to add file
  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
  };

  // if pdf is dropped to the box
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  };

  // ask question about the pdf using openai
  const askQuestion = async () => {
    if (!question.trim()) return;

    setAnswer("Thinking...");
    setQuestion("")

    try {
      const res = await fetch("/api/askquestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, content: lines.join("\n") }),
      });

      const data = await res.json();

      if (res.ok) {
        setAnswer(data.answer);
      } else {
        setAnswer(data.error || "Failed to get answer");
      }
    } catch (err) {
      console.error(err);
      setAnswer("Something went wrong.");
    }
  };

  return (
    <div className="container">
      <h1 className="container-title">Drop your PDF here!</h1>


      <div className="dropzone" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
        <p>Drag & Drop your PDF here</p>
        <p>or</p>
        <input type="file" accept="application/pdf" onChange={handleFileInput} />
      </div>

      {loading && <p className="loading">Processing...</p>}
      {error && <p className="error">Error: {error}</p>}

      {lines.length > 0 && (
        <>
          <ExpandableBox buttonState={boxActive} setButtonState={setBoxActive}>
            <h2>Extracted Text:</h2>
            <pre className="output">
              {lines.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </pre>
          </ExpandableBox>

          <div className="qa-section">
            <h2>Ask a question about the PDF:</h2>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
              cols={50}
              placeholder="Ask something..."
            />
            <br />
            <button onClick={askQuestion}>Ask</button>

            {answer && (
              <div className="answer">
                <h3>Answer:</h3>
                <p>{answer}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Pdfpage;
