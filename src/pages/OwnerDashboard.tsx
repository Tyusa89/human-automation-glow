export default function OwnerDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>
      
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-white">EcoNest Owner Dashboard</h1>
            <p className="text-slate-400 mt-1">Private overview of team, templates, and agent activity. Visible only to your signed-in owner account.</p>
          </div>
          <div className="text-sm text-slate-400">
            Signed in as <span className="text-cyan-400">owner@gmail.com</span>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
            <h3 className="text-sm font-medium text-slate-400 mb-2">TOTAL LEADS</h3>
            <div className="text-3xl font-bold text-white mb-2">0</div>
            <div className="text-xs text-slate-500">New • In Warm • Customers {}</div>
          </div>
          
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
            <h3 className="text-sm font-medium text-slate-400 mb-2">ACTIVE CLIENTS</h3>
            <div className="text-3xl font-bold text-white mb-2">18</div>
            <div className="text-xs text-slate-500">Owned by you {}</div>
          </div>
          
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
            <h3 className="text-sm font-medium text-slate-400 mb-2">RECENT ACTIVITY</h3>
            <div className="text-3xl font-bold text-white mb-2">0</div>
            <div className="text-xs text-slate-500">Logged events (last 72h)</div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lead Funnel */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Lead Funnel Snapshot</h3>
            <p className="text-slate-400 text-sm mb-6">Quick breakdown of leads stuck late in the pipeline.</p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-xl font-bold text-white">0</div>
                <div className="text-xs text-slate-400 mt-1">NEW</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">0</div>
                <div className="text-xs text-slate-400 mt-1">IN WARM</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">0</div>
                <div className="text-xs text-slate-400 mt-1">CUSTOMERS</div>
              </div>
            </div>
          </div>

          {/* Templates Overview */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Templates Overview</h3>
            <p className="text-slate-400 text-sm mb-6">Active or favorite templates or latest activity submitted for your account.</p>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-300 text-sm">Total active templates</span>
                <span className="text-cyan-400 font-semibold">16</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-300 text-sm">Templates you own</span>
                <span className="text-emerald-400 font-semibold">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Agent Events */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Agent Events</h3>
          <p className="text-slate-400 text-sm mb-6">Your AI agents and friends agent logged chats (last mistake, etc.)</p>
          <div className="text-center py-8 text-slate-500">
            No recent events logged yet. Once your EcoNest agent starts training bots, they'll appear here.
          </div>
        </div>

        {/* EcoNest Agent */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-white mb-2">EcoNest Agent (Owner Assistant)</h3>
          <p className="text-slate-400 text-sm mb-6">Use natural language queries about your leads, prospects, and record automation setup.</p>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-sm text-slate-300">Music: <span className="text-cyan-400">Business Assistant</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300">Speaker: <span className="text-cyan-400">EcoNest Steward</span></span>
            </div>
          </div>
          
          <div className="bg-slate-900/50 rounded-2xl p-4 mb-4">
            <div className="text-slate-300 text-sm">Ready to chat. Type your message below.</div>
          </div>
          
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
              Send
            </button>
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Press Ctrl or Cmd + Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}