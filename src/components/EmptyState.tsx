import { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
  title: string;
  description: string;
  icon?: ReactNode; // optional (emoji or lucide icon)
  primaryCta?: { label: string; to: string };
  secondaryCta?: { label: string; to: string };
};

export default function EmptyState({
  title,
  description,
  icon,
  primaryCta = { label: "Go to Dashboard", to: "/dashboard" },
  secondaryCta = { label: "Back to Home", to: "/" },
}: Props) {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center px-6">
      <div className="max-w-xl w-full text-center">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/5">
          {icon ?? <span className="text-2xl">🚀</span>}
        </div>

        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="mt-3 text-sm opacity-70 leading-relaxed">{description}</p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            to={secondaryCta.to}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm hover:bg-white/10"
          >
            {secondaryCta.label}
          </Link>

          <Link
            to={primaryCta.to}
            className="rounded-xl border border-white/10 bg-emerald-500/15 px-5 py-2 text-sm hover:bg-emerald-500/20"
          >
            {primaryCta.label}
          </Link>
        </div>
      </div>
    </div>
  );
}