import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Square,
  Wand2,
  Lightbulb,
  ArrowRight,
  AlertCircle,
  PenLine,
  Loader2,
  CheckCircle2,
  Languages,
} from "lucide-react";

const apiUrl = import.meta.env.VITE_API_KEY;

const App = () => {
  // --- CONFIGURATION ---
  // The execution environment provides the key at runtime
  const apiKey = apiUrl;

  // --- STATE ---
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const recognitionRef = useRef(null);

  // --- LANGUAGE CODES ---
  const languageCodes = {
    English: "en-US",
    Marathi: "mr-IN",
    Hindi: "hi-IN",
    Punjabi: "pa-IN",
    Spanish: "es-ES",
    French: "fr-FR",
    German: "de-DE",
    Japanese: "ja-JP",
  };

  // --- SPEECH RECOGNITION SETUP ---
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognitionRef.current.onend = () => {
        if (isRecording) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.error("Failed to restart recognition:", e);
          }
        }
      };
    }
  }, [isRecording]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    if (!isRecording) {
      setTranscript("");
      setResult(null);
      setError(null);
      try {
        recognitionRef.current.lang =
          languageCodes[selectedLanguage] || "en-US";
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        setError("Could not start microphone. Please check permissions.");
      }
    } else {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // --- AI ANALYSIS ---
  const handleAnalyze = async () => {
    if (!transcript.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const translationLangs = ["English", "Marathi", "Hindi"];
    let translationPrompt = "";

    if (translationLangs.includes(selectedLanguage)) {
      const targets = translationLangs.filter((l) => l !== selectedLanguage);
      translationPrompt = `Additionally, since the input is in ${selectedLanguage}, translate the corrected text into ${targets.join(" and ")}. Include these in the "translations" array in the JSON.`;
    }

    const systemPrompt = `You are an expert linguist and polyglot coaching a student.
    Input Language: ${selectedLanguage}
    
    Instructions:
    1. Verify if the input is grammatically correct in ${selectedLanguage}.
    2. Provide a grammatically perfect, natural-sounding version.
    3. Explain briefly in English why any changes were made.
    ${translationPrompt}
    
    Return ONLY a valid JSON object:
    {
      "detectedLanguage": "${selectedLanguage}",
      "isCorrect": boolean,
      "correctedText": "string",
      "explanation": "string",
      "translations": [
        { "language": "string", "text": "string" }
      ]
    }`;

    let retries = 0;
    const maxRetries = 5;

    const callAI = async () => {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { parts: [{ text: `Input to check: "${transcript}"` }] },
            ],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { responseMimeType: "application/json" },
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "API Error");

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("No response from AI");

      return JSON.parse(text);
    };

    while (retries < maxRetries) {
      try {
        const data = await callAI();
        setResult(data);
        setLoading(false);
        return;
      } catch (e) {
        retries++;
        if (retries === maxRetries) {
          setError(
            "Failed to reach the AI engine. Please check your connection.",
          );
          setLoading(false);
        } else {
          await new Promise((r) => setTimeout(r, Math.pow(2, retries) * 1000));
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-4 lg:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 mb-4 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-widest">
            <Wand2 className="w-3 h-3" />
            <span>AI Powered Language Coach</span>
          </div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 mb-2 leading-normal">
            LingoCoach AI
          </h1>
          <p className="text-slate-500 italic text-sm">
            "Master your speech through real-time feedback"
          </p>
        </header>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT: INPUT */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/50 flex-grow flex flex-col">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center">
                <Mic className="w-4 h-4 mr-2" />
                Practice Session
              </h2>

              <div className="mb-6">
                <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                  Target Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  disabled={isRecording}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer font-medium text-slate-700 disabled:opacity-50"
                >
                  {Object.keys(languageCodes).map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}{" "}
                      {lang === "Marathi" ||
                      lang === "Hindi" ||
                      lang === "Punjabi"
                        ? `(${lang === "Marathi" ? "मराठी" : lang === "Hindi" ? "हिन्दी" : "ਪੰਜਾਬੀ"})`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mic Area */}
              <div
                className={`flex flex-col items-center justify-center py-10 rounded-2xl border transition-all duration-300 mb-6 ${isRecording ? "bg-red-50 border-red-100" : "bg-indigo-50/30 border-indigo-50"}`}
              >
                <div className="relative">
                  <button
                    onClick={toggleRecording}
                    className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 group ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
                  >
                    {isRecording ? (
                      <Square className="text-white w-8 h-8" fill="white" />
                    ) : (
                      <Mic className="text-white w-8 h-8" />
                    )}
                  </button>
                  {isRecording && (
                    <div className="absolute -inset-3 rounded-full border-4 border-red-500/30 animate-ping pointer-events-none"></div>
                  )}
                </div>
                <div
                  className={`mt-6 text-[10px] font-bold uppercase tracking-widest ${isRecording ? "text-red-500 animate-pulse" : "text-indigo-400"}`}
                >
                  {isRecording
                    ? "Recording Speech..."
                    : "Tap to start speaking"}
                </div>
              </div>

              {/* Editable Area */}
              {(transcript || isRecording) && (
                <div className="mt-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center">
                      <PenLine className="w-3 h-3 mr-1" /> Captured Phrase
                    </h3>
                  </div>
                  <textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    className="w-full h-32 p-4 bg-white rounded-xl border border-slate-200 text-slate-700 text-sm leading-relaxed resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-inner"
                    placeholder="Speech will appear here..."
                  />
                  <button
                    onClick={handleAnalyze}
                    disabled={loading || !transcript.trim()}
                    className="w-full mt-4 bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 text-sm flex items-center justify-center tracking-wide"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4 mr-2" /> Check My Grammar
                      </>
                    )}
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs flex items-start animate-in zoom-in duration-300">
                  <AlertCircle className="w-4 h-4 mr-3 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: COACHING FEEDBACK */}
          <div className="lg:col-span-7 flex flex-col">
            {!loading && !result && (
              <div className="bg-white/60 rounded-3xl p-12 text-center border-2 border-dashed border-slate-200 h-full flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <Languages className="text-slate-300 w-10 h-10" />
                </div>
                <h3 className="text-slate-500 font-bold mb-2">
                  No active coaching
                </h3>
                <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                  Submit your speech on the left to receive grammar coaching and
                  translations.
                </p>
              </div>
            )}

            {loading && (
              <div className="bg-white/80 rounded-3xl p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="relative w-16 h-16 mb-6">
                  <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-indigo-600 font-black uppercase tracking-[0.2em] text-[10px]">
                  LingoCoach is analyzing...
                </p>
              </div>
            )}

            {result && (
              <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8 h-full flex flex-col border border-white animate-in slide-in-from-right-8 duration-500">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-indigo-500" />
                    Tutor Feedback
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[9px] font-black uppercase rounded-lg border border-slate-200">
                      {result.detectedLanguage}
                    </span>
                    <span
                      className={`px-3 py-1 text-[9px] font-black uppercase rounded-lg border ${result.isCorrect ? "bg-green-50 text-green-700 border-green-100" : "bg-orange-50 text-orange-700 border-orange-100"}`}
                    >
                      {result.isCorrect
                        ? "Grammar: Perfect"
                        : "Grammar: Improved"}
                    </span>
                  </div>
                </div>

                {/* Analysis Content */}
                <div className="space-y-6 flex-grow">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-red-50/40 rounded-2xl border border-red-100 flex flex-col">
                      <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest mb-3">
                        Original
                      </p>
                      <p className="text-red-600 line-through decoration-red-200 text-sm italic leading-relaxed">
                        {transcript}
                      </p>
                    </div>
                    <div className="p-5 bg-green-50/40 rounded-2xl border border-green-100 flex flex-col">
                      <p className="text-[9px] font-bold text-green-600 uppercase tracking-widest mb-3">
                        Corrected
                      </p>
                      <p className="text-slate-800 font-bold text-base leading-relaxed">
                        {result.correctedText}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start">
                    <Lightbulb className="w-4 h-4 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Coaching Note
                      </p>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {result.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Translations */}
                  {result.translations && result.translations.length > 0 && (
                    <div className="mt-10">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 border-b border-indigo-50 px-1 pb-3 mb-5 flex items-center">
                        <Languages className="w-3 h-3 mr-2" />{" "}
                        Cross-Translations
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {result.translations.map((tr, idx) => (
                          <div
                            key={idx}
                            className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group"
                          >
                            <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-2 group-hover:text-indigo-600 transition-colors">
                              {tr.language}
                            </p>
                            <p className="text-slate-800 font-bold text-sm leading-tight">
                              {tr.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
