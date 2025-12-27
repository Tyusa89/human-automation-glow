import { motion } from "framer-motion";
import { Play, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Template } from '@/lib/templates';
import { useUserPlan } from '@/hooks/useUserPlan';
import { 
  type RequiredPlan, 
  getUpgradeLabel, 
  isTemplateLocked,
  getTemplateIdentity 
} from '@/config/templates/templateIdentity';

interface TemplatesGridProps {
  templates: Template[];
  onPreview: (templateId: string) => void;
  onScaffoldMessage: (message: string) => void;
}

// Get required plan from template identity map (not from badges)
function getRequiredPlan(template: Template): RequiredPlan {
  const identity = getTemplateIdentity(template.id);
  return identity?.requiredPlan || "free";
}

// Difficulty styling
const difficultyStyles = {
  Beginner: "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40",
  Intermediate: "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40",
  Advanced: "bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/40",
} as const;

// Category badge styling  
const categoryStyles = {
  Easy: "border-sky-500/50 text-sky-400",
  Popular: "border-amber-500/50 text-amber-400",
  Advanced: "border-purple-500/50 text-purple-400",
} as const;

// Tier badge styling
const tierBadgeStyles = {
  pro: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  business: "bg-purple-500/20 text-purple-400 border-purple-500/40",
  enterprise: "bg-rose-500/20 text-rose-400 border-rose-500/40",
} as const;

// Sort order for difficulty
const difficultyOrder = { Beginner: 0, Intermediate: 1, Advanced: 2 };

export function TemplatesGrid({ templates, onPreview, onScaffoldMessage }: TemplatesGridProps) {
  const navigate = useNavigate();
  const { plan: userPlan, loading: planLoading } = useUserPlan();

  // Sort templates by difficulty: Beginner → Intermediate → Advanced
  const sortedTemplates = [...templates].sort((a, b) => {
    const orderA = difficultyOrder[(a.difficulty || "Beginner") as keyof typeof difficultyOrder] ?? 0;
    const orderB = difficultyOrder[(b.difficulty || "Beginner") as keyof typeof difficultyOrder] ?? 0;
    return orderA - orderB;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {sortedTemplates.map((t) => {
        const requiredPlan = getRequiredPlan(t);
        const needsUpgrade = isTemplateLocked(requiredPlan, userPlan);
        const difficulty = t.difficulty || "Beginner";
        
        // Get category badges (Easy, Popular, Advanced)
        const categoryBadges = t.badges?.filter(b => 
          ["Easy", "Popular", "Advanced"].includes(b)
        ) || [];
        
        // Check for tier badges
        const hasPro = t.badges?.some(b => b.toLowerCase() === "pro");
        const hasBusiness = t.badges?.some(b => b.toLowerCase() === "business");
        const hasEnterprise = t.badges?.some(b => b.toLowerCase() === "enterprise");

        return (
          <motion.div 
            key={t.id} 
            layout 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rounded-2xl bg-slate-900/90 border border-slate-700/50 p-5 backdrop-blur hover:border-slate-600/70 transition-all duration-300 flex flex-col h-full">
              
              {/* Header row: category badges + tier badges */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  {categoryBadges.map((badge, i) => (
                    <span 
                      key={`${t.id}-cat-${i}`}
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
                        categoryStyles[badge as keyof typeof categoryStyles] || categoryStyles.Easy
                      }`}
                    >
                      {badge}
                    </span>
                  ))}
                  {hasPro && (
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${tierBadgeStyles.pro}`}>
                      Pro
                    </span>
                  )}
                  {hasBusiness && (
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${tierBadgeStyles.business}`}>
                      Business
                    </span>
                  )}
                  {hasEnterprise && (
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${tierBadgeStyles.enterprise}`}>
                      Enterprise
                    </span>
                  )}
                </div>
              </div>

              {/* Title row with difficulty badge */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-lg font-semibold text-white leading-tight">
                  {t.title}
                </h3>
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${
                  difficultyStyles[difficulty as keyof typeof difficultyStyles] || difficultyStyles.Beginner
                }`}>
                  {difficulty}
                </span>
              </div>
              
              {/* Description */}
              <p className="text-sm text-slate-400 line-clamp-2 mb-5 flex-grow">
                {t.tagline || t.description}
              </p>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onPreview(t.id)}
                  className="inline-flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
                >
                  Preview
                </button>
                
                {needsUpgrade ? (
                  <button 
                    onClick={() => navigate('/pricing')}
                    className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      requiredPlan === "enterprise"
                        ? "border-rose-500/50 text-rose-400 hover:bg-rose-500/10"
                        : requiredPlan === "business" 
                        ? "border-purple-500/50 text-purple-400 hover:bg-purple-500/10" 
                        : "border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                    }`}
                  >
                    <Lock className="h-3.5 w-3.5" />
                    {getUpgradeLabel(requiredPlan)}
                  </button>
                ) : (
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      navigate(`/templates/${encodeURIComponent(t.id)}/activate`); 
                    }} 
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Play className="h-3.5 w-3.5" />
                    Activate
                  </button>
                )}
              </div>

              {/* Upgrade note for templates user doesn't have access to */}
              {needsUpgrade && (
                <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                  {requiredPlan === "enterprise" 
                    ? "Enterprise plan includes white-glove onboarding, custom integrations, and SLA support."
                    : requiredPlan === "business" 
                    ? "Includes enterprise integrations, unlimited automations, and dedicated support."
                    : "Includes advanced workflows, automation limits, and priority support."
                  }
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
