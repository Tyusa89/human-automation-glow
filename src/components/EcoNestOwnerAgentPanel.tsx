import React, { useEffect, useRef, useState } from "react";

// Small helper so we don't blow up if ChatKit script isn't ready yet
declare global {
  interface Window {
    ChatKit?: {
      createChat: (options: {
        // URL of your Supabase edge function
        sessionEndpoint: string;
        // DOM element to mount into
        element: HTMLElement;
        // Optional: theme, title, etc.
        title?: string;
      }) => { destroy: () => void };
    };
  }
}

const CHATKIT_SESSION_URL =
  import.meta.env.VITE_CHATKIT_SESSION_URL ??
  "https://YOUR_SUPABASE_PROJECT_ID.supabase.co/functions/v1/chatkit-session";

export const EcoNestOwnerAgentPanel: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // 1) Load ChatKit script once
  useEffect(() => {
    if (window.ChatKit) {
      setReady(true);
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-econest-chatkit]'
    );
    if (existing) {
      existing.addEventListener("load", () => setReady(true));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://chat.openai.com/chatkit.js";
    script.async = true;
    script.dataset.econestChatkit = "true";
    script.onload = () => setReady(true);
    script.onerror = () =>
      setError("Couldn't load EcoNest Agent script. Check your network.");
    document.body.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, []);

  // 2) Once script is ready + we have a div, create the chat
  useEffect(() => {
    if (!ready || !containerRef.current || !window.ChatKit) return;
    if (!CHATKIT_SESSION_URL) {
      setError("Missing VITE_CHATKIT_SESSION_URL env.");
      return;
    }

    setError(null);

    const chat = window.ChatKit.createChat({
      sessionEndpoint: CHATKIT_SESSION_URL,
      element: containerRef.current,
      title: "EcoNest Agent (Owner Assistant)",
    });

    return () => {
      chat?.destroy?.();
    };
  }, [ready]);

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
        className="min-h-[320px] rounded-xl border border-slate-800 bg-slate-950/80"
      />
    </section>
  );
};
