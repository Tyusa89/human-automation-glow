import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRole, isAdminLike } from '@/hooks/useRole';
import { Button } from '@/components/ui/button';
import ProductMegaMenu from './ProductMegaMenu';
import SolutionsMegaMenu from './SolutionsMegaMenu';
import TemplatesMegaMenu from './TemplatesMegaMenu';
import IntegrationsMegaMenu from './IntegrationsMegaMenu';

export default function AppHeader() {
  const navigate = useNavigate();
  const { role, loading: roleLoading } = useRole();
  const admin = isAdminLike(role);

  const [authed, setAuthed] = useState(false);

  // Debug logging
  console.log('Header - role:', role, 'loading:', roleLoading, 'authed:', authed);

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
        <img 
          src="/lovable-uploads/22c32c18-97ea-4d61-b7cc-513f8c8daa5e.png" 
          alt="EcoNest AI" 
          className="h-8 w-8 object-contain"
        />
        EcoNest AI
      </Link>
      
      <nav className="flex items-center gap-2">
        <Link to="/" className="hover:text-primary transition-colors text-foreground px-2">Home</Link>
        <ProductMegaMenu />
        <SolutionsMegaMenu />
        <TemplatesMegaMenu />
        <IntegrationsMegaMenu />
        <Link to="/pricing" className="hover:text-primary transition-colors text-foreground px-2">Pricing</Link>
        
        {authed && (
          <>
            <Link to="/dashboard" className="hover:text-primary transition-colors text-foreground">Dashboard</Link>
            {role === 'owner' && (
              <Link to="/owner-dashboard" className="hover:text-primary transition-colors font-medium text-emerald-600">Owner Dashboard</Link>
            )}
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
