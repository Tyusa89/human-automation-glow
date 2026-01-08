import { Shield, FileText, Globe } from "lucide-react";

const trustFeatures = [
  {
    id: "compliance",
    title: "Compliance",
    description: "SOC 2 Type II, GDPR, data residency options.",
    icon: Shield,
    iconColor: "text-emerald-400"
  },
  {
    id: "data-controls",
    title: "Data Controls",
    description: "Row-Level Security, role-based access, PII redaction, secrets vault.",
    icon: FileText,
    iconColor: "text-blue-400"
  },
  {
    id: "deployment",
    title: "Deployment",
    description: "Multi-tenant cloud, VPC peering, or self-hosted for maximum control.",
    icon: Globe,
    iconColor: "text-purple-400"
  }
];

export default function Trust() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="container mx-auto px-6 py-24">
        {/* Header */}
        <div className="mb-16">
          <div className="text-sm text-slate-500 uppercase tracking-wider mb-4">
            GOVERNANCE FIRST
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Trust & Security
          </h1>
        </div>

        {/* Trust Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {trustFeatures.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/70 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${feature.iconColor}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                  </div>
                </div>
                
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Additional Information */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 max-w-2xl mx-auto">
            Enterprise-grade security and compliance built into every layer of the platform. 
            Your data security and privacy are our top priorities.
          </p>
        </div>
      </div>
    </div>
  );
}