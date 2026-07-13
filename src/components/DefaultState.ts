import { Tool, FooterLink, AdSettings } from "../types";

export const DEFAULT_HEADER_IMAGE = "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=1600";

export const DEFAULT_TOOLS: Tool[] = [
  {
    id: "tool-tea-timer",
    name: "Tea Steeping Timer & Guide",
    description: "Perfect steep timers for Matcha, Sencha, Oolong, Black, and Herbal infusions with integrated Web Audio gong notifications.",
    embedUrl: "builtin:tea-timer",
    category: "Tea Ritual",
    iconName: "Coffee",
  },
  {
    id: "tool-text-counter",
    name: "Text Case & Stat Counter",
    description: "Analyze characters, word counts, sentence structures, read-time estimations, and estimate total tea sips alongside fast case transformations.",
    embedUrl: "builtin:text-counter",
    category: "Writing",
    iconName: "AlignLeft",
  },
  {
    id: "tool-palette-generator",
    name: "Aesthetic Color Palette Generator",
    description: "Generate soothing color palettes featuring cozy tea blends (like Matcha Morning and Earl Grey Blue) with instant copy-to-clipboard codes.",
    embedUrl: "builtin:palette-generator",
    category: "Design",
    iconName: "Palette",
  },
  {
    id: "tool-base64-converter",
    name: "Base64 Encoder & Decoder",
    description: "Perform quick Base64 encoding and decoding for raw text data and generate instant Base64 data URLs for local image uploads.",
    embedUrl: "builtin:base64",
    category: "Developer",
    iconName: "RefreshCw",
  },
  {
    id: "tool-json-formatter",
    name: "JSON Formatter & Validator",
    description: "Format nested JSON structures with custom indentation levels, minify payloads, and inspect structural validation issues on the fly.",
    embedUrl: "builtin:json",
    category: "Developer",
    iconName: "FileCode",
  },
  {
    id: "tool-lofi-radio",
    name: "Lo-Fi Ambient Tea Radio",
    description: "Play relaxing ambient rhythms and low-fidelity beats. Perfect background acoustics for focused code, deep writing, or relaxing tea breaks.",
    embedUrl: "https://www.youtube.com/embed/jfKfPfyJRdk",
    category: "Focus",
    iconName: "Music",
  }
];

export const DEFAULT_FOOTER_LINKS: FooterLink[] = [
  {
    id: "link-about",
    text: "About Matcha culture",
    url: "https://en.wikipedia.org/wiki/Matcha",
  },
  {
    id: "link-ritual",
    text: "Ritual & Focus Guide",
    url: "https://en.wikipedia.org/wiki/Japanese_tea_ceremony",
  }
];

export const DEFAULT_ADS: AdSettings = {
  topBanner: "", // empty by default -> hidden
  belowTools: "", // empty by default -> hidden
  sidebar: "", // empty by default -> hidden
};
