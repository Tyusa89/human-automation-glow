import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Pricing() {
  const tiers = [
    { name: "Starter", price: "$49/mo", features: ["Lead capture", "1 automation", "Email support"] },
    { name: "Pro", price: "$149/mo", features: ["Everything in Starter", "3 automations", "Priority support"] },
    { name: "Custom", price: "Let's talk", features: ["Unlimited automations", "SLA", "Dedicated engineer"] },
  ];
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20">
          <h1 className="text-3xl font-bold mb-8 text-center">Simple, scalable pricing</h1>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {tiers.map(t => (
              <div key={t.name} className="border border-border rounded-2xl p-6 bg-card">
                <h2 className="text-xl font-semibold text-card-foreground">{t.name}</h2>
                <p className="text-3xl my-4 text-card-foreground">{t.price}</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {t.features.map(f => <li key={f}>• {f}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}