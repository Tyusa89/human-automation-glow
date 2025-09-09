import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface ProductFormProps {
  productType: "Visual Flow Designer" | "Agent Studio" | "Data Hub" | "Governance";
  onClose: () => void;
}

export function ProductForm({ productType, onClose }: ProductFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    timeline: "",
    budget: "",
    description: "",
    prompts: "",
    integrations: "",
    volume: "",
    compliance: "",
    specific: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the data to your backend
    console.log("Form submitted:", { productType, ...formData });
    
    toast({
      title: "Request Submitted",
      description: `Your ${productType} requirements have been submitted. We'll contact you soon!`,
    });
    
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderSpecificFields = () => {
    switch (productType) {
      case "Visual Flow Designer":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="triggers">Desired Triggers</Label>
              <Textarea
                id="triggers"
                placeholder="Describe what events should trigger your workflows (e.g., new form submission, email received, time-based)"
                value={formData.specific}
                onChange={(e) => handleChange("specific", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="actions">Required Actions</Label>
              <Textarea
                id="actions"
                placeholder="What actions should the workflow perform (e.g., send emails, update CRM, create tasks)"
                value={formData.prompts}
                onChange={(e) => handleChange("prompts", e.target.value)}
              />
            </div>
          </>
        );
      
      case "Agent Studio":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="agent-goals">Agent Goals & Objectives</Label>
              <Textarea
                id="agent-goals"
                placeholder="What should your AI agent accomplish? (e.g., qualify leads, provide support, answer questions)"
                value={formData.specific}
                onChange={(e) => handleChange("specific", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prompts">AI Prompts & Instructions</Label>
              <Textarea
                id="prompts"
                placeholder="Provide example prompts or instructions for your AI agent..."
                className="min-h-[120px]"
                value={formData.prompts}
                onChange={(e) => handleChange("prompts", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Desired Tone & Style</Label>
              <Select onValueChange={(value) => handleChange("volume", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      
      case "Data Hub":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="data-sources">Data Sources</Label>
              <Textarea
                id="data-sources"
                placeholder="What data sources do you need to connect? (e.g., Salesforce, Google Sheets, PostgreSQL)"
                value={formData.specific}
                onChange={(e) => handleChange("specific", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data-volume">Expected Data Volume</Label>
              <Select onValueChange={(value) => handleChange("volume", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select volume" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (&lt;10K records)</SelectItem>
                  <SelectItem value="medium">Medium (10K-100K records)</SelectItem>
                  <SelectItem value="large">Large (100K-1M records)</SelectItem>
                  <SelectItem value="enterprise">Enterprise (&gt;1M records)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sync-frequency">Sync Requirements</Label>
              <Textarea
                id="sync-frequency"
                placeholder="How often should data sync? Real-time, hourly, daily? Any specific requirements?"
                value={formData.prompts}
                onChange={(e) => handleChange("prompts", e.target.value)}
              />
            </div>
          </>
        );
      
      case "Governance":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="compliance">Compliance Requirements</Label>
              <Textarea
                id="compliance"
                placeholder="What compliance standards do you need? (e.g., GDPR, HIPAA, SOC 2)"
                value={formData.compliance}
                onChange={(e) => handleChange("compliance", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roles">User Roles & Permissions</Label>
              <Textarea
                id="roles"
                placeholder="Describe the different user roles and their required permissions"
                value={formData.specific}
                onChange={(e) => handleChange("specific", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="security">Security Requirements</Label>
              <Textarea
                id="security"
                placeholder="Any specific security requirements? (e.g., encryption, audit trails, rate limiting)"
                value={formData.prompts}
                onChange={(e) => handleChange("prompts", e.target.value)}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{productType} Requirements</CardTitle>
          <p className="text-sm text-muted-foreground">
            Tell us about your {productType.toLowerCase()} needs
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline</Label>
                <Select onValueChange={(value) => handleChange("timeline", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">ASAP</SelectItem>
                    <SelectItem value="1-month">Within 1 month</SelectItem>
                    <SelectItem value="3-months">Within 3 months</SelectItem>
                    <SelectItem value="6-months">Within 6 months</SelectItem>
                    <SelectItem value="exploring">Just exploring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range</Label>
              <Select onValueChange={(value) => handleChange("budget", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-5k">Under $5,000</SelectItem>
                  <SelectItem value="5k-25k">$5,000 - $25,000</SelectItem>
                  <SelectItem value="25k-100k">$25,000 - $100,000</SelectItem>
                  <SelectItem value="over-100k">Over $100,000</SelectItem>
                  <SelectItem value="discuss">Prefer to discuss</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your project and what you're trying to achieve..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="integrations">Required Integrations</Label>
              <Textarea
                id="integrations"
                placeholder="What systems/tools do you need to integrate with?"
                value={formData.integrations}
                onChange={(e) => handleChange("integrations", e.target.value)}
              />
            </div>

            {/* Product-specific fields */}
            {renderSpecificFields()}

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Submit Requirements
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}