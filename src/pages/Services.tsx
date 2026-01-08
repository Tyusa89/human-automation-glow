const services = [
  {
    id: "support-automation",
    title: "Support Automation",
    description: "Deflect FAQs, triage issues, and handoff with full context to agents in Zendesk/Intercom."
  },
  {
    id: "marketing-growth",
    title: "Marketing & Growth",
    description: "Qualify leads, personalize pages, and route hot prospects to sales calendars."
  },
  {
    id: "ops-revops",
    title: "Ops & RevOps",
    description: "Automate back-office: data syncs, enrichment, approvals, and reporting."
  }
];

export default function Services() {
  const handleBookConsultation = () => {
    // Placeholder for booking consultation logic
    console.log("Booking consultation...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="container mx-auto px-6 py-24">
        {/* Header */}
        <div className="mb-16">
          <div className="text-sm text-slate-500 uppercase tracking-wider mb-4">
            BY TEAM & INDUSTRY
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Services & Solutions
          </h1>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/70 transition-all duration-300"
            >
              <h3 className="text-2xl font-semibold text-white mb-6">
                {service.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Book Consultation Button */}
        <div className="flex justify-start">
          <button
            onClick={handleBookConsultation}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            Book a consultation
          </button>
        </div>
      </div>
    </div>
  );
}