import React, { useState } from "react";
import { FileCode, Check, Copy, AlertTriangle, Play, RefreshCcw } from "lucide-react";

export default function JsonFormatter() {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleFormat = (spaces: number = 2) => {
    setError("");
    setSuccess(false);
    if (!jsonInput.trim()) return;

    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, spaces));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (e: any) {
      setError(e.message || "Invalid JSON structure. Please check for syntax errors (e.g. missing commas, matching brackets, or double quotes).");
    }
  };

  const handleMinify = () => {
    setError("");
    setSuccess(false);
    if (!jsonInput.trim()) return;

    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (e: any) {
      setError(e.message || "Invalid JSON structure. Cannot minify.");
    }
  };

  const handleValidate = () => {
    setError("");
    setSuccess(false);
    if (!jsonInput.trim()) {
      setError("Please input some JSON to validate.");
      return;
    }

    try {
      JSON.parse(jsonInput);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      setError(e.message || "Invalid JSON.");
    }
  };

  const handleCopy = () => {
    if (!jsonInput) return;
    navigator.clipboard.writeText(jsonInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="json-formatter-tool" className="p-6 bg-[#fcfbf9] rounded-2xl border border-stone-200 shadow-sm max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-stone-800 flex items-center gap-2">
          <FileCode className="w-5 h-5 text-[#556B2F]" />
          JSON Formatter & Validator
        </h3>
        {jsonInput && (
          <button
            id="json-copy-btn"
            onClick={handleCopy}
            className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            Copy JSON
          </button>
        )}
      </div>

      {/* JSON input textarea */}
      <textarea
        id="json-textarea-input"
        rows={8}
        className="w-full p-4 text-xs font-mono bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A9A60]/40 focus:border-[#7A9A60] text-stone-800 placeholder-stone-400"
        placeholder={`Paste your JSON raw text here. E.g.\n{\n  "tea": "matcha",\n  "steepSeconds": 60,\n  "benefits": ["focus", "antioxidants"]\n}`}
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      />

      {/* Operations Panel */}
      <div className="flex flex-wrap gap-2 mt-4 mb-4">
        <button
          id="json-format-2"
          onClick={() => handleFormat(2)}
          disabled={!jsonInput.trim()}
          className="px-3.5 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 disabled:opacity-50 disabled:pointer-events-none rounded-xl text-xs font-semibold transition-colors"
        >
          Format (2 Spaces)
        </button>
        <button
          id="json-format-4"
          onClick={() => handleFormat(4)}
          disabled={!jsonInput.trim()}
          className="px-3.5 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 disabled:opacity-50 disabled:pointer-events-none rounded-xl text-xs font-semibold transition-colors"
        >
          Format (4 Spaces)
        </button>
        <button
          id="json-minify"
          onClick={handleMinify}
          disabled={!jsonInput.trim()}
          className="px-3.5 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 disabled:opacity-50 disabled:pointer-events-none rounded-xl text-xs font-semibold transition-colors"
        >
          Minify JSON
        </button>
        <button
          id="json-validate"
          onClick={handleValidate}
          disabled={!jsonInput.trim()}
          className="px-3.5 py-2 bg-[#7A9A60] hover:bg-[#556B2F] text-white disabled:opacity-50 disabled:pointer-events-none rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          Validate Only
        </button>
        <button
          id="json-clear"
          onClick={() => {
            setJsonInput("");
            setError("");
            setSuccess(false);
          }}
          disabled={!jsonInput}
          className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 disabled:opacity-50 disabled:pointer-events-none rounded-xl text-xs font-semibold transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Success / Error Banners */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-700">
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">Validation Failed</h4>
            <p className="text-xs mt-1 font-mono break-all leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2 text-green-700 text-xs font-semibold">
          <Check className="w-4 h-4 text-green-600" />
          JSON is valid! Applied formatting successfully.
        </div>
      )}
    </div>
  );
}
