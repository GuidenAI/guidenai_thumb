import React from "react";

export type LogoOption = 
  | "guidenai-dark"
  | "guidenai-light" 
  | "guidenai-colored"
  | "broxi-dark"
  | "broxi-light"
  | "broxi-colored";

export const logoOptions: { value: LogoOption; label: string }[] = [
  { value: "guidenai-dark", label: "GuidenAI Dark" },
  { value: "guidenai-light", label: "GuidenAI Light" },
  { value: "guidenai-colored", label: "GuidenAI Colored" },
  { value: "broxi-dark", label: "Broxi Dark" },
  { value: "broxi-light", label: "Broxi Light" },
  { value: "broxi-colored", label: "Broxi Colored" },
];

// Cache for base64 encoded logos (server-side only)
let logoCache: Map<LogoOption, string> | null = null;

const getLogoAsBase64 = (logo: LogoOption): string => {
  // Only use cache on server-side
  if (typeof window === 'undefined' && logoCache) {
    if (logoCache.has(logo)) {
      return logoCache.get(logo)!;
    }
  }

  const logoMap: Record<LogoOption, string> = {
    "guidenai-dark": "public/assets/guidenai-dark.svg",
    "guidenai-light": "public/assets/guidenai-light.svg", 
    "guidenai-colored": "public/assets/guidenai-colored.svg",
    "broxi-dark": "public/assets/broxi-dark.svg",
    "broxi-light": "public/assets/broxi-light.svg",
    "broxi-colored": "public/assets/broxi-colored.svg",
  };

  // Only try to read files on server-side
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = logoMap[logo];
      const svgContent = fs.readFileSync(filePath, 'utf8');
      const base64 = Buffer.from(svgContent).toString('base64');
      const dataUrl = `data:image/svg+xml;base64,${base64}`;
      
      // Initialize cache if needed
      if (!logoCache) {
        logoCache = new Map();
      }
      logoCache.set(logo, dataUrl);
      return dataUrl;
    } catch (error) {
      console.error(`Failed to load logo ${logo}:`, error);
    }
  }
  
  // Fallback to web URL
  return `/assets/${logo}.svg`;
};

export const getLogoPath = (logo: LogoOption, isServerSide = false): string => {
  if (isServerSide && typeof process !== 'undefined') {
    // For server-side rendering (Satori), use base64 data URLs
    return getLogoAsBase64(logo);
  } else {
    // For client-side rendering, use web URLs
    const logoMap: Record<LogoOption, string> = {
      "guidenai-dark": "/assets/guidenai-dark.svg",
      "guidenai-light": "/assets/guidenai-light.svg", 
      "guidenai-colored": "/assets/guidenai-colored.svg",
      "broxi-dark": "/assets/broxi-dark.svg",
      "broxi-light": "/assets/broxi-light.svg",
      "broxi-colored": "/assets/broxi-colored.svg",
    };
    return logoMap[logo];
  }
};

export const CustomLogo: React.FC<{
  logo: LogoOption;
  theme?: "light" | "dark";
  style?: React.CSSProperties;
  isServerSide?: boolean;
}> = ({ logo, theme = "dark", style, isServerSide = false, ...props }) => {
  const logoSrc = getLogoPath(logo, isServerSide);

  return (
    <img
      src={logoSrc}
      alt={`${logo} logo`}
      width={96}
      height={96}
      style={{ width: 96, height: 96, ...style }}
      {...props}
    />
  );
};
