import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProfileCardProps {
  onSaved?: () => void;
}

export default function ProfileCard({ onSaved }: ProfileCardProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');

  useEffect(() => {
    (async () => {
      // get current user
      const { data: u } = await supabase.auth.getUser();
      const user = u?.user;
      if (!user) return;

      // fetch or bootstrap profile
      const { data: row } = await supabase
        .from('profiles')
        .select('id,email,full_name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!row) {
        const { data: inserted } = await supabase
          .from('profiles')
          .insert({ user_id: user.id, email: user.email ?? '' })
          .select('id,email,full_name')
          .single();
        if (inserted) {
          setId(inserted.id); setEmail(inserted.email || '');
          setFullName(inserted.full_name || ''); setCompany('');
        }
      } else {
        setId(row.id); setEmail(row.email || '');
        setFullName(row.full_name || ''); setCompany('');
      }
      setLoading(false);
    })();
  }, []);

  async function save() {
    if (!id) return;
    setSaving(true);
    await supabase.from('profiles').update({
      full_name: fullName || null,
      company: company || null
    }).eq('id', id);
    setSaving(false);
    onSaved?.();
  }

  if (loading) return null;

  return (
    <Card className="border-accent/20">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm block mb-1">Email</label>
          <Input value={email} disabled />
        </div>
        <div>
          <label className="text-sm block mb-1">Full name</label>
          <Input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Jane Doe" />
        </div>
        <div>
          <label className="text-sm block mb-1">Company</label>
          <Input value={company} onChange={e=>setCompany(e.target.value)} placeholder="EcoNest AI" />
        </div>
        <Button onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </CardContent>
    </Card>
  );
}