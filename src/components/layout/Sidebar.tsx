import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  FileText, 
  Package, 
  DollarSign, 
  Puzzle, 
  Zap, 
  Briefcase, 
  HelpCircle, 
  Mail, 
  Shield, 
  User, 
  LogOut,
  MessageSquare,
  LayoutDashboard,
  Calendar,
  Users,
  FileEdit,
  BarChart3,
  CreditCard,
  Settings,
  Database,
  CheckSquare,
  TrendingUp,
  Zap as ZapierIcon,
  UserCheck
} from "lucide-react";

const exploreItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: FileText, label: "Templates", href: "/templates" },
  { icon: Package, label: "Product", href: "/product" },
  { icon: DollarSign, label: "Pricing", href: "/pricing" },
  { icon: Puzzle, label: "Solutions", href: "/solutions" },
  { icon: Zap, label: "Integrations", href: "/integrations" },
  { icon: Briefcase, label: "Services", href: "/services" },
  { icon: HelpCircle, label: "Support", href: "/support" },
  { icon: Mail, label: "Contact", href: "/contact" },
  { icon: Shield, label: "Trust", href: "/trust" },
];

const appItems = [
  { icon: MessageSquare, label: "EcoNest Agent", href: "/agent" },
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Calendar, label: "Appointments", href: "/appointments" },
  { icon: Users, label: "Contacts", href: "/contacts" },
  { icon: FileEdit, label: "Notes", href: "/notes" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: CreditCard, label: "Expenses", href: "/expenses" },
];

const ownerItems = [
  { icon: Settings, label: "Owner Dashboard", href: "/owner-dashboard" },
  { icon: Settings, label: "Owner Agent", href: "/owner-agent" },
  { icon: Database, label: "ACM", href: "/acm" },
  { icon: Users, label: "Contacts Directory", href: "/contacts-directory" },
  { icon: CheckSquare, label: "Approvals", href: "/approvals" },
];

const demosItems = [
  { icon: TrendingUp, label: "Analytics", href: "/analytics" },
  { icon: Mail, label: "Email Builder", href: "/email-builder" },
  { icon: ZapierIcon, label: "Zapier + Intercom", href: "/zapier-intercom" },
];

const bottomItems = [
  { icon: User, label: "Profile", href: "/profile" },
  { icon: LogOut, label: "Sign out", href: "/auth" },
];

export default function Sidebar() {
  const location = useLocation();

  const renderNavItem = (item: any, isActive: boolean) => (
    <Link
      key={item.label}
      to={item.href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
        isActive
          ? "bg-white/10 text-white"
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
    >
      <item.icon size={18} />
      {item.label}
    </Link>
  );

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0a1426] border-r border-white/10 p-4 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-white">
          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="font-semibold">EcoNest Intelligence Hub</span>
        </div>
      </div>

      <nav className="space-y-6">
        {/* EXPLORE Section */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            EXPLORE
          </h3>
          <div className="space-y-1">
            {exploreItems.map((item) => {
              const isActive = location.pathname === item.href;
              return renderNavItem(item, isActive);
            })}
          </div>
        </div>

        {/* APP Section */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            APP
          </h3>
          <div className="space-y-1">
            {appItems.map((item) => {
              const isActive = location.pathname === item.href;
              return renderNavItem(item, isActive);
            })}
          </div>
        </div>

        {/* OWNER Section */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            OWNER
          </h3>
          <div className="space-y-1">
            {ownerItems.map((item) => {
              const isActive = location.pathname === item.href;
              return renderNavItem(item, isActive);
            })}
          </div>
        </div>

        {/* DEMOS Section */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            DEMOS
          </h3>
          <div className="space-y-1">
            {demosItems.map((item) => {
              const isActive = location.pathname === item.href;
              return renderNavItem(item, isActive);
            })}
          </div>
        </div>

        {/* Bottom Items */}
        <div className="pt-4 border-t border-white/10">
          <div className="space-y-1">
            {bottomItems.map((item) => {
              const isActive = location.pathname === item.href;
              return renderNavItem(item, isActive);
            })}
          </div>
        </div>
      </nav>
    </aside>
  );
}