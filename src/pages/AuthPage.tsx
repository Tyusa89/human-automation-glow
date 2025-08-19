import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

import {
  OTP_WINDOW_SECONDS,
  secondsUntilOtpAllowed,
  recordOtpSentNow,
  validatePassword,
  PASSWORD_MIN_LEN,
} from '@/lib/authPolicy';

type Tab = 'magic' | 'password';

export default function AuthPage() {
  // UI state
  const [tab, setTab] = useState<Tab>('magic');

  // shared email
  const [email, setEmail] = useState('');

  // magic link
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // password flow
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  // if already authed, skip this page
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.replace('/dashboard');
    });
  }, []);

  // live countdown for "Resend in N s"
  useEffect(() => {
    const timer = setInterval(() => setCooldown(secondsUntilOtpAllowed()), 1000);
    return () => clearInterval(timer);
  }, []);

  // validate password as user types
  useEffect(() => {
    if (password && isSignUp) {
      setPasswordErrors(validatePassword(password));
    } else {
      setPasswordErrors([]);
    }
  }, [password, isSignUp]);

  // ---------- Magic link handlers ----------
  async function handleMagic(e: React.FormEvent) {
    e.preventDefault();
    const wait = secondsUntilOtpAllowed();
    if (wait > 0) {
      setError(`Please wait ${wait}s before requesting another link.`);
      return;
    }

    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + '/dashboard' }
    });
    
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    
    recordOtpSentNow();
    setSent(true);
    setCooldown(secondsUntilOtpAllowed());
  }

  // ---------- Password handlers ----------
  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    
    // Pre-flight validation for signup
    if (isSignUp && passwordErrors.length > 0) {
      setError('Please fix password requirements before continuing.');
      return;
    }
    
    setLoading(true);
    setError('');
    
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
    if (error) {
      setError(error.message);
      return;
    }
    
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
    if (!email) {
      setError('Enter your email first');
      return;
    }
    
    setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/auth'
    });
    
    if (error) {
      setError(error.message);
      return;
    }
    
    setError('Password reset email sent. Check your inbox.');
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

        {/* Error display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || cooldown > 0}
            >
              {loading 
                ? 'Sending…' 
                : cooldown > 0 
                  ? `Resend in ${cooldown}s`
                  : 'Send magic link'
              }
            </Button>
            {sent && (
              <p className="text-sm text-muted-foreground">
                Magic link sent. Check your email and click the link to sign in.
              </p>
            )}
          </form>
        ) : (
          <form onSubmit={handlePassword} className="space-y-3">
            <Input
              type="password"
              placeholder={`Password (min ${PASSWORD_MIN_LEN} chars)`}
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />
            
            {/* Password requirements for signup */}
            {isSignUp && passwordErrors.length > 0 && (
              <Alert>
                <AlertDescription>
                  <div className="text-sm">
                    <p className="font-medium mb-1">Password must include:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {passwordErrors.map((error, i) => (
                        <li key={i} className="text-muted-foreground">{error}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || (isSignUp && passwordErrors.length > 0)}
            >
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