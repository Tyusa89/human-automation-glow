import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Mail, Clock } from "lucide-react";

const followUps = [
  { name: "Marcus Johnson", reason: "Proposal sent", daysAgo: 3, overdue: true },
  { name: "Emily Rivera", reason: "Meeting follow-up", daysAgo: 1, overdue: false },
  { name: "Alex Thompson", reason: "Invoice reminder", daysAgo: 5, overdue: true },
];

export function FollowUpQueue() {
  const overdueCount = followUps.filter(f => f.overdue).length;
  
  return (
    <Card className="border-accent/20">
      <CardHeader className="pb-2 flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <UserCheck className="h-4 w-4" />
          Follow-up Queue
        </CardTitle>
        {overdueCount > 0 && (
          <Badge variant="destructive" className="text-xs">
            {overdueCount} overdue
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {followUps.map((item) => (
            <div key={item.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {item.reason} · {item.daysAgo}d ago
                </p>
              </div>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}