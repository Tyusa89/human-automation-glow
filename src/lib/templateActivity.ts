import { supabase } from "@/integrations/supabase/client";

export type TemplateActivityRow = {
  user_id: string;
  template_slug: string;
  last_opened_at: string;
  open_count: number;
  saved: boolean;
  saved_at: string | null;
};

/**
 * Record that the user opened a template.
 * Upserts the row and increments open_count.
 */
export async function recordTemplateOpen(templateSlug: string) {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) return;

  // Read current count then update (atomic RPC could be added later)
  const { data: existing } = await supabase
    .from("user_template_activity")
    .select("open_count")
    .eq("user_id", user.id)
    .eq("template_slug", templateSlug)
    .maybeSingle();

  const nextCount = (existing?.open_count ?? 0) + 1;

  await supabase.from("user_template_activity").upsert(
    {
      user_id: user.id,
      template_slug: templateSlug,
      last_opened_at: new Date().toISOString(),
      open_count: nextCount,
    },
    { onConflict: "user_id,template_slug" }
  );
}

/**
 * Toggle the saved state of a template for the current user.
 */
export async function toggleTemplateSaved(templateSlug: string, saved: boolean) {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) return;

  await supabase.from("user_template_activity").upsert(
    {
      user_id: user.id,
      template_slug: templateSlug,
      saved,
      saved_at: saved ? new Date().toISOString() : null,
      last_opened_at: new Date().toISOString(),
    },
    { onConflict: "user_id,template_slug" }
  );
}

/**
 * Fetch the user's saved templates, ordered by saved_at descending.
 */
export async function fetchSavedTemplates(limit = 12) {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) return [];

  const { data } = await supabase
    .from("user_template_activity")
    .select("template_slug,last_opened_at,open_count,saved,saved_at")
    .eq("user_id", user.id)
    .eq("saved", true)
    .order("saved_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as Pick<
    TemplateActivityRow,
    "template_slug" | "last_opened_at" | "open_count" | "saved" | "saved_at"
  >[];
}

/**
 * Fetch the user's recently opened templates, ordered by last_opened_at descending.
 */
export async function fetchRecentTemplates(limit = 12) {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) return [];

  const { data } = await supabase
    .from("user_template_activity")
    .select("template_slug,last_opened_at,open_count,saved,saved_at")
    .eq("user_id", user.id)
    .order("last_opened_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as Pick<
    TemplateActivityRow,
    "template_slug" | "last_opened_at" | "open_count" | "saved" | "saved_at"
  >[];
}
