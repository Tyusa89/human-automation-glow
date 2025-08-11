import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.replace('/dashboard');
    });
  }, []);

  async function handleMagicLink(e: React.FormEvent) {
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

  async function handleEmailPassword(e: React.FormEvent, isSignUp: boolean) {
    e.preventDefault();
    setLoading(true);
    
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + '/dashboard' }
      });
      if (error) {
        setLoading(false);
        return alert(error.message);
      }
      setSent(true);
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        setLoading(false);
        return alert(error.message);
      }
      // Successful sign in will be handled by the redirect in useEffect
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in to EcoNest AI</CardTitle>
          <CardDescription>Choose your preferred authentication method</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="magic-link" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
              <TabsTrigger value="email-password">Email + Password</TabsTrigger>
            </TabsList>
            
            <TabsContent value="magic-link" className="space-y-4">
              {sent ? (
                <p className="text-center text-sm text-muted-foreground">
                  Magic link sent. Check your email.
                </p>
              ) : (
                <form onSubmit={handleMagicLink} className="space-y-4">
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
                </form>
              )}
            </TabsContent>
            
            <TabsContent value="email-password" className="space-y-4">
              <form className="space-y-4">
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="flex gap-2">
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex-1" 
                    disabled={loading}
                    onClick={(e) => handleEmailPassword(e, false)}
                  >
                    {loading ? 'Signing in…' : 'Sign In'}
                  </Button>
                  <Button 
                    type="button"
                    className="flex-1" 
                    disabled={loading}
                    onClick={(e) => handleEmailPassword(e, true)}
                  >
                    {loading ? 'Signing up…' : 'Sign Up'}
                  </Button>
                </div>
              </form>
              {sent && (
                <p className="text-center text-sm text-muted-foreground">
                  Confirmation email sent. Check your inbox.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}