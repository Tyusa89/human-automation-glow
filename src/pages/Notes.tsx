import * as React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/auth/AuthProvider";

type NoteRow = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
};

export default function Notes() {
  const nav = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [notes, setNotes] = React.useState<NoteRow[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");

  const loadNotes = React.useCallback(async () => {
    console.log("🔍 [Notes] Starting loadNotes...");
    setLoading(true);
    setError(null);

    if (!user) {
      console.log("❌ [Notes] No user found, skipping load");
      setNotes([]);
      setLoading(false);
      return;
    }

    console.log("👤 [Notes] User ID:", user.id);
    console.log("📡 [Notes] Fetching notes from database...");
    
    // Debug environment
    console.log("SUPABASE URL:", import.meta.env.VITE_SUPABASE_URL);
    console.log("Supabase client:", !!supabase);

    try {
      const { data, error, status } = await supabase
        .from("notes")
        .select("*")
        .order("updated_at", { ascending: false });

      console.log("✅/❌ [Notes] loadNotes result:", { status, error, dataCount: data?.length });

      if (error) setError(error.message);
      setNotes(data ?? []);
    } catch (e) {
      console.error("❌ [Notes] loadNotes exception:", e);
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [loadNotes, user]);

  const createNote = async () => {
    console.log("💾 [Notes] Starting createNote...");
    setSaving(true);
    setError(null);

    if (!user) {
      console.log("❌ [Notes] No user found for note creation");
      setSaving(false);
      setError("You must be signed in to create notes.");
      return;
    }

    const newTitle = title.trim() || "Untitled note";
    const newContent = content.trim();
    
    console.log("📝 [Notes] Creating note:", { title: newTitle, contentLength: newContent.length });
    console.log("👤 [Notes] User ID:", user.id);

    const noteData = {
      user_id: user.id,
      title: newTitle,
      content: newContent,
      is_pinned: false,
    };
    
    console.log("📡 [Notes] Inserting to database:", noteData);

    try {
      const { data, error, status } = await supabase
        .from("notes")
        .insert(noteData)
        .select()
        .single();

      console.log("✅/❌ [Notes] createNote result:", { status, error, data });

      if (error) {
        setError(error.message);
        return;
      }

      // success
      setTitle("");
      setContent("");
      await loadNotes();
    } catch (e) {
      console.error("❌ [Notes] createNote exception:", e);
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSaving(false);
    }

    setTitle("");
    setContent("");
    await loadNotes();
    setSaving(false);
  };

  const togglePin = async (note: NoteRow) => {
    setError(null);
    const { error } = await supabase
      .from("notes")
      .update({ is_pinned: !note.is_pinned })
      .eq("id", note.id);

    if (error) setError(error.message);
    else loadNotes();
  };

  const deleteNote = async (id: string) => {
    setError(null);
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) setError(error.message);
    else loadNotes();
  };

  const empty = !loading && notes.length === 0;

  return (
    <div className="min-h-screen bg-[#050A14] text-white">
      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Notes</h1>
            <p className="mt-1 text-sm text-white/60">
              Capture meeting notes, follow-ups, and ideas—EcoNest will keep everything organized.
            </p>
          </div>

          <button
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            onClick={() => nav("/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>

        {/* Create */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-4">
          <div className="grid gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional)"
              className="h-10 rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/20"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note..."
              className="min-h-[120px] resize-none rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/20"
            />

            <div className="flex items-center justify-between">
              <button
                onClick={createNote}
                disabled={saving}
                className="rounded-2xl bg-white/90 px-4 py-2 text-sm font-medium text-black hover:bg-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Create note"}
              </button>

              {error && <p className="text-sm text-red-400">{error}</p>}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="mt-6">
          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 text-sm text-white/60">
              Loading notes…
            </div>
          ) : empty ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-10 text-center">
              <div className="mx-auto mb-3 h-10 w-10 rounded-2xl border border-white/10 bg-white/5" />
              <h2 className="text-lg font-semibold text-white">No notes yet.</h2>
              <p className="mt-1 text-sm text-white/60">
                Create your first note above.
              </p>
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  className="text-sm underline underline-offset-4 text-white/80 hover:text-white"
                  onClick={() => nav("/")}
                >
                  Back to Home
                </button>
                <button
                  className="rounded-2xl bg-emerald-200/90 px-5 py-2 text-sm font-medium text-black hover:bg-emerald-200"
                  onClick={() => nav("/dashboard")}
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              {notes.map((n) => (
                <div
                  key={n.id}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {n.is_pinned && (
                          <span className="rounded-full bg-yellow-300/20 px-2 py-0.5 text-xs text-yellow-200">
                            Pinned
                          </span>
                        )}
                        <h3 className="truncate text-base font-semibold text-white">
                          {n.title || "Untitled"}
                        </h3>
                      </div>
                      {n.content ? (
                        <p className="mt-2 whitespace-pre-wrap text-sm text-white/70">
                          {n.content}
                        </p>
                      ) : (
                        <p className="mt-2 text-sm text-white/50 italic">
                          (No content)
                        </p>
                      )}
                      <p className="mt-3 text-xs text-white/50">
                        Updated {new Date(n.updated_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={() => togglePin(n)}
                        className="rounded-xl border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-white hover:bg-white/10"
                      >
                        {n.is_pinned ? "Unpin" : "Pin"}
                      </button>
                      <button
                        onClick={() => deleteNote(n.id)}
                        className="rounded-xl border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-white hover:bg-red-500/20"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}