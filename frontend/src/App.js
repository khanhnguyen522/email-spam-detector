import React, { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const analyzeEmailContent = async (content) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: content }),
      });

      const data = await response.json();
      console.log("Backend Response:", data);
      return data.result === "SPAM"
        ? "This email is likely to be spam."
        : "This email is not considered spam.";
    } catch (error) {
      console.error("Error analyzing email content:", error);
      return "Error analyzing email content.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input === "") {
      alert("Please Enter Email Content to Detect");
    } else {
      setText(input);
      const analyzedResult = await analyzeEmailContent(input);
      setResult(analyzedResult);
      setInput("");
    }
  };

  return (
    <main className="bg-gradient-to-br from-main-purple flex flex-col min-h-screen text-black">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 mx-6 my-12 font-mono rounded-2xl max-h-[720px]">
          <p className="m-4 text-[3rem] font-bold">Email Spam Detector</p>
          <p className="m-4 text-[1.5rem]">
            Analyze emails to accurately identify potential spam using advanced
            detection algorithms.
          </p>
          <p className="ml-4 mt-2 font-bold">By: PCT</p>

          <form onSubmit={handleSubmit}>
            <p className="ml-4 mt-12 text-[1.25rem">
              Enter the Email Content to Analyze
            </p>
            <input
              className="m-4 p-2 w-[60%] rounded-lg border-2 border-[#838181]"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              className="m-4 p-2 rounded-lg font-sans border-2 border-[#838181]"
              type="submit"
            >
              Let's go
            </button>
          </form>
        </div>

        <div className="min-h-screen col-span-2 ">
          <div className="grid grid-cols-3  mt-14 ml-12 mr-24 rounded-md p-6 shadow-[2px_2px_2px_2px_rgba(0,0,0,0.3)]">
            <div className="col-span-2">
              <div className="mt-12 mb-12 ml-12 flex flex-col items-left gap-3  p-4 rounded-md w-[80%] shadow-[2px_2px_2px_2px_rgba(0,0,0,0.3)]">
                <p className="font-mono font-bold text-[1.25rem]">
                  Email Content
                </p>
                <p className="font-mono">{text}</p>
              </div>
            </div>

            <div className="mt-14">
              <p className="font-mono font-bold text-[1.25rem]">Result</p>
              <div className="text-[1.5rem] font-mono font-semibold text-red-600">
                {result || "No Result Yet"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
