import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";
import { useAuth } from "../auth/AuthProvider";
import {
  Home,
  LayoutGrid,
  Users,
  StickyNote,
  FileBarChart2,
  Receipt,
  BarChart3,
  Mail,
  Zap,
  ShieldCheck,
  User,
  Layers,
  Bot,
  Settings,
  UserCheck,
  Building2,
  ClipboardCheck,
} from "lucide-react";

type Item = { label: string; to: string; icon: React.ElementType };

function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

const EXPLORE: Item[] = [
  { label: "Home", to: "/", icon: Home },
  { label: "Templates", to: "/templates", icon: Layers },
  { label: "Product", to: "/product", icon: Layers },
  { label: "Pricing", to: "/pricing", icon: Receipt },
  { label: "Solutions", to: "/solutions", icon: LayoutGrid },
  { label: "Integrations", to: "/integrations", icon: Zap },
  { label: "Services", to: "/services", icon: FileBarChart2 },
  { label: "Support", to: "/support", icon: StickyNote },
  { label: "Contact", to: "/contact", icon: Mail },
  { label: "Trust", to: "/trust", icon: ShieldCheck },
];

const APP: Item[] = [
  { label: "EcoNest Agent", to: "/agent", icon: Bot },
  { label: "Dashboard", to: "/dashboard", icon: LayoutGrid },
  { label: "Appointments", to: "/appointments", icon: LayoutGrid },
  { label: "Contacts", to: "/contacts", icon: Users },
  { label: "Notes", to: "/notes", icon: StickyNote },
  { label: "Reports", to: "/reports", icon: FileBarChart2 },
  { label: "Expenses", to: "/expenses", icon: Receipt },
];

const DEMOS: Item[] = [
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
  { label: "Email Builder", to: "/email-builder", icon: Mail },
  { label: "Zapier + Integrations", to: "/integrations", icon: Zap },
  { label: "Trust", to: "/trust", icon: ShieldCheck },
];

const OWNER: Item[] = [
  { label: "Owner Dashboard", to: "/owner-dashboard", icon: LayoutGrid },
  { label: "Owner Agent", to: "/owner-agent", icon: Settings },
  { label: "ACM", to: "/owner/acm", icon: Building2 },
  { label: "Contacts Directory", to: "/owner/contacts", icon: Users },
  { label: "Approvals", to: "/owner/approvals", icon: ClipboardCheck },
];

export default function EcoNestSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const navigate = useNavigate();
  const { user, ready: authReady, isOwner } = useAuth();
  return (
    <aside
      className={cn(
        "h-screen sticky top-0 shrink-0 border-r border-white/10 flex flex-col -ml-1",
        "bg-[#070b18]/60 backdrop-blur-xl",
        collapsed ? "w-[76px]" : "w-[260px]"
      )}
    >
      {/* SCROLL AREA (everything above auth) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden econest-scroll pr-1">
        {/* Header */}
        <div className="px-2 pt-3 pb-2 flex items-center justify-between">
          {!collapsed && (
            <div className="text-[10px] tracking-widest text-white/40">EXPLORE</div>
          )}
          <button
            onClick={onToggle}
            className="ml-auto rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10"
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        <div className="px-1 pb-2">
          <nav className="pb-1">
            {EXPLORE.map((item) => (
              <SidebarLink key={item.to} item={item} collapsed={collapsed} />
            ))}
          </nav>

          <div className="px-1 pt-1 pb-0.5">
            {!collapsed && (
              <div className="text-[10px] tracking-widest text-white/40">APP</div>
            )}
          </div>

          <nav className="pb-1">
            {APP.map((item) => (
              <SidebarLink key={item.to} item={item} collapsed={collapsed} />
            ))}
          </nav>

          <div className="px-1 pt-1 pb-0.5">
            {!collapsed && (
              <div className="text-[10px] tracking-widest text-white/40">DEMOS</div>
            )}
          </div>

          <nav className="pb-1">
            {DEMOS.map((item) => (
              <SidebarLink key={item.to} item={item} collapsed={collapsed} />
            ))}
          </nav>

          {isOwner && (
            <>
              <div className="px-1 pt-1 pb-0.5">
                {!collapsed && (
                  <div className="text-[10px] tracking-widest text-white/40">OWNER</div>
                )}
              </div>
              <nav className="pb-1">
                {OWNER.map((item) => (
                  <SidebarLink key={item.to} item={item} collapsed={collapsed} />
                ))}
              </nav>
            </>
          )}
        </div>
      </div>

      {/* PINNED BOTTOM (never scrolls) */}
      <div className="shrink-0 border-t border-white/10 px-2 py-3 space-y-2">
        {user && (
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-2 rounded-xl px-2 py-2 text-[13px] text-slate-200/90 hover:bg-white/5 hover:text-white transition",
                isActive && "bg-white/8 text-white"
              )
            }
            title={collapsed ? "Profile" : undefined}
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-2xl border border-white/10 bg-white/5 text-slate-200/90 group-hover:bg-white/10 transition",
                    isActive && "bg-white/10 text-white"
                  )}
                >
                  <User className="h-4 w-4" />
                </span>
                {!collapsed && <span className="truncate">Profile</span>}
              </>
            )}
          </NavLink>
        )}
        
        {user ? (
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-white/5"
            title={collapsed ? "Sign out" : undefined}
          >
            <span className="grid h-8 w-8 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <span className="text-white/70">⚡</span>
            </span>
            {!collapsed && <span className="text-[13px] text-white/80">Sign out</span>}
          </button>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="w-full flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-white/5"
            title={collapsed ? "Sign in" : undefined}
            disabled={!authReady}
          >
            <span className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/5">
              <span className="text-white/70">🔐</span>
            </span>
          </button>
        )}
      </div>
    </aside>
  );
}

function SidebarLink({ item, collapsed }: { item: Item; collapsed: boolean }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-2 rounded-xl px-2 py-2 text-[13px] text-slate-200/90 hover:bg-white/5 hover:text-white transition",
          isActive && "bg-white/8 text-white"
        )
      }
      title={collapsed ? item.label : undefined}
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              "grid h-8 w-8 place-items-center rounded-2xl border border-white/10 bg-white/5 text-slate-200/90 group-hover:bg-white/10 transition",
              isActive && "bg-white/10 text-white"
            )}
          >
            <Icon className="h-4 w-4" />
          </span>

          {!collapsed && <span className="truncate">{item.label}</span>}
        </>
      )}
    </NavLink>
  );
}