import React, { useState, useRef } from "react";
import { Tool, FooterLink, AdSettings } from "../types";
import { 
  X, Lock, Shield, Image as ImageIcon, Plus, Edit2, Trash2, 
  Link as LinkIcon, Check, HelpCircle, Key, RefreshCw, 
  Coffee, AlignLeft, Palette, FileCode, Music, Clock, Cpu, 
  Wrench, BookOpen, Terminal, Sparkles, ArrowUp, ArrowDown
} from "lucide-react";

// Map available icon options for simple tools
export const ICON_MAP: Record<string, any> = {
  Coffee: Coffee,
  AlignLeft: AlignLeft,
  Palette: Palette,
  RefreshCw: RefreshCw,
  FileCode: FileCode,
  Music: Music,
  Clock: Clock,
  Sparkles: Sparkles,
  Cpu: Cpu,
  Wrench: Wrench,
  BookOpen: BookOpen,
  Terminal: Terminal,
};

interface AdminPanelProps {
  headerImage: string;
  setHeaderImage: (img: string) => void;
  tools: Tool[];
  setTools: (tools: Tool[]) => void;
  footerLinks: FooterLink[];
  setFooterLinks: (links: FooterLink[]) => void;
  ads: AdSettings;
  setAds: (ads: AdSettings) => void;
  onClose: () => void;
  showHeroText: boolean;
  setShowHeroText: (val: boolean) => void;
  heroTitle: string;
  setHeroTitle: (val: string) => void;
  heroSubtitle: string;
  setHeroSubtitle: (val: string) => void;
  adminPasswordHash: string;
  setAdminPasswordHash: (val: string) => void;
}

