import React, { useState } from "react";
import { Palette, Copy, Check, Sparkles } from "lucide-react";

interface PalettePreset {
  name: string;
  colors: string[];
  description: string;
}

const TEA_PALETTES: PalettePreset[] = [
  {
    name: "Matcha Morning",
    colors: ["#556B2F", "#7A9A60", "#A3C1AD", "#E2E8C0", "#F4F6EC"],
    description: "Soothing shades of grounded stone-ground tea and fresh spring leaves.",
  },
  {
    name: "Terracotta Evening",
    colors: ["#C87A53", "#D98E62", "#EAA882", "#EED9C4", "#FCF6F0"],
    description: "Earthy red clays blended with warm, sweet caramel milk.",
  },
  {
    name: "Chai Spice",
    colors: ["#8B5A2B", "#CD853F", "#D2B48C", "#F5DEB3", "#FAF4EA"],
    description: "Deep cloves, cardamom pods, and creamy milk froth accents.",
  },
  {
    name: "Earl Grey Lavender",
    colors: ["#3D5A6C", "#72899A", "#9CAFB7", "#C9D5D6", "#F2F5F6"],
    description: "Elegant citrus bergamot with a soft touch of purple lavender fields.",
  },
  {
    name: "Chamomile Breeze",
    colors: ["#E6C229", "#F2D462", "#F6E497", "#FAF0D7", "#FFFDF9"],
    description: "Bright golden chamomile buds combined with soft organic white honey.",
  },
];

export default function PaletteGenerator() {
  const [activePalette, setActivePalette] = useState<string[]>(TEA_PALETTES[0].colors);
  const [paletteName, setPaletteName] = useState<string>(TEA_PALETTES[0].name);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const handleCopyColor = (color: string, index: number) => {
    navigator.clipboard.writeText(color);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(activePalette.join(", "));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const generateRandomPalette = () => {
    const randomHex = () => {
      // Keep it in aesthetic pastel/warm tones
      const r = Math.floor(Math.random() * 80) + 150; // 150-230 (softer, lighter)
      const g = Math.floor(Math.random() * 80) + 150;
      const b = Math.floor(Math.random() * 80) + 150;
      return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase();
    };

    const newPalette = Array.from({ length: 5 }, () => randomHex());
    setActivePalette(newPalette);
    setPaletteName("Custom Blend");
  };

  return (
    <div id="palette-generator-tool" className="p-6 bg-[#fcfbf9] rounded-2xl border border-stone-200 shadow-sm max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-stone-800 flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#556B2F]" />
          Aesthetic Palette Generator
        </h3>
        <button
          id="random-palette-btn"
          onClick={generateRandomPalette}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:border-[#7A9A60] hover:bg-stone-50 rounded-lg shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#7A9A60]" />
          Randomize
        </button>
      </div>

      {/* Preset palettes selectors */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TEA_PALETTES.map((preset) => (
          <button
            key={preset.name}
            id={`palette-preset-${preset.name.toLowerCase().replace(/\s+/g, "-")}`}
            onClick={() => {
              setActivePalette(preset.colors);
              setPaletteName(preset.name);
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              paletteName === preset.name
                ? "bg-stone-800 border-stone-800 text-white"
                : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Active Palette Display */}
      <div className="grid grid-cols-5 gap-1.5 h-36 mb-6 rounded-2xl overflow-hidden shadow-sm border border-stone-100">
        {activePalette.map((color, idx) => (
          <button
            key={`${color}-${idx}`}
            id={`palette-color-${idx}`}
            onClick={() => handleCopyColor(color, idx)}
            style={{ backgroundColor: color }}
            className="group relative flex flex-col items-center justify-end pb-4 transition-all hover:flex-[1.4] focus:outline-none"
            title={`Copy ${color}`}
          >
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900/85 text-white text-[10px] py-1 px-1.5 rounded-md mb-2 flex items-center gap-1 shadow">
              {copiedIndex === idx ? (
                <>
                  <Check className="w-3 h-3 text-green-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  {color}
                </>
              )}
            </div>
            <span className="font-mono text-[10px] font-semibold text-stone-800 bg-white/80 backdrop-blur-xs py-0.5 px-1.5 rounded-md border border-stone-200/50">
              {color}
            </span>
          </button>
        ))}
      </div>

      {/* Info and Copy All */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-stone-50 border border-stone-200/60 rounded-xl">
        <div>
          <h4 className="text-sm font-semibold text-stone-800">{paletteName}</h4>
          <p className="text-xs text-stone-500 mt-0.5">
            {TEA_PALETTES.find((p) => p.name === paletteName)?.description || "A random, soothing customized blend of colors."}
          </p>
        </div>
        <button
          id="copy-all-palette-btn"
          onClick={handleCopyAll}
          className="shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-stone-200 hover:border-stone-300 text-stone-700 hover:text-stone-900 rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          {copiedAll ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              Copied All!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy All Hex
            </>
          )}
        </button>
      </div>
    </div>
  );
}
