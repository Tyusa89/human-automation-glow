import { motion } from "framer-motion";
import { Play, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Template } from '@/lib/templates';
import { useUserPlan } from '@/hooks/useUserPlan';
import { 
  type PlanTier,
  type Difficulty,
  getUpgradeLabel, 
  isTemplateLocked,
  getTemplateIdentity,
  sortTemplatesForGrid,
  DIFFICULTY_LABELS,
} from '@/config/templates/templateIdentity';

interface TemplatesGridProps {
  templates: Template[];
  onPreview: (templateId: string) => void;
  onScaffoldMessage: (message: string) => void;
}

// Get required plan from template identity map
function getRequiredPlan(templateId: string): PlanTier {
  const identity = getTemplateIdentity(templateId);
  return identity?.requiredPlan || "free";
}

// Get difficulty from template identity map
function getDifficulty(templateId: string): Difficulty {
  const identity = getTemplateIdentity(templateId);
  return identity?.difficulty || "beginner";
}

// Difficulty styling
const difficultyStyles: Record<Difficulty, string> = {
  beginner: "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40",
  intermediate: "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40",
  advanced: "bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/40",
};

// Tier badge styling
const tierBadgeStyles: Record<PlanTier, string> = {
  free: "",
  pro: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  business: "bg-purple-500/20 text-purple-400 border-purple-500/40",
};

export function TemplatesGrid({ templates, onPreview, onScaffoldMessage }: TemplatesGridProps) {
  const navigate = useNavigate();
  const { plan: userPlan, loading: planLoading } = useUserPlan();

  // Sort templates: unlocked first, then by tier, then difficulty, then name
  const sortedTemplateIds = sortTemplatesForGrid(
    templates.map(t => t.id),
    userPlan
  );

  // Map back to template objects
  const sortedTemplates = sortedTemplateIds
    .map(id => templates.find(t => t.id === id))
    .filter((t): t is Template => t !== undefined);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {sortedTemplates.map((t) => {
        const identity = getTemplateIdentity(t.id);
        const requiredPlan = getRequiredPlan(t.id);
        const difficulty = getDifficulty(t.id);
        const needsUpgrade = isTemplateLocked(requiredPlan, userPlan);
        
        // Show tier badge only if not free
        const showTierBadge = requiredPlan !== "free";

        return (
          <motion.div 
            key={t.id} 
            layout 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rounded-2xl bg-slate-900/90 border border-slate-700/50 p-5 backdrop-blur hover:border-slate-600/70 transition-all duration-300 flex flex-col h-full">
              
              {/* Header row: tier badge + difficulty badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  {showTierBadge && (
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${tierBadgeStyles[requiredPlan]}`}>
                      {requiredPlan === "pro" ? "Pro" : "Business"}
                    </span>
                  )}
                </div>
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${difficultyStyles[difficulty]}`}>
                  {DIFFICULTY_LABELS[difficulty]}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-white leading-tight mb-2">
                {identity?.name || t.title}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-slate-400 line-clamp-2 mb-5 flex-grow">
                {identity?.description || t.tagline || t.description}
              </p>

              {/* Action buttons - always same structure: Preview (left) + Primary action (right) */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate(`/templates/${t.id}`)}
                  className="inline-flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
                >
                  Preview
                </button>
                
                {needsUpgrade ? (
                  <button 
                    onClick={() => navigate('/pricing')}
                    className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      requiredPlan === "business" 
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

              {/* Upgrade note for locked templates */}
              {needsUpgrade && (
                <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                  {requiredPlan === "business" 
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
