"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const storageKey = "portfolio-theme";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    function sync() {
      let saved: string | null = null;
      try { saved = localStorage.getItem(storageKey); } catch {}
      const next = saved === "dark" || (saved !== "light" && media.matches);
      document.documentElement.dataset.theme = next ? "dark" : "light";
      setDark(next);
    }
    sync();
    media.addEventListener("change", sync);
    window.addEventListener("storage", sync);
    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  function toggle() {
    const next = document.documentElement.dataset.theme !== "dark";
    document.documentElement.dataset.theme = next ? "dark" : "light";
    setDark(next);
    try { localStorage.setItem(storageKey, next ? "dark" : "light"); } catch {}
  }

  return <button type="button" className="theme-toggle" onClick={toggle}
    aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    title={dark ? "Switch to light mode" : "Switch to dark mode"}>
    <Sun className="theme-sun" size={17} aria-hidden="true" />
    <Moon className="theme-moon" size={17} aria-hidden="true" />
  </button>;
}
