import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Coffee, Info, Volume2, VolumeX } from "lucide-react";

interface TeaPreset {
  name: string;
  time: number; // in seconds
  temp: string;
  description: string;
  color: string; // Tailwind bg-class
  borderColor: string;
}

const TEA_PRESETS: TeaPreset[] = [
  {
    name: "Matcha",
    time: 60,
    temp: "80°C / 176°F",
    description: "Whisk vigorously in a W-pattern with a bamboo whisk until a rich, creamy froth forms.",
    color: "bg-[#7A9A60]",
    borderColor: "border-[#7A9A60]",
  },
  {
    name: "Sencha",
    time: 120,
    temp: "70°C / 158°F",
    description: "Infuse gently in a clay pot. Pour out to the last drop to ensure the flavor is fully served.",
    color: "bg-[#556B2F]",
    borderColor: "border-[#556B2F]",
  },
  {
    name: "Oolong",
    time: 180,
    temp: "85°C / 185°F",
    description: "Allows leaves to unfurl. Can be steeped 3-5 times, developing richer tones with each infusion.",
    color: "bg-[#D2B48C]",
    borderColor: "border-[#D2B48C]",
  },
  {
    name: "Black Tea",
    time: 240,
    temp: "95°C / 203°F",
    description: "Robust and full-bodied. Steep with freshly boiled water and serve hot or with a splash of milk.",
    color: "bg-[#8B4513]",
    borderColor: "border-[#8B4513]",
  },
  {
    name: "Herbal / Chamomile",
    time: 300,
    temp: "100°C / 212°F",
    description: "Caffeine-free and soothing. Steep covered for a full 5 minutes to preserve sweet aromatic herbs.",
    color: "bg-[#E6C229]",
    borderColor: "border-[#E6C229]",
  },
];

export default function TeaTimer() {
  const [selectedTea, setSelectedTea] = useState<TeaPreset>(TEA_PRESETS[0]);
  const [timeLeft, setTimeLeft] = useState<number>(TEA_PRESETS[0].time);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeLeft(selectedTea.time);
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [selectedTea]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            playCompletionSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const playCompletionSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Simulate a relaxing bell/singing bowl sound
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc1.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 1.5);

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(220, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 1.5);

      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.8);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();

      osc1.stop(ctx.currentTime + 2.0);
      osc2.stop(ctx.currentTime + 2.0);
    } catch (e) {
      console.warn("Audio Context failed to initialize:", e);
    }
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedTea.time);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progressPercent = ((selectedTea.time - timeLeft) / selectedTea.time) * 100;

  return (
    <div id="tea-timer-tool" className="p-6 bg-[#fcfbf9] rounded-2xl border border-stone-200 shadow-sm max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-stone-800 flex items-center gap-2">
          <Coffee className="w-5 h-5 text-matcha-600" />
          Tea Steeping Timer & Guide
        </h3>
        <button
          id="toggle-sound-btn"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
          title={soundEnabled ? "Mute gong sound" : "Unmute gong sound"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Preset Selector */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
        {TEA_PRESETS.map((tea) => (
          <button
            key={tea.name}
            id={`tea-preset-${tea.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
            onClick={() => setSelectedTea(tea)}
            className={`px-3 py-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
              selectedTea.name === tea.name
                ? `${tea.borderColor} bg-white ring-2 ring-stone-200 shadow-sm text-stone-900`
                : "border-stone-200 bg-stone-50 text-stone-500 hover:bg-stone-100"
            }`}
          >
            <div className="flex items-center gap-1.5 font-semibold mb-0.5">
              <span className={`w-2.5 h-2.5 rounded-full ${tea.color}`} />
              {tea.name}
            </div>
            <div className="text-[10px] opacity-75">{formatTime(tea.time)} • {tea.temp}</div>
          </button>
        ))}
      </div>

      {/* Main Timer Circle / Indicator */}
      <div className="flex flex-col items-center justify-center py-6 border-b border-stone-100 mb-6">
        <div className="relative w-44 h-44 flex items-center justify-center rounded-full border-4 border-stone-100">
          {/* Animated Steam lines when running */}
          {isRunning && (
            <div className="absolute top-4 flex gap-1 justify-center w-full">
              <div className="w-1 h-4 bg-matcha-500/30 rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
              <div className="w-1 h-6 bg-matcha-600/40 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
              <div className="w-1 h-4 bg-matcha-500/30 rounded-full animate-pulse" style={{ animationDelay: "600ms" }} />
            </div>
          )}

          {/* SVG Progress Circle Accent */}
          <svg className="absolute -rotate-90 w-full h-full p-1" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              className="stroke-stone-100 fill-none"
              strokeWidth="4"
            />
            <circle
              cx="50"
              cy="50"
              r="46"
              className="fill-none transition-all duration-300"
              stroke={selectedTea.name === "Matcha" ? "#7A9A60" : selectedTea.name === "Sencha" ? "#556B2F" : selectedTea.name === "Oolong" ? "#D2B48C" : selectedTea.name === "Black Tea" ? "#8B4513" : "#E6C229"}
              strokeWidth="4"
              strokeDasharray="289"
              strokeDashoffset={289 - (289 * progressPercent) / 100}
              strokeLinecap="round"
            />
          </svg>

          {/* Countdown display */}
          <div className="text-center z-10">
            <span className="text-3xl font-mono font-bold tracking-tight text-stone-800">
              {formatTime(timeLeft)}
            </span>
            <p className="text-[11px] font-medium text-stone-500 mt-0.5">
              {timeLeft === 0 ? "Steep Complete!" : isRunning ? "Steeping..." : "Ready"}
            </p>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex gap-4 mt-6">
          <button
            id="tea-timer-reset-btn"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 border border-stone-200 text-stone-600 hover:text-stone-800 hover:bg-stone-50 rounded-xl text-sm font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            id="tea-timer-toggle-btn"
            onClick={handleStartPause}
            disabled={timeLeft === 0}
            className={`flex items-center gap-1.5 px-6 py-2 rounded-xl text-sm font-medium shadow-sm transition-all text-white ${
              timeLeft === 0
                ? "bg-stone-300 cursor-not-allowed"
                : isRunning
                ? "bg-stone-700 hover:bg-stone-800"
                : `${selectedTea.color} hover:opacity-90`
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Start Steep
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-stone-50 border border-stone-200/60 p-4 rounded-xl flex gap-3">
        <Info className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-stone-800 flex items-center gap-2">
            {selectedTea.name} Steeping Guide
            <span className="text-xs font-normal text-stone-500 bg-stone-200/50 px-2 py-0.5 rounded-full">
              {selectedTea.temp}
            </span>
          </h4>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
            {selectedTea.description}
          </p>
        </div>
      </div>
    </div>
  );
}
