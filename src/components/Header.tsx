import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRole, isAdminLike } from '@/hooks/useRole';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, User, LogOut, LayoutDashboard, Shield, Crown, Menu } from 'lucide-react';
import ProductMegaMenu from './ProductMegaMenu';
import SolutionsMegaMenu from './SolutionsMegaMenu';
import TemplatesMegaMenu from './TemplatesMegaMenu';
import IntegrationsMegaMenu from './IntegrationsMegaMenu';

export default function AppHeader() {
  const navigate = useNavigate();
  const { role, loading: roleLoading } = useRole();
  const admin = isAdminLike(role);

  const [authed, setAuthed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => mounted && setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session);
    });
    return () => { sub.subscription.unsubscribe(); mounted = false; };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/auth');
  }

  return (
    <header className="flex items-center px-4 py-2 border-b border-white/10 bg-[hsl(220,91%,12%)]/70 backdrop-blur-md sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="font-semibold text-white text-xl flex items-center gap-2">
        <img 
          src="/lovable-uploads/22c32c18-97ea-4d61-b7cc-513f8c8daa5e.png" 
          alt="EcoNest AI" 
          className="h-8 w-8 object-contain"
        />
        <span className="hidden sm:inline">EcoNest AI</span>
      </Link>
      
      {/* Desktop Nav - positioned close to logo */}
      <nav className="hidden md:flex items-center gap-1 ml-8">
        {/* Core app links for authenticated users */}
        {authed && (
          <>
            <TemplatesMegaMenu />
            <IntegrationsMegaMenu />
            <Link to="/appointments" className="hover:text-emerald-400 transition-colors text-white px-3 py-1.5 rounded-md hover:bg-white/5 text-sm">
              Appointments
            </Link>
          </>
        )}

        {/* More dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-white hover:text-emerald-400 hover:bg-white/5 gap-1 text-sm px-3">
              More
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-[hsl(220,91%,15%)] border-white/10">
            <DropdownMenuItem asChild>
              <Link to="/product" className="text-white hover:text-emerald-400 cursor-pointer">
                Product
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/solutions" className="text-white hover:text-emerald-400 cursor-pointer">
                Solutions
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/pricing" className="text-white hover:text-emerald-400 cursor-pointer">
                Pricing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem asChild>
              <Link to="/support" className="text-white hover:text-emerald-400 cursor-pointer">
                Support
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Spacer to push account to the right */}
        <div className="flex-1" />

        {/* Profile / Auth dropdown */}
        {authed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white hover:text-emerald-400 hover:bg-white/5 gap-2 text-sm px-3 ml-2">
                <User className="h-4 w-4" />
                Account
                {!roleLoading && role && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 text-[10px] rounded-full ${
                      role === 'owner'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : role === 'admin'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-gray-500/20 text-gray-300'
                    }`}
                  >
                    {role.toUpperCase()}
                  </span>
                )}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[hsl(220,91%,15%)] border-white/10">
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="text-white hover:text-emerald-400 cursor-pointer flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              
              {role === 'owner' && (
                <DropdownMenuItem asChild>
                  <Link to="/owner-dashboard" className="text-emerald-400 hover:text-emerald-300 cursor-pointer flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    Owner Dashboard
                  </Link>
                </DropdownMenuItem>
              )}
              
              {admin && (
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="text-white hover:text-emerald-400 cursor-pointer flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Admin Panel
                  </Link>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator className="bg-white/10" />
              
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-white hover:text-red-400 cursor-pointer flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/auth">
            <Button variant="ghost" className="text-white hover:text-emerald-400 hover:bg-white/5 text-sm">
              Sign In
            </Button>
          </Link>
        )}
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-2">
        {authed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[hsl(220,91%,15%)] border-white/10">
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="text-white hover:text-emerald-400 cursor-pointer">
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/templates" className="text-white hover:text-emerald-400 cursor-pointer">
                  Templates
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/integrations" className="text-white hover:text-emerald-400 cursor-pointer">
                  Integrations
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/appointments" className="text-white hover:text-emerald-400 cursor-pointer">
                  Appointments
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem asChild>
                <Link to="/pricing" className="text-white hover:text-emerald-400 cursor-pointer">
                  Pricing
                </Link>
              </DropdownMenuItem>
              {role === 'owner' && (
                <DropdownMenuItem asChild>
                  <Link to="/owner-dashboard" className="text-emerald-400 cursor-pointer">
                    Owner Dashboard
                  </Link>
                </DropdownMenuItem>
              )}
              {admin && (
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="text-white cursor-pointer">
                    Admin
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link to="/support" className="text-white hover:text-emerald-400 cursor-pointer">
                  Support
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem onClick={handleLogout} className="text-red-400 cursor-pointer">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/auth">
            <Button variant="ghost" className="text-white hover:bg-white/10 text-sm">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
