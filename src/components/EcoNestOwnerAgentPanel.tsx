import { useEffect, useRef, useState } from "react";

export const EcoNestOwnerAgentPanel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Load ChatKit script first
    const loadScript = () => {
      return new Promise<void>((resolve, reject) => {
        if ((window as any).ChatKit) {
          resolve();
          return;
        }

        const existing = document.querySelector<HTMLScriptElement>(
          'script[data-econest-chatkit]'
        );
        
        if (existing) {
          existing.addEventListener("load", () => resolve());
          return;
        }

        const script = document.createElement("script");
        script.src = "https://chat.openai.com/chatkit.js";
        script.async = true;
        script.dataset.econestChatkit = "true";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load ChatKit script"));
        document.body.appendChild(script);
      });
    };

    async function init() {
      try {
        await loadScript();
      } catch (e) {
        if (!cancelled) {
          setError("ChatKit failed to load.");
        }
        return;
      }

      // Wait for ChatKit to be available
      for (let i = 0; i < 20; i++) {
        if ((window as any).ChatKit) break;
        await new Promise(r => setTimeout(r, 250));
      }

      if (cancelled) return;

      if (!(window as any).ChatKit) {
        setError("ChatKit failed to load.");
        return;
      }

      const ChatKit = (window as any).ChatKit;

      try {
        ChatKit.mount({
          element: containerRef.current,
          sessionEndpoint: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chatkit-session`,
          title: "EcoNest Owner Assistant",
          instructions: "You are the private EcoNest owner assistant.",
        });
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setError("Failed to mount EcoNest Agent.");
        }
      }
    }

    init();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="mt-10 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-slate-50 shadow-sm">
      <h2 className="mb-1 text-lg font-semibold">
        EcoNest Agent (Owner Assistant)
      </h2>
      <p className="mb-3 text-xs text-slate-300">
        Ask natural-language questions about your leads, templates, and recent
        automation activity.
      </p>

      {error && (
        <div className="mb-3 rounded-md bg-red-900/40 px-3 py-2 text-xs text-red-100">
          {error}
        </div>
      )}

      <div
        ref={containerRef}
        className="relative h-[480px] w-full rounded-xl border border-slate-800 bg-slate-950/80"
      />
    </section>
  );
};
