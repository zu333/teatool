import React, { useEffect, useRef } from "react";

interface AdContainerProps {
  adValue: string;
  slotName: string; // topBanner, belowTools, sidebar
}

export default function AdContainer({ adValue, slotName }: AdContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // If empty, return null (fully hidden - display none / hidden)
  if (!adValue || adValue.trim() === "") {
    return null;
  }

  const isScript = adValue.includes("<script") || adValue.includes("javascript:");
  const isImageLink = adValue.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) || adValue.startsWith("data:image");

  useEffect(() => {
    if (isScript && containerRef.current) {
      // Clear container
      containerRef.current.innerHTML = "";

      // Parse the HTML script blocks and append them manually so they execute
      const parser = new DOMParser();
      const parsedDoc = parser.parseFromString(adValue, "text/html");
      const scripts = Array.from(parsedDoc.querySelectorAll("script"));

      // Copy any static HTML first
      const bodyChildren = Array.from(parsedDoc.body.childNodes);
      bodyChildren.forEach((child) => {
        if (child.nodeName !== "SCRIPT") {
          containerRef.current?.appendChild(child.cloneNode(true));
        }
      });

      // Append scripts manually to run them
      scripts.forEach((oldScript) => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        if (oldScript.innerHTML) {
          newScript.innerHTML = oldScript.innerHTML;
        }
        containerRef.current?.appendChild(newScript);
      });
    }
  }, [adValue, isScript]);

  // Determine standard layout styles based on slot
  let sizeClasses = "";
  if (slotName === "topBanner") {
    sizeClasses = "w-full max-w-4xl min-h-[90px] py-2";
  } else if (slotName === "belowTools") {
    sizeClasses = "w-full max-w-4xl min-h-[90px] py-4";
  } else if (slotName === "sidebar") {
    sizeClasses = "w-full md:w-64 min-h-[250px] py-2";
  }

  return (
    <div
      id={`ad-container-${slotName}`}
      className={`ad-slot-container flex flex-col items-center justify-center mx-auto text-center overflow-hidden rounded-xl bg-stone-100/60 border border-stone-200/50 p-2 text-stone-400 text-[10px] tracking-wider relative ${sizeClasses}`}
    >
      <div className="absolute top-1 right-2 pointer-events-none text-[8px] uppercase tracking-widest font-mono text-stone-400 font-bold">
        Sponsor advertisement
      </div>

      {isScript ? (
        // Mount script-based tags here
        <div ref={containerRef} className="w-full h-full flex items-center justify-center" />
      ) : isImageLink ? (
        // Direct image banner
        <a
          href={adValue}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full"
        >
          <img
            src={adValue}
            alt="Ad Banner"
            referrerPolicy="no-referrer"
            className="max-h-full mx-auto object-contain rounded-lg hover:opacity-95 transition-opacity"
          />
        </a>
      ) : (
        // Simple direct text/link fallback
        <div className="p-4 text-center">
          <p className="text-xs text-stone-600 font-semibold mb-2">Visit our sponsor</p>
          <a
            href={adValue}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-1.5 bg-[#556B2F] text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Launch Link
          </a>
          <span className="block text-[8px] font-mono text-stone-400 mt-2 truncate max-w-xs">{adValue}</span>
        </div>
      )}
    </div>
  );
}
