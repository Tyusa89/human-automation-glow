import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import { integrationProviders } from "@/lib/integration-providers";
import { cn } from "@/lib/utils";

interface OnboardingWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (selectedProviders: string[]) => void;
}

const useCases = [
  { id: 'tickets', label: 'Customer Support Tickets', providers: ['zendesk', 'slack'] },
  { id: 'bookings', label: 'Meeting & Bookings', providers: ['google-sheets', 'gmail'] },
  { id: 'billing', label: 'Billing & Payments', providers: ['stripe'] },
  { id: 'crm', label: 'CRM & Contacts', providers: ['hubspot', 'salesforce'] },
  { id: 'notifications', label: 'Team Notifications', providers: ['slack', 'twilio'] },
  { id: 'data', label: 'Data Management', providers: ['google-sheets', 'notion', 'postgres'] }
];

export function OnboardingWizard({ open, onOpenChange, onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);

  const toggleUseCase = (id: string) => {
    setSelectedUseCases(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleProvider = (id: string) => {
    setSelectedProviders(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step === 1) {
      // Get recommended providers from selected use cases
      const recommended = Array.from(
        new Set(
          useCases
            .filter(uc => selectedUseCases.includes(uc.id))
            .flatMap(uc => uc.providers)
        )
      );
      setSelectedProviders(recommended);
      setStep(2);
    }
  };

  const handleComplete = () => {
    onComplete(selectedProviders);
    onOpenChange(false);
    // Reset for next time
    setStep(1);
    setSelectedUseCases([]);
    setSelectedProviders([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? 'Choose Your Use Cases' : 'Connect Integrations'}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? 'Select what you want to accomplish and we\'ll recommend the right integrations.'
              : 'Connect the recommended integrations for your use cases.'}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              {useCases.map(useCase => (
                <button
                  key={useCase.id}
                  onClick={() => toggleUseCase(useCase.id)}
                  className={cn(
                    "p-4 border-2 rounded-lg text-left transition-all",
                    "hover:border-primary/50",
                    selectedUseCases.includes(useCase.id)
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-medium">{useCase.label}</span>
                    {selectedUseCases.includes(useCase.id) && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Skip
              </Button>
              <Button
                onClick={handleNext}
                disabled={selectedUseCases.length === 0}
              >
                Next
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Based on your selections, we recommend these integrations:
            </p>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {selectedProviders.map(providerId => {
                const provider = integrationProviders[providerId];
                if (!provider) return null;

                return (
                  <div
                    key={providerId}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProviders.includes(providerId)}
                      onChange={() => toggleProvider(providerId)}
                      className="h-4 w-4"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{provider.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {provider.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleComplete}>
                Connect Selected ({selectedProviders.length})
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
