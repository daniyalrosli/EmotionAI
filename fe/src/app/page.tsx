"use client";

import { useState } from "react";

type PredictionResponse = {
  text: string;
  emotion: string | null;
  scores: Record<string, number>;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function HomePage() {
  const [text, setText] = useState("");
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);

    const trimmed = text.trim();
    if (!trimmed) {
      setError("Please enter some text to analyze.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/predict/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: trimmed }),
      });

      if (!res.ok) {
        throw new Error("Failed to get prediction from the server.");
      }

      const data: PredictionResponse = await res.json();
      setPrediction(data);
    } catch (err) {
      const isNetworkError =
        err instanceof TypeError &&
        (err.message === "Failed to fetch" ||
          err.message === "Load failed" ||
          err.message === "NetworkError when attempting to fetch resource");
      setError(
        isNetworkError
          ? `Could not reach the API at ${API_BASE_URL}. Make sure the backend is running: pip install -r requirements.txt && uvicorn app:app --reload --port 8000`
          : err instanceof Error
            ? err.message
            : "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const emotionColor = (emotion: string | null) => {
    if (!emotion) return "bg-gray-700";
    const key = emotion.toLowerCase();
    if (key.includes("joy") || key.includes("happy")) return "bg-emerald-600";
    if (key.includes("sad")) return "bg-sky-700";
    if (key.includes("anger") || key.includes("angry")) return "bg-red-600";
    if (key.includes("fear")) return "bg-purple-700";
    if (key.includes("love")) return "bg-pink-600";
    if (key.includes("surprise")) return "bg-amber-500";
    return "bg-gray-700";
  };

  const sortedScores =
    prediction && prediction.scores
      ? Object.entries(prediction.scores).sort((a, b) => b[1] - a[1])
      : [];

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-black/40 backdrop-blur-xl p-6 sm:p-8 space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            EmotionAI
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Paste any text and let the model detect the dominant emotion.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-200">
            Your text
            <textarea
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-3 text-sm sm:text-base text-slate-50 placeholder:text-slate-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/70 resize-none min-h-[120px]"
              placeholder="e.g. I am feeling amazing today!"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </label>

          {error && (
            <div className="rounded-2xl border border-red-900/70 bg-red-950/60 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              The text is sent to your local FastAPI server at{" "}
              <span className="font-mono">{API_BASE_URL}</span>.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-emerald-50 shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Analyzing..." : "Analyze Emotion"}
            </button>
          </div>
        </form>

        {prediction && (
          <section className="space-y-4 border-t border-slate-800 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Dominant emotion
                </p>
                <div
                  className={`mt-2 inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium text-white ${emotionColor(
                    prediction.emotion
                  )}`}
                >
                  {prediction.emotion ?? "Unknown"}
                </div>
              </div>
              <div className="max-w-xs text-xs text-slate-500 text-right">
                Model:{" "}
                <span className="font-mono">
                  distilbert-base-uncased-emotion
                </span>
              </div>
            </div>

            {sortedScores.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Confidence breakdown
                </p>
                <div className="space-y-1.5">
                  {sortedScores.map(([label, score]) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="w-24 text-xs font-medium text-slate-200 capitalize">
                        {label.toLowerCase()}
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${(score * 100).toFixed(1)}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-xs text-slate-400 tabular-nums">
                        {(score * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {!prediction && !error && (
          <p className="text-xs text-slate-500 text-center border-t border-slate-800 pt-4">
            Tip: try different sentences like{" "}
            <span className="italic">
              &quot;I&apos;m so frustrated with everything today&quot;
            </span>{" "}
            or{" "}
            <span className="italic">
              &quot;I can&apos;t stop smiling, life is beautiful!&quot;
            </span>
            .
          </p>
        )}
      </div>
    </main>
  );
}