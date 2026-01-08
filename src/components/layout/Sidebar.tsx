import { NavLink } from "react-router-dom";
import { NAV, NavItem } from "./navConfig";
import { useAuth } from "@/auth/AuthProvider";
import SidebarAccountFooter from "@/components/sidebar/SidebarAccountFooter";

function Item({ item, isAuthed }: { item: NavItem; isAuthed: boolean }) {
  const disabled = !!item.comingSoon;
  const hidden = item.requiresAuth && !isAuthed;

  if (hidden) return null;

  const Icon = item.icon;

  return (
    <NavLink
      to={disabled ? "#" : item.to}
      onClick={(e) => {
        if (disabled) e.preventDefault();
      }}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition text-white/70",
          disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-white/5 hover:text-white",
          isActive && !disabled ? "bg-white/10 text-white" : "",
        ].join(" ")
      }
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 border border-white/10">
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1">{item.label}</span>
      {item.comingSoon && (
        <span className="text-[10px] rounded-full px-2 py-1 bg-white/5 border border-white/10">
          Soon
        </span>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const { user, isOwner } = useAuth();
  const isAuthed = !!user;
  
  // Debug logging
  console.log("Sidebar debug:", { user: !!user, isOwner, isAuthed });

  return (
    <aside className="flex h-[calc(100vh-56px)] flex-col bg-[#0a1426] border-r border-white/10 p-4 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-white">
          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="font-semibold">EcoNest Intelligence Hub</span>
        </div>
      </div>

      <div className="space-y-6 flex-1">
        {/* EXPLORE Section */}
        <div>
          <div className="mt-6 mb-2 px-3 text-xs tracking-wider opacity-50">
            EXPLORE
          </div>
          <div className="space-y-1">
            {NAV.site.map((item) => (
              <Item key={item.to} item={item} isAuthed={isAuthed} />
            ))}
          </div>
        </div>

        {/* APP Section */}
        {isAuthed && (
          <>
            <div className="h-px bg-white/10" />
            <div>
              <div className="mt-6 mb-2 px-3 text-xs tracking-wider opacity-50">
                APP
              </div>
              <div className="space-y-1">
                {NAV.app.map((item) => (
                  <Item key={item.to} item={item} isAuthed={isAuthed} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* OWNER Section - only show if owner */}
        {(isOwner || isAuthed) && (
          <>
            <div className="h-px bg-white/10" />
            <div>
              <div className="mt-6 mb-2 px-3 text-xs tracking-wider opacity-50">
                OWNER {!isOwner && "(DEBUG)"}
              </div>
              <div className="space-y-1">
                {NAV.owner.map((item) => (
                  <Item key={item.to} item={item} isAuthed={isAuthed} />
                ))}
              </div>
            </div>
          </>
        )}

        <div className="h-px bg-white/10" />

        {/* DEMOS Section */}
        <div>
          <div className="mt-6 mb-2 px-3 text-xs tracking-wider opacity-50">
            DEMOS
          </div>
          <div className="space-y-1">
            {NAV.demos.map((item) => (
              <Item key={item.to} item={item} isAuthed={isAuthed} />
            ))}
          </div>
        </div>
      </div>

      <SidebarAccountFooter />
    </aside>
  );
}