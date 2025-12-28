import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, ExternalLink, Layout } from "lucide-react";
import {
  fetchRecentTemplates,
  fetchSavedTemplates,
  toggleTemplateSaved,
} from "@/lib/templateActivity";

type Item = {
  template_slug: string;
  last_opened_at: string;
  open_count: number;
  saved: boolean;
  saved_at: string | null;
};

function prettySlug(slug: string) {
  return slug
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function TemplatesQuickAccess() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"saved" | "recent">("saved");
  const [saved, setSaved] = useState<Item[]>([]);
  const [recent, setRecent] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [s, r] = await Promise.all([
      fetchSavedTemplates(12),
      fetchRecentTemplates(12),
    ]);
    setSaved(s as Item[]);
    setRecent(r as Item[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const list = useMemo(
    () => (tab === "saved" ? saved : recent),
    [tab, saved, recent]
  );

  async function onToggleSave(slug: string, nextSaved: boolean) {
    await toggleTemplateSaved(slug, nextSaved);
    await load();
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Templates</CardTitle>
          </div>
          <div className="flex gap-1">
            <Button
              variant={tab === "saved" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTab("saved")}
            >
              Saved
            </Button>
            <Button
              variant={tab === "recent" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTab("recent")}
            >
              Recent
            </Button>
          </div>
        </div>
        <CardDescription>
          {tab === "saved"
            ? "Your starred templates"
            : "Recently opened templates"}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : list.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            {tab === "saved"
              ? "No saved templates yet. Star templates you use often."
              : "No recent templates yet. Open a template and it will show here."}
          </p>
        ) : (
          <ul className="space-y-2">
            {list.slice(0, 5).map((t) => (
              <li
                key={t.template_slug}
                className="flex items-center justify-between gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {prettySlug(t.template_slug)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Opened {t.open_count} time{t.open_count === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => navigate(`/templates/${t.template_slug}`)}
                    aria-label="Open template"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${t.saved ? "text-yellow-500" : "text-muted-foreground"}`}
                    onClick={() => onToggleSave(t.template_slug, !t.saved)}
                    aria-label={t.saved ? "Unsave template" : "Save template"}
                  >
                    <Star className={`h-4 w-4 ${t.saved ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {list.length > 5 && (
          <Button
            variant="link"
            size="sm"
            className="mt-2 w-full"
            onClick={() => navigate("/templates")}
          >
            View all templates
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
