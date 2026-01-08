import { Star, Calendar, Users, BarChart3 } from "lucide-react";

const solutions = [
  {
    id: "lead-intake",
    title: "Lead Intake & Qualification",
    description: "Automatically capture, qualify, and route leads.",
    icon: Star,
    iconColor: "text-emerald-400",
    features: [
      "form submissions",
      "schedule booking",
      "AI-assisted qualification", 
      "instant follow-ups"
    ],
    note: "Built using templates and workflows."
  },
  {
    id: "appointment-booking",
    title: "Appointment Booking",
    description: "Let clients book without back-and-forth.",
    icon: Calendar,
    iconColor: "text-blue-400",
    features: [
      "scheduling",
      "reminders", 
      "calendar sync",
      "confirmations"
    ],
    note: "Built using view or kit."
  },
  {
    id: "customer-onboarding",
    title: "Customer Onboarding",
    description: "Move new customers from signup to success.",
    icon: Users,
    iconColor: "text-purple-400",
    features: [
      "welcome messages",
      "data collection",
      "task creation",
      "follow-up automation"
    ],
    note: "No manual delays."
  },
  {
    id: "revenue-tracking",
    title: "Revenue & Activity Tracking",
    description: "See what is happening without digging.",
    icon: BarChart3,
    iconColor: "text-yellow-400",
    features: [
      "dashboards",
      "weekly summaries",
      "activity feeds",
      "performance signals"
    ],
    note: "Integrated to your stack."
  }
];

export default function Solutions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Solutions</h1>
          <p className="text-lg text-slate-300 mb-4">
            Common problems. Proven setups.
          </p>
          <p className="text-slate-400 max-w-2xl mx-auto">
            EcoNest is flexible by design but most users come in with a problem to solve.
            Here are some of the most common.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="space-y-12">
          {solutions.map((solution) => {
            const IconComponent = solution.icon;
            return (
              <div
                key={solution.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${solution.iconColor}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-white mb-3">
                      {solution.title}
                    </h3>
                    <p className="text-slate-300 mb-6">
                      {solution.description}
                    </p>

                    {/* Features */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {solution.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-slate-400"
                        >
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Note */}
                    <p className="text-sm text-slate-500 italic">
                      {solution.note}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-white/10">
          <p className="text-slate-400 mb-4">
            Browse templates to get started →
          </p>
          <p className="text-sm text-slate-500">
            Solutions are implemented using templates and dashboard components.
          </p>
        </div>
      </div>
    </div>
  );
}