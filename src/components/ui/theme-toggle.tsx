import { useEffect, useState } from "react";

const THEME_KEY = "theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === "dark" || stored === "light") return stored;
    } catch (e) {
      // ignore
    }
    // prefer system prefers-color-scheme
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    // Listen to system changes and only apply when user hasn't explicitly chosen
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      try {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored !== "dark" && stored !== "light") {
          setTheme(e.matches ? "dark" : "light");
        }
      } catch (err) {
        // ignore
      }
    };
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler as any);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler as any);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        aria-label="Toggle theme"
        onClick={() => setTheme(prev => (prev === "dark" ? "light" : "dark"))}
        className="inline-flex items-center gap-2 rounded-full px-3 py-2 bg-card text-card-foreground shadow-sm hover:shadow-glow transition-smooth"
      >
        {theme === "dark" ? (
          <span className="text-yellow-300">☀️</span>
        ) : (
          <span className="text-indigo-500">🌙</span>
        )}
        <span className="sr-only">Toggle theme</span>
      </button>
    </div>
  );
}