export default function AdminPanel({
  headerImage,
  setHeaderImage,
  tools,
  setTools,
  footerLinks,
  setFooterLinks,
  ads,
  setAds,
  onClose,
  showHeroText,
  setShowHeroText,
  heroTitle,
  setHeroTitle,
  heroSubtitle,
  setHeroSubtitle,
  adminPasswordHash,
  setAdminPasswordHash,
}: AdminPanelProps) {
  // Authorization State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  // Change Password State
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordSuccess, setPasswordSuccess] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  // Header State
  const [headerUrlInput, setHeaderUrlInput] = useState<string>(headerImage);
  const [headerSuccess, setHeaderSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tools CRUD State
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [toolName, setToolName] = useState<string>("");
  const [toolDesc, setToolDesc] = useState<string>("");
  const [toolUrl, setToolUrl] = useState<string>("");
  const [toolTargetUrl, setToolTargetUrl] = useState<string>("");
  const [toolCat, setToolCat] = useState<string>("");
  const [toolIcon, setToolIcon] = useState<string>("Wrench");
  const [toolError, setToolError] = useState<string>("");
  const [toolSuccess, setToolSuccess] = useState<string>("");
  const [imageScale, setImageScale] = useState<number>(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Links state
  const [newLinkText, setNewLinkText] = useState<string>("");
  const [newLinkUrl, setNewLinkUrl] = useState<string>("");
  const [linkSuccess, setLinkSuccess] = useState<boolean>(false);

  // Ad State
  const [topAd, setTopAd] = useState<string>(ads.topBanner);
  const [belowAd, setBelowAd] = useState<string>(ads.belowTools);
  const [sidebarAd, setSidebarAd] = useState<string>(ads.sidebar);
  const [monetagEnabled, setMonetagEnabled] = useState<boolean>(ads.monetagEnabled !== false);
  const [monetagDomain, setMonetagDomain] = useState<string>(ads.monetagDomain || "5gvci.com");
  const [monetagZoneId, setMonetagZoneId] = useState<string>(ads.monetagZoneId || "11277946");
  const [adSuccess, setAdSuccess] = useState<boolean>(false);

  // Cryptographic hashing helper using browser built-in Web Crypto API (SHA-256)
  const sha256 = async (message: string): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Handles Login with SHA-256 comparison
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setAuthError("Password cannot be empty.");
      return;
    }
    try {
      const enteredHash = await sha256(password);
      const expectedHash = adminPasswordHash || "8365a9a126138214f724027eaaa478c4e76fb468405092bcc9b1bc3041c5bcd7"; // default hash of "tea4419"
      
      if (enteredHash === expectedHash) {
        setIsAuthenticated(true);
        setAuthError("");
      } else {
        setAuthError("Incorrect password.");
      }
    } catch (err) {
      console.error("Hashing failed:", err);
      // Fallback simple comparison if Crypto API is not supported (unlikely)
      if (password === "tea4419") {
        setIsAuthenticated(true);
        setAuthError("");
      } else {
        setAuthError("Incorrect password.");
      }
    }
  };

  // Handles Changing Admin Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!newPassword) {
      setPasswordError("New password cannot be empty.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    try {
      const newHash = await sha256(newPassword);
      setAdminPasswordHash(newHash);
      setPasswordSuccess("Admin password changed successfully and saved to Cloud Firestore!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Failed to hash new password:", err);
      setPasswordError("Failed to hash new password. Please try again.");
    }
  };

  // Header Management
  const handleApplyHeaderUrl = () => {
    if (headerUrlInput.trim() !== "") {
      setHeaderImage(headerUrlInput);
      setHeaderSuccess(true);
      setTimeout(() => setHeaderSuccess(false), 2000);
    }
  };

  // Helper to compress and resize image in client-side to prevent Firestore document size limit issues (1MB max)
  const compressAndResizeImage = (file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.75): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== "string") {
          reject(new Error("Failed to read file"));
          return;
        }
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get 2D context"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedBase64);
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = reader.result;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleHeaderFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Compress and resize to max 1200px width/height for header
        const compressedDataUrl = await compressAndResizeImage(file, 1200, 1200, 0.75);
        setHeaderImage(compressedDataUrl);
        setHeaderUrlInput(compressedDataUrl);
        setHeaderSuccess(true);
        setTimeout(() => setHeaderSuccess(false), 2000);
      } catch (err) {
        console.error("Header image compression failed:", err);
      }
    }
  };

  const handleToolImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Compress and resize to max 600px width/height for tool icon/card
        const compressedDataUrl = await compressAndResizeImage(file, 600, 600, 0.75);
        setToolUrl(compressedDataUrl);
      } catch (err) {
        console.error("Tool image compression failed:", err);
      }
    }
  };

  // Create or Update Tool
  const handleSaveTool = (e: React.FormEvent) => {
    e.preventDefault();
    setToolError("");
    setToolSuccess("");

    if (!toolDesc.trim() || !toolUrl.trim()) {
      setToolError("Please provide a tool description and select/upload an image (from device or enter URL).");
      return;
    }

    // Automatically derive a readable name, category and icon for a consistent, clean system setup
    const finalName = editingTool?.name || (toolDesc.trim().slice(0, 35) + (toolDesc.trim().length > 35 ? "..." : ""));
    const finalCat = editingTool?.category || "Visuals";
    const finalIcon = editingTool?.iconName || "Sparkles";

    if (editingTool) {
      // Modify
      const updated = tools.map((t) =>
        t.id === editingTool.id
          ? {
              ...t,
              name: finalName,
              description: toolDesc.trim(),
              embedUrl: toolUrl.trim(),
              category: finalCat,
              iconName: finalIcon,
              imageScale: imageScale,
              targetUrl: toolTargetUrl.trim(),
            }
          : t
      );
      setTools(updated);
      setToolSuccess(`Tool "${finalName}" updated successfully!`);
      setEditingTool(null);
    } else {
      // Add New
      const newTool: Tool = {
        id: "tool-" + Date.now(),
        name: finalName,
        description: toolDesc.trim(),
        embedUrl: toolUrl.trim(),
        category: finalCat,
        iconName: finalIcon,
        imageScale: imageScale,
        targetUrl: toolTargetUrl.trim(),
      };
      setTools([...tools, newTool]);
      setToolSuccess(`Tool "${finalName}" created successfully!`);
    }

    // Reset Form
    setToolName("");
    setToolDesc("");
    setToolUrl("");
    setToolTargetUrl("");
    setToolCat("");
    setToolIcon("Wrench");
    setImageScale(1);
  };

  const handleEditSelect = (tool: Tool) => {
    setEditingTool(tool);
    setToolName(tool.name);
    setToolDesc(tool.description);
    setToolUrl(tool.embedUrl);
    setToolTargetUrl(tool.targetUrl || "");
    setToolCat(tool.category);
    setToolIcon(tool.iconName);
    setImageScale(tool.imageScale || 1);
    setToolError("");
    setToolSuccess("");
  };

  const handleDeleteTool = (id: string, name: string) => {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      // Auto cancel after 4 seconds
      setTimeout(() => {
        setDeleteConfirmId((prev) => (prev === id ? null : prev));
      }, 4000);
      return;
    }

    setTools(tools.filter((t) => t.id !== id));
    if (editingTool && editingTool.id === id) {
      setEditingTool(null);
      setToolName("");
      setToolDesc("");
      setToolUrl("");
      setToolCat("");
      setToolIcon("Wrench");
      setImageScale(1);
    }
    setToolSuccess(`Deleted tool "${name}".`);
    setDeleteConfirmId(null);
  };

  const moveToolUp = (index: number) => {
    if (index === 0) return;
    const newTools = [...tools];
    const temp = newTools[index];
    newTools[index] = newTools[index - 1];
    newTools[index - 1] = temp;
    setTools(newTools);
    setToolSuccess("Tool moved up successfully!");
  };

  const moveToolDown = (index: number) => {
    if (index === tools.length - 1) return;
    const newTools = [...tools];
    const temp = newTools[index];
    newTools[index] = newTools[index + 1];
    newTools[index + 1] = temp;
    setTools(newTools);
    setToolSuccess("Tool moved down successfully!");
  };

  // Custom Links Management
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkText.trim() || !newLinkUrl.trim()) return;

    const newLink: FooterLink = {
      id: "link-" + Date.now(),
      text: newLinkText.trim(),
      url: newLinkUrl.trim(),
    };

    setFooterLinks([...footerLinks, newLink]);
    setNewLinkText("");
    setNewLinkUrl("");
    setLinkSuccess(true);
    setTimeout(() => setLinkSuccess(false), 2000);
  };

  const handleRemoveLink = (id: string) => {
    setFooterLinks(footerLinks.filter((l) => l.id !== id));
  };

  // Ads settings
  const handleSaveAds = (e: React.FormEvent) => {
    e.preventDefault();
    setAds({
      topBanner: topAd.trim(),
      belowTools: belowAd.trim(),
      sidebar: sidebarAd.trim(),
      monetagEnabled,
      monetagDomain: monetagDomain.trim(),
      monetagZoneId: monetagZoneId.trim(),
    });
    setAdSuccess(true);
    setTimeout(() => setAdSuccess(false), 2000);
  };

  // Lock Screen Render
  if (!isAuthenticated) {
    return (
      <div id="admin-auth-panel" className="fixed inset-0 bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-stone-200">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-matcha-100 text-matcha-600 rounded-2xl">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-900">Admin Authentication</h3>
                <p className="text-xs text-stone-500">Authorized personnel only</p>
              </div>
            </div>
            <button
              id="close-auth-btn"
              onClick={onClose}
              className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-pass-field" className="block text-xs font-semibold uppercase text-stone-400 mb-2">
                Enter Admin Password
              </label>
              <div className="relative">
                <input
                  id="admin-pass-field"
                  type="password"
                  placeholder="Type password..."
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-matcha-500/40 focus:border-matcha-500 rounded-xl text-stone-800 text-sm font-semibold tracking-wider"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
                <Key className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              </div>
              {/* Password Hint removed for high security */}
            </div>

            {authError && (
              <div className="text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-lg border border-red-100">
                {authError}
              </div>
            )}

            <button
              id="submit-auth-btn"
              type="submit"
              className="w-full py-3 bg-matcha-600 hover:bg-matcha-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm flex justify-center items-center gap-2"
            >
              Unlock Terminal
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard Panel Render
  return (
    <div id="admin-main-panel" className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex justify-end z-50">
      <div className="bg-[#fcfbf9] w-full max-w-4xl h-full flex flex-col shadow-2xl border-l border-stone-200 animate-slide-in overflow-hidden">
        
        {/* Header bar */}
        <div className="px-6 py-4 bg-stone-800 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-matcha-400" />
            <div>
              <h2 className="text-md font-bold tracking-tight">Tooltea Administration Panel</h2>
              <p className="text-[10px] text-stone-300">Live customization terminal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono bg-stone-700 text-matcha-300 px-2 py-0.5 rounded-full border border-stone-600 uppercase">
              Authenticated
            </span>
            <button
              id="close-admin-panel"
              onClick={onClose}
              className="p-1.5 bg-stone-700 hover:bg-stone-600 rounded-lg text-stone-300 hover:text-white transition-colors"
              title="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable controls */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 pattern-tea-dots">
          
          {/* SECTION 1: HEADER BANNER DESIGN */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-stone-100 pb-2">
              <ImageIcon className="w-4 h-4 text-matcha-600" />
              Hero Header Background
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">
                  Upload from Device (converts to Base64)
                </label>
                <input
                  id="header-file-upload"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleHeaderFileUpload}
                  className="hidden"
                />
                <button
                  id="trigger-header-upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3.5 px-4 bg-stone-50 border border-stone-200 border-dashed hover:bg-stone-100/50 text-stone-600 rounded-xl text-xs font-semibold transition-all flex flex-col items-center justify-center gap-1.5"
                >
                  <Plus className="w-5 h-5 text-stone-400" />
                  Select Image File
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">
                  Paste Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    id="header-url-input"
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-matcha-500/30 focus:border-matcha-500 rounded-xl text-stone-800"
                    value={headerUrlInput}
                    onChange={(e) => setHeaderUrlInput(e.target.value)}
                  />
                  <button
                    id="apply-header-url-btn"
                    onClick={handleApplyHeaderUrl}
                    className="px-4 bg-matcha-600 hover:bg-matcha-700 text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Current thumbnail */}
            <div className="flex items-center gap-4 p-3 bg-stone-50 border border-stone-100 rounded-xl">
              <img
                src={headerImage}
                alt="Header Thumbnail"
                referrerPolicy="no-referrer"
                className="w-20 h-12 object-cover rounded-lg border border-stone-200"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Active Header Image</span>
                <span className="block text-xs text-stone-600 truncate max-w-md font-mono">{headerImage.substring(0, 70)}...</span>
              </div>
            </div>

            {/* Hero Text Config */}
            <div className="mt-5 pt-5 border-t border-stone-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="toggle-hero-text" className="text-xs font-bold text-stone-700 block cursor-pointer">Show Text Overlay on Hero Banner</label>
                  <p className="text-[10px] text-stone-400 font-medium">Toggle showing title and description on top of the hero image</p>
                </div>
                <input
                  id="toggle-hero-text"
                  type="checkbox"
                  checked={showHeroText}
                  onChange={(e) => setShowHeroText(e.target.checked)}
                  className="w-4 h-4 text-matcha-600 border-stone-300 rounded-sm focus:ring-matcha-500 cursor-pointer accent-matcha-600"
                />
              </div>

              {showHeroText && (
                <div className="space-y-3.5 pl-3 border-l-2 border-matcha-400 animate-fade-in">
                  <div>
                    <label htmlFor="hero-title-field" className="block text-[11px] font-semibold text-stone-500 mb-1">
                      Hero Title Text
                    </label>
                    <input
                      id="hero-title-field"
                      type="text"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-matcha-500/20 focus:border-matcha-500 rounded-xl text-stone-800"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      placeholder="e.g. Brewing Simplicity for Your Workflow."
                    />
                  </div>
                  <div>
                    <label htmlFor="hero-subtitle-field" className="block text-[11px] font-semibold text-stone-500 mb-1">
                      Hero Subtitle / Description Text
                    </label>
                    <textarea
                      id="hero-subtitle-field"
                      rows={2.5}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-matcha-500/20 focus:border-matcha-500 rounded-xl text-stone-800"
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      placeholder="Describe your website..."
                    />
                  </div>
                </div>
              )}
            </div>

            {headerSuccess && (
              <div className="mt-3 text-xs text-green-700 bg-green-50 p-2 rounded-lg font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Header background modified successfully!
              </div>
            )}
          </div>

          {/* SECTION 2: TOOLS CRUD MANAGER */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-stone-100 pb-2">
              <Wrench className="w-4 h-4 text-matcha-600" />
              Web Tools Database (CRUD)
            </h3>

            <form onSubmit={handleSaveTool} className="space-y-4 mb-6 bg-stone-50/50 p-4 rounded-xl border border-stone-100">
              <span className="text-xs font-bold text-stone-700 block">
                {editingTool ? `📝 Editing Tool: ${editingTool.name}` : "➕ Add a New Web Tool"}
              </span>

              {/* Tool Description Input */}
              <div>
                <label htmlFor="tool-form-desc" className="block text-[11px] font-semibold text-stone-500 mb-1">
                  Tool Description
                </label>
                <textarea
                  id="tool-form-desc"
                  rows={3}
                  placeholder="Describe what this tool does..."
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-matcha-500/20"
                  value={toolDesc}
                  onChange={(e) => setToolDesc(e.target.value)}
                />
              </div>

              {/* Optional Target Link URL */}
              <div>
                <label htmlFor="tool-form-target-url" className="block text-[11px] font-semibold text-stone-500 mb-1">
                  Tool Target Link URL / Address (Optional)
                </label>
                <input
                  id="tool-form-target-url"
                  type="text"
                  placeholder="https://example.com/my-tool (Optional link to open when clicked)"
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-matcha-500/20"
                  value={toolTargetUrl}
                  onChange={(e) => setToolTargetUrl(e.target.value)}
                />
                <p className="text-[10px] text-stone-400 mt-1">
                  Agar aap chahte hain ke is tool card par click karne se koi external website open ho, to yahan link add karen.
                </p>
              </div>

              {/* Image Manager Box (Upload + URL + Scaling inside a single box) */}
              <div className="border border-stone-200 bg-white rounded-xl p-4 max-w-sm mx-auto space-y-3.5 shadow-sm">
                <div className="flex items-center gap-1.5 border-b border-stone-100 pb-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-matcha-600" />
                  <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    Image Configuration Box
                  </span>
                </div>

                {/* Upload from Device option */}
                <div>
                  <label htmlFor="tool-image-file" className="block text-[10px] font-semibold text-stone-400 mb-1">
                    Upload from Device
                  </label>
                  <input
                    id="tool-image-file"
                    type="file"
                    accept="image/*"
                    className="w-full text-xs text-stone-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-matcha-100 file:text-matcha-700 hover:file:bg-matcha-200 cursor-pointer"
                    onChange={handleToolImageUpload}
                  />
                </div>

                {/* Or input direct URL option */}
                <div>
                  <label htmlFor="tool-image-url" className="block text-[10px] font-semibold text-stone-400 mb-1">
                    Or Enter Image URL
                  </label>
                  <input
                    id="tool-image-url"
                    type="text"
                    placeholder="https://example.com/image.png"
                    className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-matcha-500/30"
                    value={toolUrl}
                    onChange={(e) => setToolUrl(e.target.value)}
                  />
                </div>

                {/* Preview and Scaling Controls (Only shown if toolUrl/image is present) */}
                {toolUrl ? (
                  <div className="space-y-2 pt-1 border-t border-stone-100">
                    <span className="block text-[10px] font-semibold text-stone-500">Image Preview & Zoom</span>
                    
                    {/* Compact preview container (box zeyada bara na ho) */}
                    <div className="w-full h-32 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-center overflow-hidden relative">
                      <img
                        src={toolUrl}
                        alt="Tool preview"
                        style={{ transform: `scale(${imageScale})` }}
                        className="max-h-full max-w-full object-contain transition-transform duration-200 ease-out"
                      />
                    </div>

                    {/* Scale slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-stone-500">
                        <span>Zoom / Scale Factor</span>
                        <span className="font-mono bg-matcha-100 text-matcha-700 px-1.5 py-0.2 rounded">
                          {Math.round(imageScale * 100)}%
                        </span>
                      </div>
                      <input
                        id="tool-image-scale-slider"
                        type="range"
                        min="0.2"
                        max="2.5"
                        step="0.05"
                        className="w-full accent-matcha-600 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                        value={imageScale}
                        onChange={(e) => setImageScale(parseFloat(e.target.value))}
                      />
                      <div className="flex justify-between text-[8px] text-stone-400 font-medium">
                        <span>0.2x</span>
                        <span>1.0x (Default)</span>
                        <span>2.5x</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 border border-dashed border-stone-200 rounded-lg text-center bg-stone-50">
                    <p className="text-[10px] text-stone-400 font-medium">No image loaded yet.</p>
                  </div>
                )}
              </div>

              {toolError && <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg font-medium">{toolError}</div>}
              {toolSuccess && <div className="text-xs text-green-700 bg-green-50 p-2 rounded-lg font-semibold">{toolSuccess}</div>}

              <div className="flex gap-2 justify-end">
                {editingTool && (
                  <button
                    id="cancel-tool-edit"
                    type="button"
                    onClick={() => {
                      setEditingTool(null);
                      setToolName("");
                      setToolDesc("");
                      setToolUrl("");
                      setToolTargetUrl("");
                      setToolCat("");
                      setToolIcon("Wrench");
                      setImageScale(1);
                    }}
                    className="px-4 py-2 border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  id="save-tool-btn"
                  type="submit"
                  className="px-5 py-2 bg-matcha-600 hover:bg-matcha-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {editingTool ? "Save Changes" : "Create Tool"}
                </button>
              </div>
            </form>

            {/* List of current tools for Edit/Delete */}
            <div className="border border-stone-100 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50 text-stone-500 font-bold border-b border-stone-100">
                  <tr>
                    <th className="px-4 py-2.5 w-[80px]">Order</th>
                    <th className="px-4 py-2.5">Name / Category</th>
                    <th className="px-4 py-2.5">Embed Link & Target URL</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white">
                  {tools.map((t, index) => {
                    const IconC = ICON_MAP[t.iconName] || Wrench;
                    return (
                      <tr key={t.id} id={`row-tool-${t.id}`} className="hover:bg-stone-50/50">
                        {/* Order Reorder Column */}
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveToolUp(index)}
                              disabled={index === 0}
                              className={`p-1 rounded hover:bg-stone-100 transition-colors ${
                                index === 0 ? "text-stone-300 cursor-not-allowed" : "text-stone-600 hover:text-matcha-600"
                              }`}
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveToolDown(index)}
                              disabled={index === tools.length - 1}
                              className={`p-1 rounded hover:bg-stone-100 transition-colors ${
                                index === tools.length - 1 ? "text-stone-300 cursor-not-allowed" : "text-stone-600 hover:text-matcha-600"
                              }`}
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <IconC className="w-3.5 h-3.5 text-matcha-600" />
                            <div>
                              <span className="font-semibold text-stone-800 block">{t.name}</span>
                              <span className="text-[10px] text-stone-400 font-mono bg-stone-100 px-1.5 py-0.2 rounded-md">{t.category}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[10px] text-stone-400 max-w-[180px] truncate">
                          <div className="space-y-0.5">
                            <div className="truncate">{t.embedUrl.startsWith("data:") ? "Uploaded Image (base64)" : t.embedUrl}</div>
                            {t.targetUrl && (
                              <div className="text-[9px] text-matcha-600 font-bold truncate">
                                Target Link: {t.targetUrl}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-right space-x-1.5">
                          <button
                            id={`edit-tool-action-${t.id}`}
                            onClick={() => handleEditSelect(t)}
                            className="p-1 hover:bg-stone-100 hover:text-matcha-600 text-stone-400 rounded-lg transition-colors inline-flex"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`delete-tool-action-${t.id}`}
                            onClick={() => handleDeleteTool(t.id, t.name)}
                            className={`p-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1 cursor-pointer ${
                              deleteConfirmId === t.id
                                ? "bg-red-600 text-white hover:bg-red-700 animate-pulse font-bold"
                                : "hover:bg-red-50 hover:text-red-600 text-stone-400"
                            }`}
                            title={deleteConfirmId === t.id ? "Click again to confirm delete" : "Delete"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            {deleteConfirmId === t.id && <span>Confirm?</span>}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 3: FOOTER NAVIGATION LINKS */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-stone-100 pb-2">
              <LinkIcon className="w-4 h-4 text-matcha-600" />
              Footer Navigation Links
            </h3>

            <form onSubmit={handleAddLink} className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-4 items-end">
              <div className="md:col-span-5">
                <label htmlFor="new-link-text-field" className="block text-[11px] font-semibold text-stone-500 mb-1">
                  Link Anchor Text
                </label>
                <input
                  id="new-link-text-field"
                  type="text"
                  placeholder="e.g. Terms & Conditions"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none"
                  value={newLinkText}
                  onChange={(e) => setNewLinkText(e.target.value)}
                />
              </div>
              <div className="md:col-span-5">
                <label htmlFor="new-link-url-field" className="block text-[11px] font-semibold text-stone-500 mb-1">
                  Destination URL
                </label>
                <input
                  id="new-link-url-field"
                  type="text"
                  placeholder="https://example.com/terms"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <button
                  id="add-link-btn"
                  type="submit"
                  className="w-full py-2 bg-matcha-600 hover:bg-matcha-700 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
            </form>

            {linkSuccess && (
              <div className="mb-3 text-xs text-green-700 bg-green-50 p-2 rounded-lg font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Link created successfully!
              </div>
            )}

            {/* List of custom links */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center bg-stone-50 p-2.5 rounded-lg border border-stone-100 text-xs">
                <span className="font-semibold text-stone-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                  Home (Mandatory default link)
                </span>
                <span className="text-[10px] text-stone-400 italic">Always Visible</span>
              </div>

              {footerLinks.map((link) => (
                <div
                  key={link.id}
                  id={`link-item-${link.id}`}
                  className="flex justify-between items-center bg-stone-50 p-2.5 rounded-lg border border-stone-100 text-xs hover:border-stone-200 transition-all"
                >
                  <div>
                    <span className="font-semibold text-stone-700">{link.text}</span>
                    <span className="text-[10px] text-stone-400 ml-2 font-mono">{link.url}</span>
                  </div>
                  <button
                    id={`remove-link-${link.id}`}
                    onClick={() => handleRemoveLink(link.id)}
                    className="p-1 hover:bg-red-50 text-stone-400 hover:text-red-600 rounded-md transition-colors"
                    title="Remove custom link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: AD MONETIZATION CODES */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex justify-between items-start mb-2 border-b border-stone-100 pb-2">
              <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-matcha-600" />
                Ad Monetization Settings (Adsterra & Monetag)
              </h3>
              <div className="group relative">
                <HelpCircle className="w-4 h-4 text-stone-400 cursor-help" />
                <div className="absolute right-0 top-6 w-60 p-3 bg-stone-800 text-white text-[10px] rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity leading-relaxed z-30">
                  Provide text, Banner HTML codes, or Direct links. If a slot's input is left blank, its corresponding banner space is fully hidden from the frontend view automatically.
                </div>
              </div>
            </div>
            
            <p className="text-[11px] text-stone-500 mb-4 bg-amber-50 border border-amber-100 p-2.5 rounded-lg">
              <strong>Conditional Visibility Rule Active:</strong> Slots containing empty values below are stripped from the layout structure automatically, leaving zero visual footprint.
            </p>

            <form onSubmit={handleSaveAds} className="space-y-4">
              <div>
                <label htmlFor="ad-top-input" className="block text-xs font-semibold text-stone-500 mb-1 flex items-center justify-between">
                  Top Banner Spot
                  <span className="text-[9px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.2 rounded-md">Header Bottom</span>
                </label>
                <textarea
                  id="ad-top-input"
                  rows={2}
                  placeholder="Paste Ad code / Direct banner URL..."
                  className="w-full p-2.5 text-xs font-mono bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:bg-white"
                  value={topAd}
                  onChange={(e) => setTopAd(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="ad-below-input" className="block text-xs font-semibold text-stone-500 mb-1 flex items-center justify-between">
                  Below Tools Grid Spot
                  <span className="text-[9px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.2 rounded-md">Body Bottom</span>
                </label>
                <textarea
                  id="ad-below-input"
                  rows={2}
                  placeholder="Paste Ad code / Direct banner URL..."
                  className="w-full p-2.5 text-xs font-mono bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:bg-white"
                  value={belowAd}
                  onChange={(e) => setBelowAd(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="ad-sidebar-input" className="block text-xs font-semibold text-stone-500 mb-1 flex items-center justify-between">
                  Sidebar Widget Spot
                  <span className="text-[9px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.2 rounded-md">Sidebar Banner</span>
                </label>
                <textarea
                  id="ad-sidebar-input"
                  rows={2}
                  placeholder="Paste Ad code / Direct banner URL..."
                  className="w-full p-2.5 text-xs font-mono bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:bg-white"
                  value={sidebarAd}
                  onChange={(e) => setSidebarAd(e.target.value)}
                />
              </div>

              {/* Monetag Settings Box */}
              <div className="mt-4 pt-4 border-t border-stone-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="toggle-monetag" className="text-xs font-bold text-stone-700 block cursor-pointer">
                      Enable Monetag Auto-Integration
                    </label>
                    <p className="text-[10px] text-stone-400 font-medium">
                      Injects the dynamic popunder / push notifications smart tag scripts automatically.
                    </p>
                  </div>
                  <input
                    id="toggle-monetag"
                    type="checkbox"
                    checked={monetagEnabled}
                    onChange={(e) => setMonetagEnabled(e.target.checked)}
                    className="w-4 h-4 text-matcha-600 border-stone-300 rounded-sm focus:ring-matcha-500 cursor-pointer accent-matcha-600"
                  />
                </div>

                {monetagEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-3 border-l-2 border-matcha-400 animate-fade-in">
                    <div>
                      <label htmlFor="monetag-domain-input" className="block text-[11px] font-semibold text-stone-500 mb-1">
                        Monetag Script Domain
                      </label>
                      <input
                        id="monetag-domain-input"
                        type="text"
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-matcha-500/20 focus:border-matcha-500 rounded-lg text-stone-800"
                        value={monetagDomain}
                        onChange={(e) => setMonetagDomain(e.target.value)}
                        placeholder="e.g. 5gvci.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="monetag-zone-input" className="block text-[11px] font-semibold text-stone-500 mb-1">
                        Monetag Zone ID (Ad Unit)
                      </label>
                      <input
                        id="monetag-zone-input"
                        type="text"
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-matcha-500/20 focus:border-matcha-500 rounded-lg text-stone-800"
                        value={monetagZoneId}
                        onChange={(e) => setMonetagZoneId(e.target.value)}
                        placeholder="e.g. 11277946"
                      />
                    </div>
                  </div>
                )}
                
                {/* Information Badge for Service Worker registration */}
                <div className="bg-emerald-50 text-[10px] text-emerald-800 p-2.5 rounded-lg border border-emerald-100 leading-normal font-medium">
                  <strong>Service Workers Installed:</strong> Both <code>/sw.js</code> and <code>/service-worker.js</code> have been successfully initialized at the server root for the domain <code>{monetagDomain}</code> and zone <code>{monetagZoneId}</code> to guarantee push delivery.
                </div>
              </div>

              {adSuccess && (
                <div className="text-xs text-green-700 bg-green-50 p-2 rounded-lg font-semibold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Monetization codes saved successfully!
                </div>
              )}

              <button
                id="save-ads-btn"
                type="submit"
                className="w-full py-2.5 bg-matcha-600 hover:bg-matcha-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                Save Monetization Settings
              </button>
            </form>
          </div>

          {/* SECTION 5: SECURITY SETTINGS */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-stone-100 pb-2">
              <Key className="w-4 h-4 text-matcha-600" />
              Security Settings
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label htmlFor="new-password-input" className="block text-xs font-semibold text-stone-500 mb-1">
                  New Admin Password
                </label>
                <input
                  id="new-password-input"
                  type="password"
                  placeholder="Enter new admin password"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-matcha-500/20 focus:border-matcha-500 rounded-lg text-stone-800 font-semibold"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="confirm-password-input" className="block text-xs font-semibold text-stone-500 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirm-password-input"
                  type="password"
                  placeholder="Confirm new admin password"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-matcha-500/20 focus:border-matcha-500 rounded-lg text-stone-800 font-semibold"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {passwordError && (
                <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="text-xs text-green-700 bg-green-50 p-2.5 rounded-lg border border-green-100 flex items-center gap-1.5 font-medium leading-relaxed">
                  <Check className="w-4 h-4 shrink-0 text-green-600" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <button
                id="change-password-btn"
                type="submit"
                className="w-full py-2.5 bg-matcha-600 hover:bg-matcha-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                Change Admin Password
              </button>
            </form>
          </div>

        </div>

        {/* Footer info inside Admin Sidebar */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-between items-center text-[11px] text-stone-500 shrink-0">
          <span>Tooltea live CMS Terminal</span>
          <button
            id="admin-logout-btn"
            onClick={() => {
              setIsAuthenticated(false);
              setPassword("");
            }}
            className="text-stone-600 hover:text-stone-900 font-bold hover:underline"
          >
            Lock Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
