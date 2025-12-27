import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ActivationState = "idle" | "activating" | "success" | "error";

type ActivationResult = 
  | { ok: true; slug: string }
  | { ok: false; error: Error };

interface UseTemplateActivationOptions {
  onSuccess?: (slug: string) => void;
  onError?: (error: Error) => void;
}

export function useTemplateActivation(options: UseTemplateActivationOptions = {}) {
  const navigate = useNavigate();
  const [state, setState] = useState<ActivationState>("idle");
  const [error, setError] = useState<string | null>(null);

  const activate = useCallback(async (slug: string): Promise<ActivationResult> => {
    setState("activating");
    setError(null);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return { ok: false, error: new Error("Not authenticated") };
      }

      // Use RPC to atomically activate (deactivates others first)
      const { error: rpcError } = await supabase.rpc("activate_template", {
        p_user_id: user.id,
        p_template_slug: slug,
      });

      if (rpcError) {
        throw new Error(rpcError.message);
      }

      setState("success");
      toast.success("Activated — ready when you are.");

      // Call success callback
      options.onSuccess?.(slug);

      return { ok: true, slug };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to activate template";
      console.error("Template activation error:", err);
      setError(message);
      setState("error");
      toast.error(message);
      const error = err instanceof Error ? err : new Error(message);
      options.onError?.(error);
      return { ok: false, error };
    }
  }, [navigate, options]);

  const reset = useCallback(() => {
    setState("idle");
    setError(null);
  }, []);

  return {
    activate,
    reset,
    state,
    error,
    isActivating: state === "activating",
    isSuccess: state === "success",
    isError: state === "error",
  };
}
