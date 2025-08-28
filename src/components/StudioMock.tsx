import { Bot, Workflow, Database, Puzzle, Globe, Shield, Zap } from "lucide-react";

const nodes = [
  { icon: <Bot className="h-5 w-5" />, label: "Agent" },
  { icon: <Workflow className="h-5 w-5" />, label: "Flow" },
  { icon: <Database className="h-5 w-5" />, label: "Data" },
  { icon: <Puzzle className="h-5 w-5" />, label: "Integration" },
  { icon: <Globe className="h-5 w-5" />, label: "Channel" },
  { icon: <Shield className="h-5 w-5" />, label: "Policy" },
];

export default function StudioMock() {
  return (
    <div className="bg-card border rounded-2xl shadow-sm p-4">
      <div className="text-sm text-muted-foreground mb-2">Visual Automation Studio</div>
      <div className="grid grid-cols-3 gap-3">
        {nodes.map((n, i) => (
          <div key={i} className="border rounded-xl p-3 bg-muted">
            <div className="flex items-center gap-2 text-foreground">
              {n.icon}
              <span className="text-xs">{n.label}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
        <Zap className="h-4 w-4" /> Drag, connect, and publish without code
      </div>
    </div>
  );
}