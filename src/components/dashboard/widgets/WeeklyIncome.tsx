import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";

export function WeeklyIncome() {
  return (
    <Card className="border-accent/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">This Week's Income</p>
            <p className="text-2xl font-bold text-foreground">$1,240</p>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+$320 vs last week</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}