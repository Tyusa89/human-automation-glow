import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp } from "lucide-react";

export function MonthlyIncome() {
  return (
    <Card className="border-accent/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Monthly Total</p>
            <p className="text-2xl font-bold text-foreground">$4,850</p>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+12% vs last month</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Wallet className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}