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
    <Card className="border-white/10 bg-[hsl(220,91%,15%)]/80 backdrop-blur">
      <CardHeader className="pb-2 flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-white">
          <Users className="h-4 w-4" />
          Active Clients
        </CardTitle>
        <Badge variant="secondary" className="bg-white/10 text-slate-300">{clients.length}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {clients.map((client) => (
            <div key={client.name} className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-white/10 text-slate-300">
                  {client.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-white">{client.name}</p>
                <p className="text-xs text-slate-500">{client.lastContact}</p>
              </div>
              <Badge 
                variant={client.status === "active" ? "default" : "outline"}
                className={client.status === "active" ? "bg-emerald-500/20 text-emerald-400 border-0" : "border-white/20 text-slate-400"}
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
