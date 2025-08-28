import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRole, isAdminLike } from '@/hooks/useRole';
import { Button } from '@/components/ui/button';
import { Map } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AppHeader() {
  const navigate = useNavigate();
  const { role, loading: roleLoading } = useRole();
  const admin = isAdminLike(role);

  const [authed, setAuthed] = useState(false);

  // watch auth state so we can show Login/Logout correctly
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
    <header className="flex items-center justify-between px-4 py-3 border-b bg-background">
      <Link to="/" className="font-semibold text-foreground text-xl flex items-center gap-2">
        <div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground grid place-items-center font-bold text-sm">EN</div>
        EcoNest AI
      </Link>
      
      <nav className="flex items-center gap-4">
        <Link to="/" className="hover:text-primary transition-colors text-foreground">Home</Link>
        <Link to="/services" className="hover:text-primary transition-colors text-foreground">Services</Link>
        <Link to="/pricing" className="hover:text-primary transition-colors text-foreground">Pricing</Link>
        <Link to="/contact" className="hover:text-primary transition-colors text-foreground">Contact</Link>
        
        {/* Sitemap Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Map className="h-4 w-4" />
              Sitemap
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-background border">
            <DropdownMenuItem asChild>
              <a href="#home" className="w-full">Home</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="#product" className="w-full">Product</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="#solutions" className="w-full">Solutions</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="#templates" className="w-full">Templates</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="#integrations" className="w-full">Integrations</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="#pricing" className="w-full">Pricing</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="#docs" className="w-full">Docs</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="#trust" className="w-full">Trust & Security</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {authed && (
          <>
            <Link to="/dashboard" className="hover:text-primary transition-colors text-foreground">Dashboard</Link>
            {admin && (
              <Link to="/admin" className="hover:text-primary transition-colors font-medium text-foreground">Admin</Link>
            )}
          </>
        )}

        {/* Role badge */}
        {!roleLoading && role && (
          <span
            className={`px-2 py-0.5 text-xs rounded-full border ${
              role === 'owner'
                ? 'bg-green-100 text-green-700 border-green-300'
                : role === 'admin'
                ? 'bg-blue-100 text-blue-700 border-blue-300'
                : 'bg-gray-100 text-gray-700 border-gray-300'
            }`}
          >
            {role.toUpperCase()}
          </span>
        )}

        {/* Auth buttons */}
        {authed ? (
          <Button variant="ghost" onClick={handleLogout}>
            Sign Out
          </Button>
        ) : (
          <Link to="/auth">
            <Button variant="ghost">
              Sign In
            </Button>
          </Link>
        )}
      </nav>
    </header>
  );
}
