import { Link, NavLink } from "react-router-dom";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-white" : "text-white/70 hover:text-white"
  }`;

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b1224]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-white/10 ring-1 ring-white/10" />
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">EcoNest AI</div>
            <div className="text-[11px] text-white/60">Console</div>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/agent" className={navLinkClass}>
            Agent
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
