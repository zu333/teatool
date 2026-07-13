import React, { useState } from "react";
import { RefreshCw, Copy, Check, Upload, ArrowRight, FileText } from "lucide-react";

export default function Base64Converter() {
  const [activeTab, setActiveTab] = useState<"encode" | "decode">("encode");
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");

  const handleEncode = (val: string) => {
    setInputText(val);
    setError("");
    if (!val) {
      setOutputText("");
      return;
    }
    try {
      const encoded = btoa(unescape(encodeURIComponent(val)));
      setOutputText(encoded);
    } catch (e) {
      setError("Encoding failed. Text contains unsupported characters.");
    }
  };

  const handleDecode = (val: string) => {
    setInputText(val);
    setError("");
    if (!val) {
      setOutputText("");
      return;
    }
    try {
      const cleaned = val.trim().replace(/^data:image\/[a-z]+;base64,/, "");
      const decoded = decodeURIComponent(escape(atob(cleaned)));
      setOutputText(decoded);
    } catch (e) {
      setError("Invalid Base64 string. Please verify formatting.");
      setOutputText("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setOutputText(reader.result);
        setInputText(`[File: ${file.name} - ${Math.round(file.size / 1024)} KB]`);
      }
    };
    reader.onerror = () => {
      setError("Failed to read file.");
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    const nextTab = activeTab === "encode" ? "decode" : "encode";
    setActiveTab(nextTab);
    setInputText(outputText);
    setFileName("");
    if (nextTab === "encode") {
      handleEncode(outputText);
    } else {
      handleDecode(outputText);
    }
  };

  const isImageBase64 = activeTab === "decode" && inputText.trim().match(/^data:image\/(png|jpg|jpeg|gif|webp|svg\+xml);base64,/);
  const isDecodedImage = activeTab === "encode" && outputText.startsWith("data:image/");

  return (
    <div id="base64-converter-tool" className="p-6 bg-[#fcfbf9] rounded-2xl border border-stone-200 shadow-sm max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-stone-800 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-[#556B2F]" />
          Base64 Encoder & Decoder
        </h3>

        {/* Tab selector */}
        <div className="flex bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs">
          <button
            id="base64-tab-encode"
            onClick={() => {
              setActiveTab("encode");
              setInputText("");
              setOutputText("");
              setFileName("");
              setError("");
            }}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === "encode" ? "bg-white text-stone-800 shadow-xs" : "text-stone-500 hover:text-stone-800"
            }`}
          >
            Encode
          </button>
          <button
            id="base64-tab-decode"
            onClick={() => {
              setActiveTab("decode");
              setInputText("");
              setOutputText("");
              setFileName("");
              setError("");
            }}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === "decode" ? "bg-white text-stone-800 shadow-xs" : "text-stone-500 hover:text-stone-800"
            }`}
          >
            Decode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
        {/* Input area */}
        <div className="md:col-span-5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
            {activeTab === "encode" ? "Raw Input Text" : "Base64 String"}
          </label>
          <textarea
            id="base64-input"
            rows={5}
            className="w-full p-3 text-xs font-mono bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A9A60]/40 focus:border-[#7A9A60] text-stone-800 placeholder-stone-400"
            placeholder={
              activeTab === "encode"
                ? "Enter regular text to encode..."
                : "Paste base64 string here..."
            }
            value={inputText}
            onChange={(e) => {
              setFileName("");
              if (activeTab === "encode") handleEncode(e.target.value);
              else handleDecode(e.target.value);
            }}
          />

          {activeTab === "encode" && (
            <div className="mt-2">
              <label
                htmlFor="file-upload-input"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 hover:border-[#7A9A60] hover:bg-stone-50 text-stone-700 hover:text-[#556B2F] rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                {fileName ? "Change File" : "Convert File / Image"}
              </label>
              <input
                id="file-upload-input"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
              {fileName && <span className="text-[11px] text-stone-500 ml-2 font-mono">{fileName}</span>}
            </div>
          )}
        </div>

        {/* Swap / Action button */}
        <div className="md:col-span-1 flex justify-center">
          <button
            id="base64-swap-btn"
            onClick={handleSwap}
            className="p-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl hover:rotate-180 transition-all duration-300 text-stone-500 hover:text-stone-800"
            title="Swap input and output"
          >
            <ArrowRight className="w-4 h-4 max-md:rotate-90" />
          </button>
        </div>

        {/* Output area */}
        <div className="md:col-span-5">
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400">
              {activeTab === "encode" ? "Base64 Output" : "Plain Text Output"}
            </label>
            {outputText && (
              <button
                id="base64-copy-btn"
                onClick={handleCopy}
                className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Output
              </button>
            )}
          </div>

          <textarea
            id="base64-output"
            rows={5}
            readOnly
            className="w-full p-3 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl focus:outline-none text-stone-700"
            placeholder="Result will appear here..."
            value={outputText}
          />
        </div>
      </div>

      {/* Error displays */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
          {error}
        </div>
      )}

      {/* Dynamic base64 image previewer! */}
      {(isImageBase64 || isDecodedImage) && (
        <div className="mt-4 p-4 bg-white border border-stone-200 rounded-xl text-center">
          <span className="block text-[11px] uppercase tracking-wider font-semibold text-stone-400 mb-2">Image Preview</span>
          <img
            src={isImageBase64 ? inputText : outputText}
            alt="Base64 Preview"
            referrerPolicy="no-referrer"
            className="max-h-48 max-w-full rounded-lg mx-auto object-contain border border-stone-100"
          />
        </div>
      )}
    </div>
  );
}
