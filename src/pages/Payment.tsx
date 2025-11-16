import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const plan = searchParams.get("plan") || "Pro";
  const billing = searchParams.get("billing") || "monthly";
  const price = searchParams.get("price") || "99";

  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    email: "",
    billingAddress: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Payment Processing",
      description: "Your payment is being processed. This is a demo.",
    });

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful!",
        description: `Welcome to ${plan} plan!`,
      });
      navigate("/dashboard");
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-foreground py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Complete Your Order</h1>
          <p className="text-slate-400">Secure checkout powered by industry-leading encryption</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Enter your payment details below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-200">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>

                  <Separator className="bg-slate-600" />

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="text-slate-200">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      maxLength={19}
                      required
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName" className="text-slate-200">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      type="text"
                      placeholder="John Doe"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      required
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate" className="text-slate-200">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        type="text"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        maxLength={5}
                        required
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="text-slate-200">CVV</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        type="text"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        maxLength={4}
                        required
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <Separator className="bg-slate-600" />

                  <div className="space-y-2">
                    <Label htmlFor="billingAddress" className="text-slate-200">Billing Address</Label>
                    <Input
                      id="billingAddress"
                      name="billingAddress"
                      type="text"
                      placeholder="123 Main St, City, State, ZIP"
                      value={formData.billingAddress}
                      onChange={handleInputChange}
                      required
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Lock className="w-4 h-4" />
                    <span>Your payment information is encrypted and secure</span>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/pricing")}
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Back to Pricing
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary/90 text-white"
                    >
                      Complete Payment
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 sticky top-4">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Plan</span>
                    <span className="text-white font-medium">{plan}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Billing</span>
                    <span className="text-white font-medium capitalize">{billing}</span>
                  </div>
                </div>

                <Separator className="bg-slate-600" />

                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-primary">${price}{billing === "yearly" ? "/yr" : "/mo"}</span>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg space-y-2 text-sm">
                  <h4 className="font-semibold text-white mb-2">What's included:</h4>
                  <ul className="space-y-1 text-slate-300">
                    <li>• All features for {plan} plan</li>
                    <li>• 24/7 Priority support</li>
                    <li>• Cancel anytime</li>
                    <li>• 30-day money-back guarantee</li>
                  </ul>
                </div>

                <div className="text-xs text-slate-500 text-center pt-2">
                  By completing this purchase, you agree to our Terms of Service and Privacy Policy
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
