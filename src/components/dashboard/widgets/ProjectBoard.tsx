import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Kanban, Clock } from "lucide-react";

const projects = [
  { name: "Website Redesign", status: "in_progress", deadline: "Dec 30", client: "TechCorp" },
  { name: "Brand Identity", status: "review", deadline: "Jan 5", client: "StartupXYZ" },
  { name: "Marketing Materials", status: "todo", deadline: "Jan 10", client: "LocalBiz" },
];

const statusColors: Record<string, string> = {
  todo: "bg-slate-500/20 text-slate-300",
  in_progress: "bg-blue-500/20 text-blue-400",
  review: "bg-amber-500/20 text-amber-400",
  done: "bg-emerald-500/20 text-emerald-400",
};

const statusLabels: Record<string, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  review: "In Review",
  done: "Done",
};

export function ProjectBoard() {
  return (
    <Card className="border-white/10 bg-[hsl(220,91%,15%)]/80 backdrop-blur">
      <CardHeader className="pb-2 flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-white">
          <Kanban className="h-4 w-4" />
          Active Projects
        </CardTitle>
        <Badge variant="secondary" className="bg-white/10 text-slate-300">{projects.length}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {projects.map((project) => (
            <div key={project.name} className="p-3 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm font-medium text-white">{project.name}</p>
                <Badge className={`text-xs border-0 ${statusColors[project.status]}`}>
                  {statusLabels[project.status]}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{project.client}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {project.deadline}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
