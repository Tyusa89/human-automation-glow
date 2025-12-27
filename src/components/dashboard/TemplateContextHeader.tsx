import { Link } from "react-router-dom";
import { getTemplateIdentity } from "@/config/templates/templateIdentity";
import { Button } from "@/components/ui/button";

type Props = {
  activeTemplateSlug?: string | null;
};

export default function TemplateContextHeader({ activeTemplateSlug }: Props) {
  if (!activeTemplateSlug) return null;

  const t = getTemplateIdentity(activeTemplateSlug);
  if (!t) return null;

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-primary">
            {t.name} active
          </p>

          <p className="text-lg font-semibold text-foreground">
            {t.primaryJob}
          </p>

          {t.description && (
            <p className="text-sm text-muted-foreground">
              {t.description}
            </p>
          )}
        </div>

        {t.primaryAction?.label && (
          t.primaryAction.href ? (
            <Button asChild variant="default" size="sm" className="gap-1 shrink-0">
              <Link to={t.primaryAction.href}>
                {t.primaryAction.label}
                <span aria-hidden>→</span>
              </Link>
            </Button>
          ) : (
            <Button variant="default" size="sm" className="gap-1 shrink-0">
              {t.primaryAction.label}
              <span aria-hidden>→</span>
            </Button>
          )
        )}
      </div>
    </div>
  );
}
