import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type PlanTier } from '@/config/templates/templateIdentity';

interface UserPlanState {
  plan: PlanTier;
  loading: boolean;
  subscriptionEnd: string | null;
}

/**
 * Hook to check user's current subscription plan.
 * For now, derives from user_templates ownership - users with active templates
 * are considered to have access. In production, this would check Stripe.
 */
export function useUserPlan(): UserPlanState {
  const [state, setState] = useState<UserPlanState>({
    plan: 'free',
    loading: true,
    subscriptionEnd: null,
  });

  useEffect(() => {
    let mounted = true;

    async function checkPlan() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (mounted) setState({ plan: 'free', loading: false, subscriptionEnd: null });
        return;
      }

      // Check user_templates for any active template with stripe info
      const { data: templates } = await supabase
        .from('user_templates')
        .select('stripe_subscription_id, template_id, templates(config)')
        .eq('user_id', user.id)
        .eq('is_active', true);

      // For now, determine plan based on owned templates
      // In production: call check-subscription edge function
      let detectedPlan: PlanTier = 'free';
      
      if (templates && templates.length > 0) {
        // Check if any template requires higher tier
        for (const ut of templates) {
          const config = (ut.templates as any)?.config;
          const required = config?.requiredPlan as string | undefined;
          if (required === 'business') {
            detectedPlan = 'business';
            break;
          } else if (required === 'pro' && detectedPlan === 'free') {
            detectedPlan = 'pro';
          }
        }

        // If user has any active template with stripe subscription, assume at least pro
        const hasStripe = templates.some(t => t.stripe_subscription_id);
        if (hasStripe && detectedPlan === 'free') {
          detectedPlan = 'pro';
        }
      }

      if (mounted) {
        setState({
          plan: detectedPlan,
          loading: false,
          subscriptionEnd: null,
        });
      }
    }

    checkPlan();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      if (mounted) checkPlan();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}

/**
 * Check if a user's plan meets the required plan level.
 */
export function planMeetsRequirement(userPlan: PlanTier, requiredPlan: PlanTier | undefined): boolean {
  if (!requiredPlan || requiredPlan === 'free') return true;
  
  const planOrder: Record<PlanTier, number> = {
    free: 0,
    pro: 1,
    business: 2,
  };

  return planOrder[userPlan] >= planOrder[requiredPlan];
}
