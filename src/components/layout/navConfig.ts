import {
  Home,
  LayoutDashboard,
  Calendar,
  Users,
  NotebookPen,
  FileText,
  Receipt,
  Bot,
  Wrench,
  Sparkles,
  Package,
  BadgeDollarSign,
  Lightbulb,
  Plug,
  Headphones,
  Mail,
  BarChart3,
  LogIn,
  Shield,
  Settings,
  Database,
  CheckSquare,
} from "lucide-react";

export type NavItem = {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresAuth?: boolean;
  comingSoon?: boolean;
};

export const NAV = {
  app: [
    { label: "EcoNest Agent", to: "/agent", icon: Bot, requiresAuth: true },
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, requiresAuth: true },
    { label: "Appointments", to: "/appointments", icon: Calendar, requiresAuth: true },
    { label: "Contacts", to: "/contacts", icon: Users, requiresAuth: true },
    { label: "Notes", to: "/notes", icon: NotebookPen, requiresAuth: true },
    { label: "Reports", to: "/reports", icon: FileText, requiresAuth: true },
    { label: "Expenses", to: "/expenses", icon: Receipt, requiresAuth: true },
  ] satisfies NavItem[],

  site: [
    { label: "Home", to: "/", icon: Home },
    { label: "Templates", to: "/templates", icon: Sparkles },
    { label: "Product", to: "/product", icon: Package },
    { label: "Pricing", to: "/pricing", icon: BadgeDollarSign },
    { label: "Solutions", to: "/solutions", icon: Lightbulb },
    { label: "Integrations", to: "/integrations", icon: Plug },
    { label: "Services", to: "/services", icon: Wrench },
    { label: "Support", to: "/support", icon: Headphones },
    { label: "Contact", to: "/contact", icon: Mail },
    { label: "Trust", to: "/trust", icon: Shield },
  ] satisfies NavItem[],

  demos: [
    { label: "Analytics", to: "/demos/analytics", icon: BarChart3, comingSoon: true },
  ] satisfies NavItem[],

  owner: [
    { label: "Owner Dashboard", to: "/owner-dashboard", icon: Shield, requiresAuth: true },
    { label: "Owner Agent", to: "/owner-agent", icon: Settings, requiresAuth: true, comingSoon: true },
    { label: "Access Control", to: "/acm", icon: Database, requiresAuth: true, comingSoon: true },
    { label: "Contacts Directory", to: "/contacts-directory", icon: Users, requiresAuth: true, comingSoon: true },
    { label: "Approvals", to: "/approvals", icon: CheckSquare, requiresAuth: true, comingSoon: true },
  ] satisfies NavItem[],

  auth: [
    { label: "Sign in", to: "/auth", icon: LogIn },
  ] satisfies NavItem[],
};