import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Integration {
  id: string;
  user_id: string;
  provider: string;
  status: 'connected' | 'disconnected' | 'error';
  scopes: string[] | null;
  metadata: Record<string, any>;
  last_sync: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export const useIntegrations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: integrations, isLoading } = useQuery({
    queryKey: ['integrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Integration[];
    }
  });

  const connectMutation = useMutation({
    mutationFn: async (provider: string) => {
      const { data, error } = await supabase.functions.invoke('integration-connect', {
        body: { provider }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Connection failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const disconnectMutation = useMutation({
    mutationFn: async (provider: string) => {
      const { data, error } = await supabase.functions.invoke('integration-disconnect', {
        body: { provider }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast({
        title: "Disconnected",
        description: "Integration has been disconnected"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Disconnect failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const syncMutation = useMutation({
    mutationFn: async (provider: string) => {
      const { data, error } = await supabase.functions.invoke('integration-sync', {
        body: { provider }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast({
        title: "Sync started",
        description: "Integration sync has been initiated"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Sync failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const testMutation = useMutation({
    mutationFn: async (provider: string) => {
      const { data, error } = await supabase.functions.invoke('integration-test', {
        body: { provider }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Test successful",
        description: data.message || "Connection is working"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Test failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const getIntegration = (provider: string) => {
    return integrations?.find(i => i.provider === provider);
  };

  return {
    integrations,
    isLoading,
    getIntegration,
    connect: connectMutation.mutate,
    disconnect: disconnectMutation.mutate,
    sync: syncMutation.mutate,
    test: testMutation.mutate,
    isConnecting: connectMutation.isPending,
    isDisconnecting: disconnectMutation.isPending,
    isSyncing: syncMutation.isPending,
    isTesting: testMutation.isPending
  };
};
