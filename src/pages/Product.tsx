import { Bot, Settings, FileText } from "lucide-react";

export default function Product() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>
      
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">Product</h1>
          <p className="text-xl text-slate-300 mb-4">Everything you need to automate real work.</p>
          <p className="text-slate-400">
            <span className="text-cyan-400">EcoNest</span> is built around three core building blocks.
          </p>
          <p className="text-slate-400">Use them together or on their own.</p>
        </div>

        <div className="space-y-12">
          {/* AI Agents */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <Bot className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">AI Agents</h2>
            </div>
            
            <p className="text-slate-300 mb-6">Autonomous assistants that act on your behalf.</p>
            
            <div className="mb-6">
              <p className="text-slate-400 mb-4">They can:</p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  respond to events
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  make decisions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  trigger workflows
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  assist with daily operations
                </li>
              </ul>
            </div>
            
            <p className="text-slate-500 text-sm">Agents are configured and managed inside your dashboard.</p>
          </div>

          {/* Automations */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <Settings className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Automations</h2>
            </div>
            
            <p className="text-slate-300 mb-6">Reliable workflows that connect your tools.</p>
            
            <div className="mb-6">
              <p className="text-slate-400 mb-4">Automations:</p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  move data between systems
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  trigger actions automatically
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  reduce manual steps
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  run quietly in the background
                </li>
              </ul>
            </div>
            
            <p className="text-slate-500 text-sm">Built on proven infrastructure. No brittle scripts.</p>
          </div>

          {/* Templates */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Templates</h2>
            </div>
            
            <p className="text-slate-300 mb-6">Prebuilt systems you can launch fast.</p>
            
            <div className="mb-6">
              <p className="text-slate-400 mb-4">Templates combine agents + automations into ready-to-use solutions.</p>
              <p className="text-slate-400 mb-4">They are designed to be:</p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  installed in minutes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  customizable
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  production-ready
                </li>
              </ul>
            </div>
            
            <div className="mb-6">
              <p className="text-slate-400 mb-2">Most users start here.</p>
              <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Browse templates →
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-16 pt-8 border-t border-white/10">
          <p className="text-slate-500 text-sm">Product features are accessed through your dashboard and templates.</p>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-xs text-slate-600">
            Built with ❤️ <span className="text-cyan-400">Lovable</span>
          </p>
        </div>
      </div>
    </div>
  );
}