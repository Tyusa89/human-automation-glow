import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { pricing, addOns, faqItems } from "@/lib/site-data";

export default function PricingPage() {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);

  const handleSelectPlan = (tierName: string, price: string | number) => {
    if (tierName === "Free") {
      navigate("/auth");
    } else {
      navigate(`/payment?plan=${tierName}&billing=${isYearly ? "yearly" : "monthly"}&price=${price}`);
    }
  };

  const getDotColor = (color: string) => {
    switch (color) {
      case "green": return "bg-emerald-500";
      case "orange": return "bg-amber-500";
      case "purple": return "bg-purple-500";
      case "cyan": return "bg-cyan-500";
      default: return "bg-slate-500";
    }
  };

  const getTextColor = (color: string) => {
    switch (color) {
      case "green": return "text-emerald-400";
      case "orange": return "text-amber-400";
      case "purple": return "text-purple-400";
      case "cyan": return "text-cyan-400";
      default: return "text-slate-400";
    }
  };

  const getButtonStyles = (variant: string) => {
    switch (variant) {
      case "orange":
        return "bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold border-0";
      case "purple":
        return "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold border-0";
      case "cyan":
        return "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-slate-900 font-semibold border-0";
      case "outline":
      default:
        return "bg-slate-800 border-slate-600 text-white hover:bg-slate-700 font-semibold";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium ${!isYearly ? "text-white" : "text-slate-400"}`}>
            Monthly
          </span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="data-[state=checked]:bg-emerald-500"
          />
          <span className={`text-sm font-medium ${isYearly ? "text-white" : "text-slate-400"}`}>
            Annual
          </span>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
            Save 17%
          </Badge>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pricing.map((tier) => (
            <Card 
              key={tier.name} 
              className={`relative bg-slate-800/50 border-slate-700/50 overflow-visible ${
                tier.popular ? "border-amber-500/50 border-2" : ""
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-amber-500 text-slate-900 px-4 py-1 font-semibold">
                    Most popular
                  </Badge>
                </div>
              )}
              
              <CardContent className="p-6 pt-8">
                {/* Status dot and tier name */}
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${getDotColor(tier.dotColor)}`} />
                  <span className={`text-sm font-medium ${getTextColor(tier.dotColor)}`}>
                    {tier.name}
                  </span>
                </div>

                {/* Display name */}
                <h2 className="text-3xl font-bold text-white mb-1">
                  {tier.displayName}
                </h2>
                
                {/* Blurb */}
                <p className="text-slate-400 text-sm mb-4">{tier.blurb}</p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">
                    ${isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                  </span>
                  <span className="text-slate-400 text-lg">
                    /{isYearly ? "year" : "month"}
                  </span>
                  {isYearly && tier.yearlyMonthly && (
                    <span className="text-emerald-400 text-sm ml-2">
                      (${tier.yearlyMonthly}/mo)
                    </span>
                  )}
                </div>

                {/* Includes section */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Includes
                  </p>
                  <div className="space-y-2">
                    {tier.includes.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${getTextColor(tier.dotColor)}`} />
                        <span className="text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Unlocked Templates section */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Unlocked Templates
                  </p>
                  <div className="space-y-2">
                    {tier.unlockedTemplates.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${getTextColor(tier.dotColor)}`} />
                        <span className="text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Limits section (only for Free tier) */}
                {tier.limits && tier.limits.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                      Limit
                    </p>
                    <div className="space-y-2">
                      {tier.limits.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <Lock className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-500" />
                          <span className="text-slate-400">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <Button 
                  onClick={() => handleSelectPlan(tier.name, isYearly ? tier.yearlyPrice : tier.monthlyPrice)}
                  className={`w-full py-6 ${getButtonStyles(tier.buttonVariant)}`}
                >
                  {tier.buttonText}
                </Button>

                {/* Helper text */}
                {tier.helperText && (
                  <p className="text-xs text-slate-500 text-center mt-3">
                    {tier.helperText}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add-ons */}
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Add-ons</h2>
            <p className="text-slate-400">Extend your Baseframe capabilities as your operations grow.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {addOns.map((addon) => (
              <Card key={addon.name} className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-white text-lg">{addon.name}</h3>
                    <span className="text-amber-400 font-bold whitespace-nowrap">{addon.price}</span>
                  </div>
                  <p className="text-slate-300 text-sm mb-4">{addon.description}</p>
                  <div className="space-y-2">
                    {addon.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                        <span className="text-slate-400">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-xs text-slate-500 text-center mt-6">
            Add-ons are optional and can be enabled at any time. Only pay for the scale and controls you need.
          </p>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">FAQ</h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-slate-800/50 border-slate-700/50 rounded-lg px-6"
              >
                <AccordionTrigger className="text-white hover:text-amber-400">
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
