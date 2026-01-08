import { ArrowLeft, Check, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const features = [
  "AI Business Assistant",
  "Automated workflows & execution", 
  "Dashboards & insights",
  "Client & task intelligence",
  "Fair-use AI included",
  "Secure billing • Cancel anytime"
];

const faqItems = [
  {
    question: "What does 'fair-use AI included' mean?",
    answer: "Fair-use AI means you get reasonable access to AI features for typical business usage without additional per-request charges. Heavy computational tasks may have limits to ensure service quality for all users."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time through your account settings. There are no cancellation fees or long-term contracts required."
  },
  {
    question: "Do you offer annual pricing?",
    answer: "Currently we offer month-to-month pricing for maximum flexibility. Annual pricing options may become available in the future."
  }
];

export default function Pricing() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="container mx-auto px-6 py-16">
        {/* Back to Dashboard Link */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-sm font-semibold text-amber-500 mb-4 tracking-wider">
            [CONNECT AI]
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            One plan. Full access.
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-8">
            EcoNest is a premium AI operating system for serious businesses. Activate your
            subscription to unlock AI agents, automations, and execution.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button className="px-6 py-2 bg-white/10 border border-white/20 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">
              All-inclusive
            </button>
            <button className="px-6 py-2 bg-white/10 border border-white/20 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">
              Fair-use AI included
            </button>
            <button className="px-6 py-2 bg-white/10 border border-white/20 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">
              Cancel anytime
            </button>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto mb-16">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            {/* Plan Title */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                EcoNest AI — Business
              </h3>
              <p className="text-slate-400 text-sm">
                All-inclusive access to EcoNest's AI-powered business operating system.
              </p>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">$49</span>
                <span className="text-slate-400">/month</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Start free trial (no automation first 5 demos)
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* Status */}
            <div className="text-center mb-6">
              <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg py-3 px-4 mb-4">
                <span className="text-emerald-400 font-medium">You're subscribed</span>
              </div>
              <button className="w-full py-3 px-4 bg-white/10 border border-white/20 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">
                Manage subscription
              </button>
            </div>

            {/* Disclaimer */}
            <div className="text-center">
              <p className="text-xs text-slate-500">
                💡 No one way EcoNest is designed to be used daily by commercial operators.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">FAQ</h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="text-white font-medium">{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      expandedFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}