import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { supabase } from '../integrations/supabase/client';
import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';

const Header = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };
  return (
    <header className="w-full bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/5fd0e2db-d0a1-4acb-b206-80402fcc72fd.png" 
            alt="EcoNest AI" 
            className="h-10 w-auto"
          />
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/services" className="text-foreground hover:text-accent transition-colors">
            Services
          </Link>
          <a href="#about" className="text-foreground hover:text-accent transition-colors">
            About
          </a>
          <Link to="/contact" className="text-foreground hover:text-accent transition-colors">
            Contact
          </Link>
          <Link to="/dashboard" className="text-foreground hover:text-accent transition-colors">
            Dashboard
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {!session ? (
            <Link to="/auth">
              <Button variant="ghost" className="text-foreground hover:text-accent">
                Sign In
              </Button>
            </Link>
          ) : (
            <Button
              variant="ghost"
              className="text-foreground hover:text-accent"
              onClick={() => supabase.auth.signOut()}
            >
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;