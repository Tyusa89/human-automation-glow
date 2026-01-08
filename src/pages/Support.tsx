import { BookOpen, Settings, Plug, AlertTriangle, HelpCircle, ArrowRight } from "lucide-react";

export default function Support() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Support</h1>
          <p className="text-xl text-slate-300 mb-4">
            Help when you need it — out of the way when you don't.
          </p>
          <p className="text-slate-400">
            Everything here is designed to get you unstuck quickly and back to work.
          </p>
        </div>

        {/* START HERE Section */}
        <div className="mb-12">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
            START HERE
          </h2>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <BookOpen className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-3">Getting Started</h3>
                <p className="text-slate-400 mb-4">
                  New to EcoNest or setting something up for the first time.
                </p>
                <ul className="text-sm text-slate-400 space-y-1 mb-4">
                  <li>• account basics</li>
                  <li>• connecting tools</li>
                  <li>• understanding the dashboard</li>
                </ul>
                <button className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium">
                  Start here <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CORE GUIDES Section */}
        <div className="mb-12">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
            CORE GUIDES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Templates */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <div className="p-2 bg-blue-500/20 rounded-lg w-fit mb-4">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Templates</h3>
              <p className="text-slate-400 text-sm mb-3">
                Understand workflows and how to customize them.
              </p>
              <ul className="text-xs text-slate-500 space-y-1 mb-4">
                <li>• customization</li>
                <li>• configurations</li>
                <li>• marketplace</li>
                <li>• suggestions</li>
              </ul>
              <button className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium">
                Template guides <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Automations */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <div className="p-2 bg-purple-500/20 rounded-lg w-fit mb-4">
                <Settings className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Automations</h3>
              <p className="text-slate-400 text-sm mb-3">
                Understand workflows, triggers, and background behavior.
              </p>
              <ul className="text-xs text-slate-500 space-y-1 mb-4">
                <li>• how automations run</li>
                <li>• delays and retries</li>
                <li>• respond between</li>
              </ul>
              <button className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium">
                Automation guides <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Integrations */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <div className="p-2 bg-orange-500/20 rounded-lg w-fit mb-4">
                <Plug className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Integrations</h3>
              <p className="text-slate-400 text-sm mb-3">
                Connect EcoNest to the tools you already use.
              </p>
              <ul className="text-xs text-slate-500 space-y-1 mb-4">
                <li>• calendars</li>
                <li>• forms</li>
                <li>• CRMs</li>
                <li>• marketing tools</li>
              </ul>
              <button className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium">
                Integration guides <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* WHEN SOMETHING DOES NOT WORK Section */}
        <div className="mb-12">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
            WHEN SOMETHING DOES NOT WORK
          </h2>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-3">Troubleshooting</h3>
                <p className="text-slate-400 mb-4">
                  Quick fixes for common issues.
                </p>
                <ul className="text-sm text-slate-400 space-y-1 mb-4">
                  <li>• integrations not syncing</li>
                  <li>• missing data</li>
                  <li>• automation delays</li>
                </ul>
                <p className="text-slate-500 text-sm mb-4">
                  Most issues can be resolved in a few minutes.
                </p>
                <button className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium">
                  Troubleshooting <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Still need help? Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">Still need help?</h2>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <p className="text-slate-400 mb-4">
              If you have checked the guides and things still are not clear:
            </p>
            <ul className="text-sm text-slate-400 space-y-1 mb-4">
              <li>• contact support</li>
              <li>• include what you were trying to do</li>
              <li>• screenshots help</li>
            </ul>
            <p className="text-slate-400 mb-4">
              We will help you get back to work.
            </p>
            <button className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium">
              Contact support <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-slate-500 text-sm">
            EcoNest is designed to work quietly in the background. Most users will not need support often.
          </p>
        </div>
      </div>
    </div>
  );
}