
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

type Tab = 'magic' | 'password' | 'phone';

export default function AuthPage() {
  console.log('AuthPage component is rendering');
  
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

  // phone flow
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // if already authed, skip this page
  useEffect(() => {
    console.log('Checking existing session...');
    supabase.auth.getSession().then(({ data }) => {
      console.log('Session check result:', data);
      if (data.session) {
        console.log('User already authenticated, redirecting to dashboard');
        window.location.replace('/dashboard');
      }
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
        preferences: {}
      }).select().maybeSingle();
      
      // Redirect new users to terms acceptance
      window.location.replace('/terms-acceptance');
      return;
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

  // ---------- Phone handlers ----------
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithOtp({
      phone: phone
    });
    
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    
    setOtpSent(true);
    setError('SMS sent! Enter the verification code.');
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.verifyOtp({
      phone: phone,
      token: otp,
      type: 'sms'
    });
    
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    
    window.location.replace('/dashboard');
  }

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-background">
      <div className="w-full max-w-md space-y-6 bg-card p-8 rounded-lg border shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to EcoNest AI</h1>
          <p className="text-muted-foreground">Sign in to continue</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 w-full">
          <Button 
            variant={tab==='magic'?'default':'outline'} 
            onClick={()=>setTab('magic')}
            className="flex-1 text-xs"
          >
            Magic link
          </Button>
          <Button 
            variant={tab==='password'?'default':'outline'} 
            onClick={()=>setTab('password')}
            className="flex-1 text-xs"
          >
            Email + password
          </Button>
          <Button 
            variant={tab==='phone'?'default':'outline'} 
            onClick={()=>setTab('phone')}
            className="flex-1 text-xs"
          >
            SMS
          </Button>
        </div>

        {/* Error display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Shared input field */}
        {tab !== 'phone' ? (
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-foreground">
              Phone number
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={phone}
              onChange={(e)=>setPhone(e.target.value)}
              required
            />
          </div>
        )}

        {tab === 'magic' ? (
          <form onSubmit={handleMagic} className="space-y-4">
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
              <p className="text-sm text-muted-foreground text-center">
                Magic link sent! Check your email and click the link to sign in.
              </p>
            )}
          </form>
        ) : tab === 'password' ? (
          <form onSubmit={handlePassword} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder={`Password (min ${PASSWORD_MIN_LEN} chars)`}
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
              />
            </div>
            
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
              {loading ? (isSignUp ? 'Creating account…' : 'Signing in…') : (isSignUp ? 'Create account' : 'Sign in')}
            </Button>
            
            <div className="flex items-center justify-between text-sm">
              <button 
                type="button" 
                className="text-primary hover:underline" 
                onClick={()=>setIsSignUp(s=>!s)}
              >
                {isSignUp ? 'Have an account? Sign in' : 'New here? Create account'}
              </button>
              <button 
                type="button" 
                className="text-primary hover:underline" 
                onClick={handleReset}
              >
                Forgot password?
              </button>
            </div>
          </form>
        ) : (
          /* Phone authentication */
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? 'Sending SMS...' : 'Send verification code'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="otp" className="text-sm font-medium text-foreground">
                    Verification code
                  </label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e)=>setOtp(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify and sign in'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  className="w-full" 
                  onClick={() => {setOtpSent(false); setOtp(''); setError('');}}
                >
                  Back to phone number
                </Button>
              </form>
            )}
          </div>
        )}

        <div className="text-center">
          <a 
            href="/" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
