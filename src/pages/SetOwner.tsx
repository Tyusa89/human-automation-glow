import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function SetOwner() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSetOwner = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setMessage("You must be signed in");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          is_owner: true,
        })
        .eq("user_id", user.id);

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage("✅ You are now set as an owner! Refresh the sidebar to see changes.");
      }
    } catch (err) {
      setMessage(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100 p-8">
      <div className="max-w-md mx-auto mt-20">
        <h1 className="text-2xl font-bold mb-6">Set Owner Status</h1>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-4">
          <p className="text-slate-300 mb-4">
            This will set your current user account as an owner in the database.
          </p>
          
          <button
            onClick={handleSetOwner}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-lg transition"
          >
            {loading ? "Setting..." : "Set Me as Owner"}
          </button>
        </div>
        
        {message && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-sm">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}