"use client";

import React, { useState } from "react";
import { Brain, BarChart3, History, Target } from "lucide-react";
import { Sparkles } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { Send } from "lucide-react";
import { Loader2 as LoaderIcon } from "lucide-react";

const EmotionAI = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<{
    emotion: EmotionType;
    confidence: number;
    secondary_emotions: { emotion: EmotionType; score: number }[];
  } | null>(null);
  const [history, setHistory] = useState<{ text: string; result: typeof result; timestamp: Date }[]>([]);
  const [loading, setLoading] = useState(false);

  type EmotionType = "happy" | "sad" | "angry" | "fear" | "surprise" | "neutral";

  const emotions: Record<EmotionType, { color: string; bg: string; icon: string }> = {
    happy: { color: "text-yellow-600", bg: "bg-yellow-50", icon: "😊" },
    sad: { color: "text-blue-600", bg: "bg-blue-50", icon: "😢" },
    angry: { color: "text-red-600", bg: "bg-red-50", icon: "😠" },
    fear: { color: "text-purple-600", bg: "bg-purple-50", icon: "😨" },
    surprise: { color: "text-green-600", bg: "bg-green-50", icon: "😮" },
    neutral: { color: "text-gray-600", bg: "bg-gray-50", icon: "😐" }
  };

  const analyzeEmotion = async () => {
    if (!text.trim()) return;

    setLoading(true);
    // Simulated API call - replace with actual endpoint
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockResult = {
        emotion: "happy" as EmotionType,
        confidence: 0.85,
        secondary_emotions: [
          { emotion: "surprise" as EmotionType, score: 0.10 },
          { emotion: "neutral" as EmotionType, score: 0.05 }
        ]
      };
      setResult(mockResult);
      setHistory([{ text, result: mockResult, timestamp: new Date() }, ...history.slice(0, 4)]);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-8 h-8 text-blue-600"><Sparkles /></span>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
              Emotion<span className="text-blue-600">AI</span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Understand the emotions behind your text using advanced machine learning
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Brain,
              title: "AI-Powered Analysis",
              description: "Advanced machine learning models for accurate emotion detection"
            },
            {
              icon: Target,
              title: "Real-time Processing",
              description: "Get instant emotional analysis of your text"
            },
            {
              icon: BarChart3,
              title: "Multiple Emotions",
              description: "Detect primary and secondary emotional patterns"
            }
          ].map((feature) => (
            <div key={feature.title} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
              {React.createElement(feature.icon as React.ComponentType<React.SVGProps<SVGSVGElement>>, { className: "w-8 h-8 text-blue-600 mb-4" })}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Analyze Text</h2>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here..."
            className="w-full p-4 h-32 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all resize-none mb-4"
          />
          <button
            onClick={analyzeEmotion}
            disabled={loading || !text.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 px-6 py-3 rounded-xl text-lg font-medium text-white transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LoaderIcon className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Analyze Emotions
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="animate-fade-in bg-white rounded-2xl border border-gray-200 p-8 mb-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Analysis Results</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Primary Emotion */}
              <div className={`${emotions[result.emotion].bg} p-6 rounded-xl border border-gray-200`}>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Primary Emotion</h3>
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{emotions[result.emotion].icon}</span>
                  <div>
                    <p className={`${emotions[result.emotion].color} text-xl font-semibold capitalize`}>
                      {result.emotion}
                    </p>
                    <p className="text-gray-600">
                      Confidence: {(result.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Secondary Emotions */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Secondary Emotions</h3>
                <div className="space-y-3">
                  {result.secondary_emotions.map((emotion) => (
                    <div key={emotion.emotion} className="flex items-center gap-3">
                      <span className="text-2xl">{emotions[emotion.emotion].icon}</span>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className={`${emotions[emotion.emotion].color} capitalize`}>
                            {emotion.emotion}
                          </span>
                          <span className="text-gray-600 text-sm">
                            {(emotion.score * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${emotions[emotion.emotion].bg}`}
                            style={{ width: `${emotion.score * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-6 h-6 text-blue-600"><History /></span>
              <h2 className="text-2xl font-semibold text-gray-900">Analysis History</h2>
            </div>
            <div className="space-y-4">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-4"
                >
                  {item.result && (
                    <>
                      <span className="text-2xl">{emotions[item.result.emotion].icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600 truncate">{item.text}</p>
                        <p className={`${emotions[item.result.emotion].color} font-medium capitalize`}>
                          {item.result.emotion}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EmotionAI;