import React, { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, LayoutGrid, Tag, Layers, Plug, Wrench, LifeBuoy, Mail, ShieldCheck,
  MessageSquare, Calendar, Users, FileText, BarChart3, Receipt,
  Crown, Settings, UserCheck, FolderOpen, CheckSquare, User, LogIn
} from "lucide-react";
import { useRole } from "./useRole";
import { useAuth } from "../../auth/AuthProvider";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Item = { 
  label: string; 
  to: string; 
  icon: React.ElementType;
};

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { isOwner } = useRole();
  const { user, ready } = useAuth();

  // Keep widths consistent & fix overlap by driving layout through CSS variable
  useEffect(() => {
    const w = collapsed ? 88 : 320;
    document.documentElement.style.setProperty("--sidebar-w", `${w}px`);
    return () => {
      document.documentElement.style.removeProperty("--sidebar-w");
    };
  }, [collapsed]);

  const explore: Item[] = useMemo(
    () => [
      { label: "Home", to: "/", icon: Home },
      { label: "Templates", to: "/templates", icon: LayoutGrid },
      { label: "Product", to: "/product", icon: Layers },
      { label: "Pricing", to: "/pricing", icon: Tag },
      { label: "Solutions", to: "/solutions", icon: Layers },
      { label: "Integrations", to: "/integrations", icon: Plug },
      { label: "Services", to: "/services", icon: Wrench },
      { label: "Support", to: "/support", icon: LifeBuoy },
      { label: "Contact", to: "/contact", icon: Mail },
      { label: "Trust", to: "/trust", icon: ShieldCheck },
    ],
    []
  );

  const app: Item[] = useMemo(
    () => [
      { label: "EcoNest Agent", to: "/agent", icon: MessageSquare },
      { label: "Dashboard", to: "/dashboard", icon: LayoutGrid },
      { label: "Appointments", to: "/appointments", icon: Calendar },
      { label: "Contacts", to: "/contacts", icon: Users },
      { label: "Notes", to: "/notes", icon: FileText },
      { label: "Reports", to: "/reports", icon: BarChart3 },
      { label: "Expenses", to: "/expenses", icon: Receipt },
    ],
    []
  );

  const owner: Item[] = useMemo(
    () => [
      { label: "Owner Dashboard", to: "/owner-dashboard", icon: Crown },
      { label: "Owner Agent", to: "/owner-agent", icon: Settings },
      { label: "ACM", to: "/owner/acm", icon: UserCheck },
      { label: "Contacts Directory", to: "/owner/contacts", icon: FolderOpen },
      { label: "Approvals", to: "/owner/approvals", icon: CheckSquare },
    ],
    []
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 h-screen",
        "border-r border-white/10 bg-slate-950/60 backdrop-blur-xl",
        "transition-[width] duration-200",
        collapsed ? "w-[88px]" : "w-[320px]"
      )}
    >
      {/* header */}
      <div className={cn("flex items-center gap-3 p-4", collapsed && "justify-center")}>
        <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5" />
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-sm font-semibold">EcoNest</div>
            <div className="text-xs text-slate-400">Intelligence Hub</div>
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className={cn(
            "ml-auto rounded-xl border border-white/10 bg-white/5 px-2 py-2 text-xs text-slate-200 hover:bg-white/10",
            collapsed && "ml-0"
          )}
          aria-label="Toggle sidebar"
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      {/* scroll area */}
      <div
        className={cn(
          "h-[calc(100vh-72px)] px-3 pb-4",
          "overflow-y-auto overscroll-contain",
          "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20"
        )}
      >
        <Section title="Explore" collapsed={collapsed} items={explore} />
        <div className="my-4 h-px bg-white/10" />
        <Section title="App" collapsed={collapsed} items={app} />

        {isOwner && (
          <>
            <div className="my-4 h-px bg-white/10" />
            <Section title="Owner" collapsed={collapsed} items={owner} />
          </>
        )}

        <div className="my-4 h-px bg-white/10" />
        <FooterLinks collapsed={collapsed} />
      </div>
    </aside>
  );
}

function Section({
  title,
  collapsed,
  items,
}: {
  title: string;
  collapsed: boolean;
  items: Item[];
}) {
  return (
    <div>
      {!collapsed && (
        <div className="px-2 py-2 text-[11px] uppercase tracking-wider text-slate-500">
          {title}
        </div>
      )}
      <div className="space-y-1">
        {items.map((item) => (
          <SidebarLink key={item.to} item={item} collapsed={collapsed} />
        ))}
      </div>
    </div>
  );
}

function SidebarLink({ item, collapsed }: { item: Item; collapsed: boolean }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition",
          "hover:bg-white/5",
          isActive && "bg-white/6"
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* Icon chip */}
          <span
            className={cn(
              "relative grid h-10 w-10 place-items-center rounded-full border transition",
              "border-white/10 bg-white/5",
              "group-hover:border-white/20 group-hover:bg-white/7",
              isActive && "border-white/25 bg-white/10 shadow-[0_0_0_4px_rgba(255,255,255,0.04)]"
            )}
          >
            {/* subtle glow */}
            <span
              className={cn(
                "pointer-events-none absolute inset-0 rounded-full opacity-0 blur-md transition nav-glow",
                isActive && "opacity-100"
              )}
            />
            <Icon className={cn("relative h-5 w-5 text-white/70", isActive && "text-white")} />
          </span>

          {/* Label */}
          {!collapsed && (
            <span className={cn("text-sm text-white/80", isActive && "text-white")}>
              {item.label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

function FooterLinks({ collapsed }: { collapsed: boolean }) {
  const { user } = useAuth();
  
  const footerItems: Item[] = user 
    ? [{ label: "Profile", to: "/profile", icon: User }]
    : [{ label: "Sign in", to: "/auth", icon: LogIn }];

  return (
    <div className="space-y-1">
      {footerItems.map((item) => (
        <SidebarLink key={item.to} item={item} collapsed={collapsed} />
      ))}
    </div>
  );
}