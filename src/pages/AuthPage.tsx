import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.replace('/dashboard');
    });
  }, []);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + '/dashboard' }
    });
    setLoading(false);
    if (error) return alert(error.message);
    setSent(true);
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form onSubmit={handleSignIn} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Sign in to EcoNest AI</h1>
        {sent ? (
          <p>Magic link sent. Check your email.</p>
        ) : (
          <>
            <Input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending…' : 'Send magic link'}
            </Button>
          </>
        )}
      </form>
    </div>
  );
}