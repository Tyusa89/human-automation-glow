import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, DollarSign, UserPlus, Calendar, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const activities = [
  { 
    type: "income_added", 
    title: "Payment received", 
    detail: "$450 from Sarah Chen",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    icon: DollarSign,
    color: "text-green-600"
  },
  { 
    type: "lead_created", 
    title: "New lead", 
    detail: "Marcus from TechCorp submitted contact form",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    icon: UserPlus,
    color: "text-blue-600"
  },
  { 
    type: "appointment_booked", 
    title: "Appointment booked", 
    detail: "David Kim - Tomorrow at 2:00 PM",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    icon: Calendar,
    color: "text-purple-600"
  },
  { 
    type: "note_added", 
    title: "Note added", 
    detail: "Follow-up notes for Emily Rivera",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    icon: FileText,
    color: "text-amber-600"
  },
];

export function ActivityFeed() {
  return (
    <Card className="border-white/10 bg-[hsl(220,91%,15%)]/80 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-white">
          <Activity className="h-4 w-4" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, i) => {
            const Icon = activity.icon;
            return (
              <div key={i} className="flex items-start gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/10 ${activity.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{activity.title}</p>
                  <p className="text-xs text-slate-400 truncate">{activity.detail}</p>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}