import { Link } from "react-router-dom";
import { 
  UserCheck, Calendar, Users, BarChart3, ArrowRight 
} from "lucide-react";

export default function SolutionsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Solutions</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Common problems. Proven setups.
        </p>
        <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
          EcoNest is flexible by design, but most users come in with a problem to solve.
          These are some of the most common.
        </p>
      </div>

      {/* Lead Intake & Qualification */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <UserCheck className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-white">Lead Intake & Qualification</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Automatically capture, qualify, and route leads.
        </p>
        <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
          <li>• form submissions</li>
          <li>• calendar bookings</li>
          <li>• AI-assisted qualification</li>
          <li>• instant follow-ups</li>
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">
          Built using templates and workflows.
        </p>
      </section>

      {/* Appointment Booking */}
      <section className="mb-12 pt-8 border-t border-border/40">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-white">Appointment Booking</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Let clients book without back-and-forth.
        </p>
        <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
          <li>• scheduling</li>
          <li>• reminders</li>
          <li>• calendar sync</li>
          <li>• confirmations</li>
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">
          Runs quietly once set up.
        </p>
      </section>

      {/* Customer Onboarding */}
      <section className="mb-12 pt-8 border-t border-border/40">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-white">Customer Onboarding</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Move new customers from signup to success.
        </p>
        <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
          <li>• welcome messages</li>
          <li>• data collection</li>
          <li>• task creation</li>
          <li>• follow-up automation</li>
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">
          No manual chasing.
        </p>
      </section>

      {/* Revenue & Activity Tracking */}
      <section className="mb-12 pt-8 border-t border-border/40">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-white">Revenue & Activity Tracking</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          See what is happening without digging.
        </p>
        <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
          <li>• dashboards</li>
          <li>• weekly summaries</li>
          <li>• activity feeds</li>
          <li>• performance signals</li>
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">
          Personalized to how you work.
        </p>
      </section>

      {/* CTA */}
      <div className="pt-8 border-t border-border/40 text-center">
        <Link
          to="/templates"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Browse templates to get started
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <p className="mt-4 text-xs text-muted-foreground">
          Solutions are implemented using templates and dashboard configurations.
        </p>
      </div>
    </main>
  );
}
