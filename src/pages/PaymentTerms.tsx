const PaymentTerms = () => {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-card rounded-lg shadow-lg p-8 md:p-12 border">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            EcoNest AI — Payment Terms Addendum
          </h1>
          
          <div className="space-y-2 text-sm text-muted-foreground mb-8">
            <p><strong className="text-foreground">Effective Date:</strong> October 9, 2025</p>
            <p><strong className="text-foreground">Client:</strong> {"{{Client Legal Name}}"}</p>
            <p><strong className="text-foreground">Project/Service:</strong> {"{{Project Name / SOW ID}}"}</p>
          </div>

          <p className="text-foreground/80 mb-8">
            This Addendum supplements the Master Services Agreement (MSA) or Statement of Work (SOW) between EcoNest AI ("Provider") and the above Client ("Client"). If a conflict exists, these Payment Terms control for invoicing and collections.
          </p>

          <hr className="my-8 border-border" />

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                1) Upfront Payment & Project Kickoff
              </h2>
              <ul className="space-y-2 text-foreground/80 list-disc pl-6">
                <li>
                  <strong className="text-foreground">Deposit (Projects):</strong> <strong>50% of the total project fee due upfront</strong> to reserve resources and begin work. Remaining <strong>50%</strong> is due at <strong>Go‑Live/Final Delivery</strong> or as milestone invoices (see §2).
                </li>
                <li>
                  <strong className="text-foreground">Retainers / Ongoing Plans:</strong> First <strong>month's fee is prepaid</strong> on signature. Subsequent months bill on the same calendar day.
                </li>
                <li>
                  <strong className="text-foreground">Prepaid Blocks (Hourly/As‑Needed):</strong> Minimum purchase of <strong>10 hours</strong> in advance. Time is debited in 15‑minute increments; unused time carries <strong>90 days</strong>.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                2) Milestones (If Applicable)
              </h2>
              <ul className="space-y-2 text-foreground/80 list-disc pl-6">
                <li>
                  Example schedule: <strong>30% Deposit (signature)</strong> → <strong>40% (MVP/Alpha)</strong> → <strong>30% (Go‑Live)</strong>.
                </li>
                <li>
                  Milestone acceptance occurs when the defined deliverables are presented for review; if no written feedback within <strong>5 business days</strong>, the milestone is deemed accepted and invoice becomes due.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                3) Scope, Change Orders & Rush
              </h2>
              <ul className="space-y-2 text-foreground/80 list-disc pl-6">
                <li>
                  Work outside the SOW is billed at <strong>$150/hr</strong> with written approval via change order.
                </li>
                <li>
                  <strong className="text-foreground">Rush work</strong> (requests requiring &gt;20% schedule compression) is billed at <strong>1.5×</strong> standard rates.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                4) Invoicing, Due Dates & Late Fees
              </h2>
              <ul className="space-y-2 text-foreground/80 list-disc pl-6">
                <li>
                  Unless otherwise stated, invoices are <strong>Due Upon Receipt</strong>, delinquent after <strong>7 calendar days</strong>.
                </li>
                <li>
                  <strong className="text-foreground">Late fee:</strong> the greater of <strong>1.5% per month</strong> or <strong>$35</strong> per missed cycle.
                </li>
                <li>
                  <strong className="text-foreground">Work pause:</strong> Provider may suspend work after <strong>5 business days</strong> past due until accounts are current; deadlines shift accordingly.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                5) Payments & Processing
              </h2>
              <ul className="space-y-2 text-foreground/80 list-disc pl-6">
                <li>
                  Accepted: <strong>ACH, credit/debit (Stripe)</strong>, or <strong>wire</strong>. Card payments may include a <strong>processing surcharge up to 3%</strong> where permitted by law (ACH has no surcharge).
                </li>
                <li>
                  Client is responsible for applicable <strong>taxes</strong> and <strong>bank/wire fees</strong>.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                6) Cancellations & Refunds
              </h2>
              <ul className="space-y-2 text-foreground/80 list-disc pl-6">
                <li>
                  <strong className="text-foreground">Before kickoff:</strong> Deposits are <strong>partially refundable</strong> minus non‑recoverable costs (e.g., design time, reserved contractor hours, licenses).
                </li>
                <li>
                  <strong className="text-foreground">After kickoff:</strong> Deposits become <strong>earned on commencement</strong> and are <strong>non‑refundable</strong>; any work completed beyond the deposit is billed at the SOW rate and due on notice of cancellation.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                7) Intellectual Property & Access
              </h2>
              <ul className="space-y-2 text-foreground/80 list-disc pl-6">
                <li>
                  <strong className="text-foreground">Ownership transfers</strong> upon <strong>full payment</strong> of all due invoices. Until then, Provider retains all IP and may revoke access to environments, repos, and artifacts.
                </li>
                <li>
                  Third‑party licenses (e.g., LLM, hosting, analytics) are provisioned to Client's accounts when possible; otherwise, pass‑through costs are itemized and billed monthly.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                8) Chargebacks & Disputes
              </h2>
              <p className="text-foreground/80">
                Client agrees <strong>not</strong> to initiate chargebacks. Billing concerns must be raised in writing within <strong>5 business days</strong> of invoice; parties will cooperate in good faith to resolve within <strong>10 business days</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                9) Credits & Satisfaction
              </h2>
              <p className="text-foreground/80">
                If a deliverable materially deviates from the SOW, Provider will <strong>cure at no charge</strong> within a commercially reasonable period. If cure is not feasible, Provider may issue a <strong>credit</strong> against future work at its discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                10) Termination for Non‑Payment
              </h2>
              <p className="text-foreground/80">
                If any invoice remains unpaid <strong>15 days</strong> past due, Provider may terminate the SOW/Account on written notice. Client remains liable for amounts accrued and collection costs (including reasonable attorneys' fees).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                11) Notices & E‑Sign
              </h2>
              <p className="text-foreground/80">
                Invoices and notices may be sent electronically. <strong>E‑signatures</strong> are valid and enforceable.
              </p>
            </section>
          </div>

          <hr className="my-8 border-border" />

          <div className="text-center mb-8">
            <p className="font-semibold text-foreground mb-4">
              By signing below, Client agrees to these Payment Terms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">EcoNest AI (Provider)</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-muted-foreground">Name/Title:</label>
                  <div className="border-b border-border py-2">_________________________</div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Signature:</label>
                  <div className="border-b border-border py-2">__________________________</div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Date:</label>
                  <div className="border-b border-border py-2">_______________________________</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Client</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-muted-foreground">Name/Title:</label>
                  <div className="border-b border-border py-2">_________________________</div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Signature:</label>
                  <div className="border-b border-border py-2">__________________________</div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Date:</label>
                  <div className="border-b border-border py-2">_______________________________</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTerms;