import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Tab = 'magic' | 'password';

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>('magic');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.replace('/dashboard');
    });
  }, []);

  async function handleMagic(e: React.FormEvent) {
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

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    let data, error;
    if (isSignUp) {
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      data = result.data;
      error = result.error;
    } else {
      const result = await supabase.auth.signInWithPassword({ email, password });
      data = result.data;
      error = result.error;
    }
    
    setLoading(false);
    if (error) return alert(error.message);
    
    if (isSignUp && data.user) {
      // Minimal bootstrap record
      await supabase.from('profiles').insert({
        user_id: data.user.id,
        email: email,
        full_name: null,
        company: null,
        role: null,
        preferences: {}
      }).select().maybeSingle();
    }
    
    window.location.replace('/dashboard');
  }

  async function handleReset() {
    if (!email) return alert('Enter your email first');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/auth' // Supabase will send link; handle update password on this page if you want
    });
    if (error) return alert(error.message);
    alert('Password reset email sent.');
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold">Sign in to EcoNest AI</h1>

        {/* Tabs */}
        <div className="flex gap-2">
          <Button variant={tab==='magic'?'default':'outline'} onClick={()=>setTab('magic')}>Magic link</Button>
          <Button variant={tab==='password'?'default':'outline'} onClick={()=>setTab('password')}>Email + password</Button>
        </div>

        {/* Shared email field */}
        <Input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />

        {tab === 'magic' ? (
          <form onSubmit={handleMagic} className="space-y-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending…' : 'Send magic link'}
            </Button>
            {sent && <p className="text-sm text-muted-foreground">Magic link sent. Check your email.</p>}
          </form>
        ) : (
          <form onSubmit={handlePassword} className="space-y-3">
            <Input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (isSignUp ? 'Creating…' : 'Signing in…') : (isSignUp ? 'Create account' : 'Sign in')}
            </Button>
            <div className="flex items-center justify-between text-sm">
              <button type="button" className="underline" onClick={()=>setIsSignUp(s=>!s)}>
                {isSignUp ? 'Have an account? Sign in' : 'New here? Create account'}
              </button>
              <button type="button" className="underline" onClick={handleReset}>
                Forgot password?
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}