export interface Tool {
  id: string;
  name: string;
  description: string;
  embedUrl: string; // "builtin:..." or external URL
  category: string;
  iconName: string; // name of lucide icon
  imageScale?: number;
}

export interface FooterLink {
  id: string;
  text: string;
  url: string;
}

export interface AdSettings {
  topBanner: string; // Banner link or HTML script
  belowTools: string;
  sidebar: string;
}

export interface AppState {
  headerImage: string;
  tools: Tool[];
  footerLinks: FooterLink[];
  ads: AdSettings;
}
