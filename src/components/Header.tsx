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
    <header className="flex items-center justify-between px-4 py-3 border-b bg-[hsl(220,91%,15%)]">
      <Link to="/" className="font-semibold text-white text-xl flex items-center gap-2">
        <img 
          src="/lovable-uploads/22c32c18-97ea-4d61-b7cc-513f8c8daa5e.png" 
          alt="EcoNest AI" 
          className="h-8 w-8 object-contain"
        />
        EcoNest AI
      </Link>
      
      <nav className="flex items-center gap-2">
        <Link to="/" className="hover:text-emerald-400 transition-colors text-white px-2">Home</Link>
        <ProductMegaMenu />
        <SolutionsMegaMenu />
        <TemplatesMegaMenu />
        <IntegrationsMegaMenu />
        <Link to="/pricing" className="hover:text-emerald-400 transition-colors text-white px-2">Pricing</Link>
        
        {authed && (
          <>
            <Link to="/dashboard" className="hover:text-emerald-400 transition-colors text-white px-2">Dashboard</Link>
            {role === 'owner' && (
              <Link to="/owner-dashboard" className="hover:text-emerald-300 transition-colors font-medium text-emerald-400 px-2">Owner Dashboard</Link>
            )}
            {admin && (
              <Link to="/admin" className="hover:text-emerald-400 transition-colors font-medium text-white px-2">Admin</Link>
            )}
          </>
        )}

        {/* Role badge */}
        {!roleLoading && role && (
          <span
            className={`px-2 py-0.5 text-xs rounded-full border ${
              role === 'owner'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : role === 'admin'
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                : 'bg-gray-500/20 text-gray-300 border-gray-500/40'
            }`}
          >
            {role.toUpperCase()}
          </span>
        )}

        {/* Auth buttons */}
        {authed ? (
          <Button variant="ghost" onClick={handleLogout} className="text-white hover:text-emerald-400 hover:bg-white/10">
            Sign Out
          </Button>
        ) : (
          <Link to="/auth">
            <Button variant="ghost" className="text-white hover:text-emerald-400 hover:bg-white/10">
              Sign In
            </Button>
          </Link>
        )}
      </nav>
    </header>
  );
}
