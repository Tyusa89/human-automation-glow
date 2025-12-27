import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";

const appointments = [
  { client: "Sarah Chen", time: "10:00 AM", service: "Consultation", location: "Office" },
  { client: "David Kim", time: "2:00 PM", service: "Follow-up", location: "Video call" },
  { client: "Lisa Park", time: "4:30 PM", service: "Initial meeting", location: "Coffee shop" },
];

export function AppointmentsToday() {
  return (
    <Card className="border-accent/20">
      <CardHeader className="pb-2 flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Today's Appointments
        </CardTitle>
        <Badge variant="secondary">{appointments.length}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {appointments.map((apt, i) => (
            <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Clock className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{apt.time}</p>
                  <Badge variant="outline" className="text-xs">{apt.service}</Badge>
                </div>
                <p className="text-sm text-foreground">{apt.client}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {apt.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}