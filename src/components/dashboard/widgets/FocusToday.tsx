import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, CheckCircle2 } from "lucide-react";

export function FocusToday() {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Target className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Your top priority today:</p>
            <p className="font-semibold text-foreground">Follow up with 3 pending client responses</p>
          </div>
          <Button size="sm" variant="outline" className="gap-1">
            <CheckCircle2 className="h-4 w-4" />
            Done
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}