import React, { useState, useEffect } from "react";
import { Tool, FooterLink, AdSettings } from "./types";
import { 
  DEFAULT_HEADER_IMAGE, 
  DEFAULT_TOOLS, 
  DEFAULT_FOOTER_LINKS, 
  DEFAULT_ADS 
} from "./components/DefaultState";
import { ICON_MAP } from "./components/AdminPanel";
import AdminPanel from "./components/AdminPanel";
import ToolRenderer from "./components/ToolRenderer";
import AdContainer from "./components/AdContainer";
import { 
  Search, Shield, X, ChevronRight, Home, ExternalLink, 
  Wrench, Coffee, HelpCircle, ArrowRight, Sparkles 
} from "lucide-react";

export default function App() {
  // --- Persistent State Hooks ---
  const [headerImage, setHeaderImage] = useState<string>(() => {
    try {
      return localStorage.getItem("tooltea_header_image") || DEFAULT_HEADER_IMAGE;
    } catch {
      return DEFAULT_HEADER_IMAGE;
    }
  });

  const [tools, setTools] = useState<Tool[]>(() => {
    try {
      const saved = localStorage.getItem("tooltea_tools");
      return saved ? JSON.parse(saved) : DEFAULT_TOOLS;
    } catch {
      return DEFAULT_TOOLS;
    }
  });

  const [footerLinks, setFooterLinks] = useState<FooterLink[]>(() => {
    try {
      const saved = localStorage.getItem("tooltea_footer_links");
      return saved ? JSON.parse(saved) : DEFAULT_FOOTER_LINKS;
    } catch {
      return DEFAULT_FOOTER_LINKS;
    }
  });

  const [ads, setAds] = useState<AdSettings>(() => {
    try {
      const saved = localStorage.getItem("tooltea_ads");
      return saved ? JSON.parse(saved) : DEFAULT_ADS;
    } catch {
      return DEFAULT_ADS;
    }
  });

  const [showHeroText, setShowHeroText] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("tooltea_show_hero_text");
      return saved !== "false";
    } catch {
      return true;
    }
  });

  const [heroTitle, setHeroTitle] = useState<string>(() => {
    try {
      return localStorage.getItem("tooltea_hero_title") || "Brewing Simplicity for Your Workflow.";
    } catch {
      return "Brewing Simplicity for Your Workflow.";
    }
  });

  const [heroSubtitle, setHeroSubtitle] = useState<string>(() => {
    try {
      return localStorage.getItem("tooltea_hero_subtitle") || "Welcome to Tooltea, a serene sanctuary featuring essential, highly responsive web tools styled with calming, soft light-blue tones.";
    } catch {
      return "Welcome to Tooltea, a serene sanctuary featuring essential, highly responsive web tools styled with calming, soft light-blue tones.";
    }
  });

  // --- UI Control State ---
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // --- Write to LocalStorage on state changes ---
  useEffect(() => {
    try {
      localStorage.setItem("tooltea_header_image", headerImage);
    } catch (e) {
      console.warn("Could not save header_image to localStorage:", e);
    }
  }, [headerImage]);

  useEffect(() => {
    try {
      localStorage.setItem("tooltea_tools", JSON.stringify(tools));
    } catch (e) {
      console.warn("Could not save tools to localStorage:", e);
    }
  }, [tools]);

  useEffect(() => {
    try {
      localStorage.setItem("tooltea_footer_links", JSON.stringify(footerLinks));
    } catch (e) {
      console.warn("Could not save footer_links to localStorage:", e);
    }
  }, [footerLinks]);

  useEffect(() => {
    try {
      localStorage.setItem("tooltea_ads", JSON.stringify(ads));
    } catch (e) {
      console.warn("Could not save ads to localStorage:", e);
    }
  }, [ads]);

  useEffect(() => {
    try {
      localStorage.setItem("tooltea_show_hero_text", String(showHeroText));
    } catch (e) {
      console.warn("Could not save show_hero_text to localStorage:", e);
    }
  }, [showHeroText]);

  useEffect(() => {
    try {
      localStorage.setItem("tooltea_hero_title", heroTitle);
    } catch (e) {
      console.warn("Could not save hero_title to localStorage:", e);
    }
  }, [heroTitle]);

  useEffect(() => {
    try {
      localStorage.setItem("tooltea_hero_subtitle", heroSubtitle);
    } catch (e) {
      console.warn("Could not save hero_subtitle to localStorage:", e);
    }
  }, [heroSubtitle]);

  // --- Category collection logic ---
  const categories: string[] = ["All", ...Array.from(new Set<string>(tools.filter(t => t && t.category).map((t) => t.category)))];

  // --- Filter logic ---
  const filteredTools = tools.filter((tool) => {
    if (!tool) return false;
    const matchesSearch =
      (tool.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tool.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tool.category || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory =
      selectedCategory === "All" || tool.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleLaunchTool = (tool: Tool) => {
    setSelectedTool(tool);
    // Scroll to tool view on mobile or just bring focus
    setTimeout(() => {
      document.getElementById("active-tool-workspace")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleHomeClick = () => {
    setSelectedTool(null);
    setSelectedCategory("All");
    setSearchTerm("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#eef5fa] text-stone-900 font-sans flex flex-col relative selection:bg-matcha-300/40 selection:text-matcha-800">
      
      {/* 1. Header Hero Section */}
      <header
        id="hero-header-banner"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(28,25,23,0.45), rgba(41,37,36,0.85)), url("${headerImage}")` }}
        className="relative bg-cover bg-center h-[320px] md:h-[350px] flex flex-col justify-between p-6 md:p-12 text-white shadow-md transition-all duration-700 shrink-0"
      >
        {/* Navigation row */}
        <div className="flex justify-between items-center max-w-7xl w-full mx-auto">
          {/* Animated SVG Tea Cup Logo Pair */}
          <div id="app-logo" className="flex items-center gap-3.5 cursor-pointer group" onClick={handleHomeClick}>
            <div className="p-2 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/25 transition-all group-hover:scale-105 group-hover:bg-white/20 shadow-md">
              <svg className="w-14 h-14 select-none shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Rising Steam Lines */}
                <path d="M38 25 Q34 18, 38 10 Q42 5, 38 0" stroke="#6baef2" strokeWidth="2.5" strokeLinecap="round" className="animate-steam-1" />
                <path d="M50 25 Q54 18, 50 10 Q46 5, 50 0" stroke="#6baef2" strokeWidth="3" strokeLinecap="round" className="animate-steam-2" />
                <path d="M62 25 Q58 18, 62 10 Q66 5, 62 0" stroke="#6baef2" strokeWidth="2.5" strokeLinecap="round" className="animate-steam-3" />
                
                {/* Tea Cup Body */}
                <path d="M25 45 C25 68, 35 76, 50 76 C65 76, 75 68, 75 45 Z" fill="#2a6f97" />
                {/* Handle */}
                <path d="M75 50 C84 50, 84 64, 75 64" stroke="#2a6f97" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                {/* Saucer */}
                <path d="M18 82 L82 82" stroke="#6baef2" strokeWidth="4.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans text-stone-50 leading-none">
                Tool<span className="text-[#6baef2]">tea</span>
              </h1>
              <span className="text-[11px] uppercase tracking-widest text-[#a0ccf7] font-bold font-mono block mt-1">
                Aesthetic Tool Hub
              </span>
            </div>
          </div>

          <button
            id="nav-home-btn"
            onClick={handleHomeClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-xs border border-white/20 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all shadow-sm cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </button>
        </div>

        {/* Central Hero Body */}
        {showHeroText && (
          <div className="max-w-3xl w-full mx-auto text-center my-auto space-y-3 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-sm">
              {heroTitle}
            </h2>
            <p className="text-stone-200 text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed">
              {heroSubtitle}
            </p>
          </div>
        )}
      </header>

      {/* 2. Top Banner Ad Slot (Conditional Rendering) */}
      <AdContainer adValue={ads.topBanner} slotName="topBanner" />

      {/* 3. Main Workspace / Tools Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Dynamic Multi-column Layout depending on active tools / sidebar ads */}
        <div className="flex-1 space-y-8">
          
          {/* Active Launched Tool Workspace (Displays on top if loaded) */}
          {selectedTool && (
            <div id="active-tool-workspace" className="p-1 bg-matcha-200 rounded-3xl border border-stone-200/60 shadow-md animate-fade-in">
              <div className="px-6 py-4 flex justify-between items-center bg-white rounded-t-2xl border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-matcha-100 text-matcha-600 rounded-xl">
                    {React.createElement(ICON_MAP[selectedTool.iconName] || Wrench, { className: "w-5 h-5" })}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-950">{selectedTool.name}</h3>
                    <p className="text-xs text-stone-500 font-medium">{selectedTool.category} • Active</p>
                  </div>
                </div>
                <button
                  id="close-launched-tool"
                  onClick={() => setSelectedTool(null)}
                  className="p-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-500 hover:text-stone-800 transition-all flex items-center gap-1 text-xs font-semibold"
                >
                  <X className="w-4 h-4" />
                  Close Tool
                </button>
              </div>
              <div className="bg-white/80 p-4 md:p-6 rounded-b-2xl">
                <ToolRenderer tool={selectedTool} />
              </div>
            </div>
          )}

          {/* Grid Header & Filters */}
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/60 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-matcha-100 text-matcha-600 rounded-xl">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900">Brewed Tool Collection</h3>
                  <p className="text-xs text-stone-500 font-medium">Click any card to launch the tool instantly</p>
                </div>
              </div>

              {/* Search Bar & Categories combined cleanly */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search input field */}
                <div className="relative">
                  <input
                    id="workspace-search-input"
                    type="text"
                    placeholder="Search tools..."
                    className="pl-9 pr-8 py-2 bg-stone-50 focus:bg-white rounded-xl text-stone-800 placeholder-stone-400 font-semibold text-xs focus:outline-none border border-stone-200 focus:border-matcha-500 focus:ring-2 focus:ring-matcha-500/10 transition-all w-full sm:w-48"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                  {searchTerm && (
                    <button
                      id="clear-workspace-search-btn"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category selector */}
                <div className="flex flex-wrap gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/40 text-[11px] self-start sm:self-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      id={`filter-cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-white text-matcha-600 shadow-xs border border-stone-200/30 font-bold"
                          : "text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid of Available Tools */}
            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => {
                  const ToolIcon = ICON_MAP[tool.iconName] || Wrench;
                  const isActive = selectedTool?.id === tool.id;

                  return (
                    <div
                      key={tool.id}
                      id={`tool-card-${tool.id}`}
                      className={`group p-5 bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                        isActive
                          ? "border-matcha-600 ring-2 ring-matcha-500/20 shadow-md"
                          : "border-stone-200 hover:border-stone-300 hover:shadow-md hover:-translate-y-0.5"
                      }`}
                    >
                      {/* Card background tea leaf accent */}
                      <div className="absolute -right-6 -top-6 w-16 h-16 rounded-full bg-stone-50 group-hover:bg-matcha-50/50 transition-colors" />

                      <div className="space-y-3 z-10">
                        {/* Tag & Icon Row */}
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-matcha-600 bg-matcha-100 px-2.5 py-1 rounded-md">
                            {tool.category}
                          </span>
                          <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-matcha-600 text-white" : "bg-stone-50 text-stone-500 group-hover:bg-matcha-100 group-hover:text-matcha-600"}`}>
                            <ToolIcon className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h4 className="font-bold text-stone-950 text-sm tracking-tight group-hover:text-matcha-600 transition-colors">
                            {tool.name}
                          </h4>
                          <p className="text-xs text-stone-500 mt-1.5 leading-relaxed font-medium line-clamp-3">
                            {tool.description}
                          </p>
                        </div>
                      </div>

                      {/* Launch Button */}
                      <div className="pt-5 z-10">
                        <button
                          id={`launch-btn-${tool.id}`}
                          onClick={() => handleLaunchTool(tool)}
                          className={`w-full py-2 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 border ${
                            isActive
                              ? "bg-matcha-600 border-matcha-600 text-white"
                              : "bg-white border-stone-200 text-stone-700 hover:bg-matcha-100 hover:border-matcha-500/40 hover:text-matcha-600"
                          }`}
                        >
                          Launch Tool
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center bg-white border border-stone-200 rounded-3xl">
                <Coffee className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-stone-800">No Web Tools Found</h4>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  Try refining your search text or select a different category filter from the menu.
                </p>
                <button
                  id="reset-filter-btn"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                  className="mt-4 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* 4. Below Tools Ad Slot (Conditional Rendering) */}
          <AdContainer adValue={ads.belowTools} slotName="belowTools" />

        </div>

        {/* 5. Sidebar Layout - Adsterra Widget slot + Quick Tips */}
        {(ads.sidebar !== "" || tools.length > 0) && (
          <aside className="w-full md:w-80 shrink-0 space-y-6">
            
            {/* Conditional Sidebar Ad banner (Strict Rule: hidden if empty) */}
            <AdContainer adValue={ads.sidebar} slotName="sidebar" />

            {/* Aesthetic Matcha Teas Info Block */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-matcha-600 border-b border-stone-100 pb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                The Way of Tea
              </h4>
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <span className="block text-xs font-bold text-stone-800">Matcha Focus</span>
                  <p className="text-[11px] text-stone-500 leading-relaxed font-medium">
                    Unlike coffee's rapid spike and crash, Matcha contains L-Theanine, which promotes focused, calm concentration over hours. Perfect for deep sessions.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="block text-xs font-bold text-stone-800">Mindful Breaks</span>
                  <p className="text-[11px] text-stone-500 leading-relaxed font-medium">
                    Take 5-minute pauses between web tasks. Close your eyes, inhale the steam, and stretch. Re-oxygenating increases efficiency.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats Panel */}
            <div className="bg-matcha-100 p-5 rounded-2xl border border-stone-200/50 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-matcha-600 flex items-center gap-1.5">
                <Wrench className="w-4 h-4" /> System Stats
              </h4>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 bg-white rounded-xl border border-stone-200/40">
                  <span className="block text-lg font-bold font-mono text-stone-800">{tools.length}</span>
                  <span className="text-[9px] font-semibold text-stone-400 uppercase tracking-wider">Total Tools</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-stone-200/40">
                  <span className="block text-lg font-bold font-mono text-stone-800">
                    {tools.filter(t => t.embedUrl.startsWith("builtin:")).length}
                  </span>
                  <span className="text-[9px] font-semibold text-stone-400 uppercase tracking-wider">Built-In</span>
                </div>
              </div>
            </div>
          </aside>
        )}
      </main>

      {/* 6. Footer Section */}
      <footer className="mt-auto bg-stone-900 text-stone-400 text-xs border-t border-stone-800 shrink-0">
        <div className="max-w-7xl w-full mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Default/Home Navigation */}
          <div className="flex flex-wrap items-center gap-4 max-md:justify-center">
            <button
              id="footer-home-btn"
              onClick={handleHomeClick}
              className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded-xl transition-all font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </button>

            <button
              id="footer-admin-btn"
              onClick={() => setIsAdminOpen(true)}
              className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded-xl transition-all font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Panel
            </button>

            {/* Optional Custom Admin Links displayed dynamically */}
            {footerLinks.map((link) => (
              <a
                key={link.id}
                id={`footer-link-${link.id}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1.5 text-stone-400 hover:text-stone-200 hover:underline flex items-center gap-1 transition-all"
              >
                {link.text}
                <ExternalLink className="w-3 h-3 text-stone-500" />
              </a>
            ))}
          </div>

          {/* Copyright line */}
          <div className="text-center md:text-right font-medium">
            <p className="text-stone-300 font-semibold">Tooltea © {new Date().getFullYear()}</p>
            <p className="text-[10px] text-stone-500 mt-0.5">Soothing web utilities with local storage persistence</p>
          </div>
        </div>
      </footer>

      {/* 7. Modal/Drawer: Toggle Admin Panel (Password Locked) */}
      {isAdminOpen && (
        <AdminPanel
          headerImage={headerImage}
          setHeaderImage={setHeaderImage}
          tools={tools}
          setTools={setTools}
          footerLinks={footerLinks}
          setFooterLinks={setFooterLinks}
          ads={ads}
          setAds={setAds}
          onClose={() => setIsAdminOpen(false)}
          showHeroText={showHeroText}
          setShowHeroText={setShowHeroText}
          heroTitle={heroTitle}
          setHeroTitle={setHeroTitle}
          heroSubtitle={heroSubtitle}
          setHeroSubtitle={setHeroSubtitle}
        />
      )}
    </div>
  );
}
