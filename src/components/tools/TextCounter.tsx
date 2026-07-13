import React, { useState } from "react";
import { AlignLeft, Copy, Check, Trash2, ArrowUpDown } from "lucide-react";

export default function TextCounter() {
  const [text, setText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const charCount = text.length;
  const charNoSpaces = text.replace(/\s/g, "").length;
  
  const words = text.trim() === "" ? [] : text.trim().split(/\s+/);
  const wordCount = words.length;

  const sentences = text.trim() === "" ? [] : text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;

  const paragraphs = text.trim() === "" ? [] : text.split(/\n+/).filter(p => p.trim().length > 0);
  const paragraphCount = paragraphs.length;

  // Reading time: average 200 words per minute
  const readingTimeMinutes = Math.ceil(wordCount / 200);
  // Tea sips: let's estimate 1 tea sip per 80 words as a quirky tea theme stat!
  const teaSipsEstimated = Math.ceil(wordCount / 80);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toUppercase = () => setText(text.toUpperCase());
  const toLowercase = () => setText(text.toLowerCase());
  
  const toTitleCase = () => {
    const formatted = text.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
    setText(formatted);
  };

  const toSentenceCase = () => {
    if (text.length === 0) return;
    const formatted = text.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (m) => m.toUpperCase());
    setText(formatted);
  };

  const toSlugify = () => {
    const slug = text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-"); // collapse dashes
    setText(slug);
  };

  return (
    <div id="text-counter-tool" className="p-6 bg-[#fcfbf9] rounded-2xl border border-stone-200 shadow-sm max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-stone-800 flex items-center gap-2 mb-4">
        <AlignLeft className="w-5 h-5 text-[#556B2F]" />
        Text Case & Stat Counter
      </h3>

      {/* Input Textarea */}
      <div className="relative mb-4">
        <textarea
          id="text-counter-textarea"
          rows={6}
          className="w-full p-4 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A9A60]/40 focus:border-[#7A9A60] font-sans text-stone-800 placeholder-stone-400"
          placeholder="Paste or type your text here to analyze..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {text && (
          <div className="absolute right-3 bottom-3 flex gap-2">
            <button
              id="text-counter-copy-btn"
              onClick={handleCopy}
              className="p-2 bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-600 rounded-lg transition-colors flex items-center justify-center"
              title="Copy to Clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              id="text-counter-clear-btn"
              onClick={() => setText("")}
              className="p-2 bg-stone-50 border border-stone-200 hover:bg-red-50 hover:text-red-600 text-stone-600 rounded-lg transition-colors flex items-center justify-center"
              title="Clear Text"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Operations Panel */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          id="text-transform-upper"
          onClick={toUppercase}
          disabled={!text}
          className="px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 disabled:opacity-50 disabled:pointer-events-none rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
        >
          <ArrowUpDown className="w-3.5 h-3.5" /> UPPERCASE
        </button>
        <button
          id="text-transform-lower"
          onClick={toLowercase}
          disabled={!text}
          className="px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 disabled:opacity-50 disabled:pointer-events-none rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
        >
          <ArrowUpDown className="w-3.5 h-3.5" /> lowercase
        </button>
        <button
          id="text-transform-title"
          onClick={toTitleCase}
          disabled={!text}
          className="px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 disabled:opacity-50 disabled:pointer-events-none rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
        >
          <ArrowUpDown className="w-3.5 h-3.5" /> Title Case
        </button>
        <button
          id="text-transform-sentence"
          onClick={toSentenceCase}
          disabled={!text}
          className="px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 disabled:opacity-50 disabled:pointer-events-none rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
        >
          <ArrowUpDown className="w-3.5 h-3.5" /> Sentence case
        </button>
        <button
          id="text-transform-slug"
          onClick={toSlugify}
          disabled={!text}
          className="px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 disabled:opacity-50 disabled:pointer-events-none rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
        >
          <ArrowUpDown className="w-3.5 h-3.5" /> slugify-text
        </button>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-white border border-stone-200 rounded-xl text-center">
          <span className="block text-2xl font-mono font-bold text-stone-800">{charCount}</span>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">Characters</span>
        </div>
        <div className="p-3 bg-white border border-stone-200 rounded-xl text-center">
          <span className="block text-2xl font-mono font-bold text-stone-800">{wordCount}</span>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">Words</span>
        </div>
        <div className="p-3 bg-white border border-stone-200 rounded-xl text-center">
          <span className="block text-2xl font-mono font-bold text-stone-800">{sentenceCount}</span>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">Sentences</span>
        </div>
        <div className="p-3 bg-white border border-stone-200 rounded-xl text-center">
          <span className="block text-2xl font-mono font-bold text-stone-800">{paragraphCount}</span>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">Paragraphs</span>
        </div>

        <div className="p-3 bg-white border border-stone-200 rounded-xl text-center col-span-2">
          <span className="block text-xl font-mono font-bold text-stone-800">{charNoSpaces}</span>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">Chars (No Spaces)</span>
        </div>
        <div className="p-3 bg-stone-50 border border-[#7A9A60]/20 rounded-xl text-center col-span-2">
          <div className="flex justify-around items-center h-full">
            <div>
              <span className="block text-sm font-semibold text-stone-700">~{readingTimeMinutes} {readingTimeMinutes === 1 ? "min" : "mins"}</span>
              <span className="text-[9px] uppercase tracking-wider font-medium text-stone-500">Reading Time</span>
            </div>
            <div className="w-px h-8 bg-stone-200" />
            <div>
              <span className="block text-sm font-semibold text-stone-700">~{teaSipsEstimated} {teaSipsEstimated === 1 ? "sip" : "sips"}</span>
              <span className="text-[9px] uppercase tracking-wider font-medium text-stone-500">Tea Sips Finished</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
