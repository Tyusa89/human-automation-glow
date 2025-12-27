import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

const clients = [
  { name: "Sarah Chen", status: "active", lastContact: "2 days ago" },
  { name: "Marcus Johnson", status: "active", lastContact: "1 week ago" },
  { name: "Emily Rivera", status: "pending", lastContact: "3 days ago" },
  { name: "David Kim", status: "active", lastContact: "Today" },
];

export function ClientList() {
  return (
    <Card className="border-accent/20">
      <CardHeader className="pb-2 flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Users className="h-4 w-4" />
          Active Clients
        </CardTitle>
        <Badge variant="secondary">{clients.length}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {clients.map((client) => (
            <div key={client.name} className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-muted">
                  {client.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{client.name}</p>
                <p className="text-xs text-muted-foreground">{client.lastContact}</p>
              </div>
              <Badge 
                variant={client.status === "active" ? "default" : "outline"}
                className="text-xs"
              >
                {client.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}