import React, { useState } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";

const CHATKIT_SESSION_ENDPOINT = "https://rqldulvkwzvrmcvwttep.supabase.co/functions/v1/chatkit-session";

export function EcoNestOwnerAgentChat() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const { control } = useChatKit({
    api: {
      async getClientSecret(existing) {
        setIsConnecting(true);
        setConnectionError(null);
        
        try {
          const res = await fetch(CHATKIT_SESSION_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({}),
          });

          if (!res.ok) {
            console.error("Failed to get ChatKit client_secret", res.status);
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
      },
    },
  });

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
