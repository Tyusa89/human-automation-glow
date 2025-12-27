import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ListTodo } from "lucide-react";

const tasks = [
  { id: 1, title: "Send proposal to Marcus", priority: "high", done: false },
  { id: 2, title: "Review contract draft", priority: "medium", done: false },
  { id: 3, title: "Update project timeline", priority: "low", done: true },
  { id: 4, title: "Schedule team sync", priority: "medium", done: false },
];

export function TaskList() {
  const pendingCount = tasks.filter(t => !t.done).length;
  
  return (
    <Card className="border-white/10 bg-[hsl(220,91%,15%)]/80 backdrop-blur">
      <CardHeader className="pb-2 flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-white">
          <ListTodo className="h-4 w-4" />
          Tasks
        </CardTitle>
        <Badge variant="secondary" className="bg-white/10 text-slate-300">{pendingCount} pending</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Checkbox checked={task.done} className="border-white/30 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500" />
              <span className={`flex-1 text-sm ${task.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                {task.title}
              </span>
              <Badge 
                variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {task.priority}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}