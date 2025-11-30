import React, { useState, useCallback, useMemo } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { supabase } from "@/integrations/supabase/client";

const CHATKIT_SESSION_ENDPOINT =
  import.meta.env.VITE_CHATKIT_SESSION_ENDPOINT || "https://rqldulvkwzvrmcvwttep.supabase.co/functions/v1/chatkit-session";

export function EcoNestOwnerAgentChat() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const getClientSecret = useCallback(async (existing?: string) => {
    setIsConnecting(true);
    setConnectionError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const accessToken = session?.access_token;
      if (!accessToken) {
        throw new Error("You must be signed in to use the EcoNest Agent.");
      }

      const res = await fetch(CHATKIT_SESSION_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to get ChatKit client_secret", res.status, text);
        throw new Error("Unable to create EcoNest agent session");
      }

      const data = await res.json();
      setIsConnecting(false);
      return data.client_secret;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setConnectionError(errorMsg);
      setIsConnecting(false);
      throw err;
    }
  }, []);

  const chatKitConfig = useMemo(
    () => ({
      api: { getClientSecret },
    }),
    [getClientSecret]
  );

  const { control } = useChatKit(chatKitConfig);

  if (isConnecting) {
    return (
      <div className="rounded-xl bg-muted/60 text-foreground px-4 py-3 text-sm">
        Connecting to your EcoNest Agent…
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="rounded-xl bg-destructive/10 text-destructive px-4 py-3 text-sm">
        Couldn't connect to the EcoNest Agent: {connectionError}
      </div>
    );
  }

  return (
    <div className="h-[520px] rounded-2xl border border-border bg-background/60 shadow-lg">
      <ChatKit control={control} className="h-full w-full" />
    </div>
  );
}

export default EcoNestOwnerAgentChat;
