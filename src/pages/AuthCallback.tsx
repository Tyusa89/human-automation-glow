import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase will parse tokens from URL automatically
    supabase.auth.getSession().then(() => {
      navigate("/", { replace: true });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-white/70">Signing you in…</div>
    </div>
  );
}