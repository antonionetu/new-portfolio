"use client";

import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";

interface MenuItem {
  label: string;
  shortcut?: string;
  action: () => void;
  divider?: boolean;
}

interface ShareOption {
  label: string;
  icon: string;
  action: () => void;
}

export default function ContextMenu() {
  const [visible, setVisible] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const { locale } = useI18n();
  const t = getTranslations(locale);

  const close = useCallback(() => {
    setVisible(false);
    setShareOpen(false);
    setCopied(false);
  }, []);

  useEffect(() => {
    const onContext = (e: MouseEvent) => {
      e.preventDefault();
      const x = Math.min(e.clientX, window.innerWidth - 220);
      const y = Math.min(e.clientY, window.innerHeight - 320);
      setPos({ x, y });
      setVisible(true);
      setShareOpen(false);
      setCopied(false);
    };

    window.addEventListener("contextmenu", onContext);
    window.addEventListener("click", close);
    window.addEventListener("scroll", close, true);

    return () => {
      window.removeEventListener("contextmenu", onContext);
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [close]);

  if (!visible) return null;

  const cm = (t as any).contextMenu || {};
  const url = typeof location !== "undefined" ? location.href : "";
  const title = typeof document !== "undefined" ? document.title : "";

  const shareOptions: ShareOption[] = [
    {
      label: "WhatsApp",
      icon: "\uf232",
      action: () =>
        window.open(
          `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
          "_blank"
        ),
    },
    {
      label: "LinkedIn",
      icon: "\uf0e1",
      action: () =>
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank"
        ),
    },
    {
      label: "X (Twitter)",
      icon: "\ue61b",
      action: () =>
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          "_blank"
        ),
    },
    {
      label: "Email",
      icon: "\uf0e0",
      action: () =>
        window.open(
          `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
        ),
    },
    {
      label: cm.copyLink || "Copy link",
      icon: "\uf0c1",
      action: () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
    },
  ];

  const items: MenuItem[] = [
    {
      label: cm.back || "Back",
      shortcut: "Alt+\u2190",
      action: () => history.back(),
    },
    {
      label: cm.forward || "Forward",
      shortcut: "Alt+\u2192",
      action: () => history.forward(),
    },
    {
      label: cm.reload || "Reload",
      shortcut: "Ctrl+R",
      action: () => location.reload(),
      divider: true,
    },
    {
      label: cm.copy || "Copy",
      shortcut: "Ctrl+C",
      action: () => document.execCommand("copy"),
    },
    {
      label: cm.selectAll || "Select all",
      shortcut: "Ctrl+A",
      action: () => document.execCommand("selectAll"),
      divider: true,
    },
    {
      label: cm.share || "Share",
      action: () => setShareOpen(true),
    },
  ];

  return (
    <div
      className="fixed z-[1000] animate-[fadeIn_0.15s_ease-out]"
      style={{ left: pos.x, top: pos.y }}
      onClick={(e) => e.stopPropagation()}
    >
      {!shareOpen ? (
        <div className="min-w-[200px] py-1.5 rounded-xl border border-brand-lime/30 bg-brand-card/95 backdrop-blur-xl shadow-2xl shadow-black/40">
          {items.map((item) => (
            <div key={item.label}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.label === (cm.share || "Share")) {
                    item.action();
                  } else {
                    item.action();
                    close();
                  }
                }}
                className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-brand-muted hover:text-brand-lime hover:bg-brand-lime/10 transition-colors duration-150 cursor-pointer"
              >
                <span>{item.label}</span>
                {item.shortcut && (
                  <span className="text-xs font-mono text-brand-muted/50 ml-6">
                    {item.shortcut}
                  </span>
                )}
                {item.label === (cm.share || "Share") && (
                  <svg
                    className="w-3 h-3 text-brand-muted/50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </button>
              {item.divider && (
                <div className="my-1 mx-3 h-px bg-brand-border/50" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="min-w-[240px] rounded-xl border border-brand-lime/30 bg-brand-card/95 backdrop-blur-xl shadow-2xl shadow-black/40 animate-[fadeIn_0.12s_ease-out]">
          {/* Header */}
          <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-brand-lime/20">
            <button
              onClick={() => setShareOpen(false)}
              className="text-brand-muted hover:text-white transition-colors duration-150"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="text-sm font-medium text-brand-lime">
              {cm.share || "Share"}
            </span>
          </div>

          {/* Share options */}
          <div className="py-1.5">
            {shareOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={(e) => {
                  e.stopPropagation();
                  opt.action();
                  if (!opt.label.includes(cm.copyLink || "Copy link")) {
                    close();
                  }
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-brand-muted hover:text-brand-lime hover:bg-brand-lime/10 transition-colors duration-150 cursor-pointer"
              >
                <span className="w-8 h-8 rounded-lg bg-brand-border/50 flex items-center justify-center text-xs shrink-0">
                  {opt.label === "WhatsApp" && (
                    <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  )}
                  {opt.label === "LinkedIn" && (
                    <svg className="w-4 h-4 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  )}
                  {opt.label === "X (Twitter)" && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  )}
                  {opt.label === "Email" && (
                    <svg className="w-4 h-4 text-brand-purple" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  )}
                  {opt.label === (cm.copyLink || "Copy link") && (
                    <svg className="w-4 h-4 text-brand-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      {copied ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      )}
                    </svg>
                  )}
                </span>
                <span>
                  {opt.label === (cm.copyLink || "Copy link") && copied
                    ? cm.copied || "Copied!"
                    : opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
