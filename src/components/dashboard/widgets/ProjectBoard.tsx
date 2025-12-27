import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Kanban, Clock } from "lucide-react";

const projects = [
  { name: "Website Redesign", status: "in_progress", deadline: "Dec 30", client: "TechCorp" },
  { name: "Brand Identity", status: "review", deadline: "Jan 5", client: "StartupXYZ" },
  { name: "Marketing Materials", status: "todo", deadline: "Jan 10", client: "LocalBiz" },
];

const statusColors: Record<string, string> = {
  todo: "bg-muted text-muted-foreground",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  review: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  done: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

const statusLabels: Record<string, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  review: "In Review",
  done: "Done",
};

export function ProjectBoard() {
  return (
    <Card className="border-accent/20">
      <CardHeader className="pb-2 flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Kanban className="h-4 w-4" />
          Active Projects
        </CardTitle>
        <Badge variant="secondary">{projects.length}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {projects.map((project) => (
            <div key={project.name} className="p-3 rounded-lg border border-border/50 hover:border-border transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm font-medium">{project.name}</p>
                <Badge className={`text-xs ${statusColors[project.status]}`}>
                  {statusLabels[project.status]}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
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