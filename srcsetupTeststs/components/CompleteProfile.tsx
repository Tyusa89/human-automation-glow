import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProfileCard from '@/components/ProfileCard';

function useProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const user = u?.user;
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from('profiles')
        .select('id,email,full_name,company')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!data) {
        const { data: inserted } = await supabase
          .from('profiles')
          .insert({ user_id: user.id, email: user.email ?? '' })
          .select('id,email,full_name,company')
          .single();
        if (mounted) setProfile(inserted);
      } else if (mounted) setProfile(data);

      if (mounted) setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  return { loading, profile, refresh: async () => {
    const { data: u } = await supabase.auth.getUser();
    const user = u?.user;
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('id,email,full_name,company')
      .eq('user_id', user.id)
      .maybeSingle();
    setProfile(data);
  }};
}

export default function CompleteProfile() {
  const { loading, profile, refresh } = useProfile();
  const [dismissed, setDismissed] = useState(
    typeof window !== 'undefined' && localStorage.getItem('hideProfilePrompt') === '1'
  );

  if (loading) return null;
  const missing = !profile?.full_name || !profile?.company;
  if (!missing || dismissed) return null;

  return (
    <Card className="border-accent/20">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Complete your profile</CardTitle>
        <Button
          variant="ghost"
          onClick={() => { localStorage.setItem('hideProfilePrompt','1'); setDismissed(true); }}
        >
          Dismiss
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Tell us your name and company to personalize proposals, emails, and dashboards.
        </p>
        {/* Reuse the existing ProfileCard; when you hit Save there, call refresh() */}
        <ProfileCard onSaved={refresh} />
      </CardContent>
    </Card>
  );
}