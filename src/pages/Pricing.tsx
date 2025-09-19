import React, { useState } from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { pricing, addOns, faqItems } from "@/lib/site-data";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Pricing</h1>
          <p className="text-xl text-slate-400 mb-8">Simple plans that scale with you. Switch anytime.</p>
          
          {/* Toggle */}
          <div className="inline-flex items-center bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                !isYearly 
                  ? "bg-primary text-white" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                isYearly 
                  ? "bg-primary text-white" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-slate-700 px-2 py-1 rounded">save</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pricing.map((tier) => (
            <Card 
              key={tier.name} 
              className={`relative bg-slate-800 border-slate-700 ${
                tier.popular ? "border-primary border-2" : ""
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-white px-3 py-1">Most popular</Badge>
                </div>
              )}
              
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-xl">{tier.name}</CardTitle>
                <p className="text-slate-400 text-sm">{tier.blurb}</p>
                <div className="text-white">
                  {tier.name === "Starter" ? (
                    <span className="text-3xl font-bold">Free</span>
                  ) : (
                    <div>
                      <span className="text-3xl font-bold">
                        ${isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                      </span>
                      <span className="text-slate-400">/mo</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {tier.features.map((feature, index) => {
                  const featureLabels = [
                    "Templates", "Events", "Seats", "Webhooks", 
                    "Docs", "Automation", "Support", "Security"
                  ];
                  return (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-300 font-medium">{featureLabels[index]}: </span>
                        <span className="text-slate-400">{feature}</span>
                      </div>
                    </div>
                  );
                })}
                
                <div className="pt-4">
                  <Button 
                    variant={tier.buttonVariant as "default" | "outline"}
                    className={`w-full ${
                      tier.popular 
                        ? "bg-primary hover:bg-primary/90 text-white" 
                        : "border-slate-600 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {tier.buttonText}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add-ons */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Add-ons</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {addOns.map((addon) => (
              <Card key={addon.name} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white">{addon.name}</h3>
                    <span className="text-primary font-bold">{addon.price}</span>
                  </div>
                  <p className="text-slate-400 text-sm">{addon.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">FAQ</h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-slate-800 border-slate-700 rounded-lg px-6"
              >
                <AccordionTrigger className="text-white hover:text-primary">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-400">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Footer note */}
        <p className="text-xs text-slate-500 text-center mt-12">
          * Features and limits are defaults. Enterprise add-ons available on request.
        </p>
      </div>
    </div>
  );
}