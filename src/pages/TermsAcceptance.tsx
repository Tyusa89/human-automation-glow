import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';

// Terms acceptance page with electronic signature
export default function TermsAcceptance() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate('/auth');
        return;
      }
      setUserId(data.session.user.id);
      
      // Check if terms already accepted
      setTimeout(() => {
        checkExistingAcceptance(data.session.user.id);
      }, 0);
    });
  }, [navigate]);

  async function checkExistingAcceptance(uid: string) {
    const { data } = await supabase
      .from('terms_acceptance')
      .select('id')
      .eq('user_id', uid)
      .eq('terms_version', '1.0')
      .maybeSingle();
    
    if (data) {
      navigate('/dashboard');
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Set drawing style
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignature(true);

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleAccept = async () => {
    if (!hasReadTerms) {
      setError('Please confirm that you have read the terms and conditions.');
      return;
    }

    if (!hasSignature) {
      setError('Please provide your electronic signature.');
      return;
    }

    if (!userId) {
      setError('User session not found. Please sign in again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas not found');

      // Get signature as base64
      const signatureData = canvas.toDataURL('image/png');

      // Get user's IP and user agent
      const userAgent = navigator.userAgent;

      // Save to database
      const { error: dbError } = await supabase
        .from('terms_acceptance')
        .insert({
          user_id: userId,
          signature_data: signatureData,
          user_agent: userAgent,
          terms_version: '1.0'
        });

      if (dbError) throw dbError;

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save acceptance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Terms and Conditions
              </h1>
              <p className="text-muted-foreground">
                Please review and accept our terms to continue
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Terms Content */}
            <ScrollArea className="h-[400px] border rounded-lg p-6">
              <div className="space-y-4 text-sm">
                <h2 className="text-xl font-semibold">Payment Terms and Conditions</h2>
                <p className="text-muted-foreground">Effective Date: January 1, 2025</p>

                <section>
                  <h3 className="font-semibold text-base mb-2">1. Upfront Payment</h3>
                  <p>A 50% upfront deposit is required before any work commences. This deposit secures your project timeline and ensures resource allocation.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">2. Milestone Payments</h3>
                  <p>Remaining payments will be structured around project milestones as outlined in your project agreement. Payment is due within 7 days of milestone completion notification.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">3. Scope Changes</h3>
                  <p>Any changes to the agreed project scope may result in additional charges. We will provide written estimates for approval before proceeding with scope modifications.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">4. Late Payment</h3>
                  <p>Invoices not paid within 30 days of the due date will incur a late fee of 1.5% per month (18% per annum) on the outstanding balance.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">5. Payment Methods</h3>
                  <p>We accept payment via bank transfer, credit card, or other methods as agreed upon in writing. Payment processing fees may apply for credit card transactions.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">6. Cancellation Policy</h3>
                  <p>The upfront deposit is non-refundable. If you cancel the project after work has commenced, you will be invoiced for all work completed to date at our standard hourly rate.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">7. Intellectual Property</h3>
                  <p>Full ownership and intellectual property rights transfer to the client upon receipt of final payment. Until final payment is received, EcoNest AI retains all rights to work products.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">8. Dispute Resolution</h3>
                  <p>Any disputes regarding payment or services will be resolved through good-faith negotiation. If negotiation fails, disputes will be subject to binding arbitration.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">9. Service Warranty</h3>
                  <p>We provide a 30-day warranty on all deliverables for bug fixes and minor adjustments. Major revisions or new features may incur additional charges.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-base mb-2">10. Confidentiality</h3>
                  <p>Both parties agree to maintain confidentiality of all proprietary information shared during the course of the project.</p>
                </section>
              </div>
            </ScrollArea>

            {/* Checkbox Confirmation */}
            <div className="flex items-start space-x-3 border-t pt-6">
              <Checkbox
                id="terms"
                checked={hasReadTerms}
                onCheckedChange={(checked) => setHasReadTerms(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                I have read and agree to the Terms and Conditions
              </label>
            </div>

            {/* Signature Section */}
            <div className="space-y-3 border-t pt-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Electronic Signature</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearSignature}
                  disabled={!hasSignature}
                >
                  Clear
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Please sign below using your mouse or touchscreen
              </p>
              <canvas
                ref={canvasRef}
                className="w-full h-40 border-2 border-border rounded-lg cursor-crosshair bg-white"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>

            {/* Accept Button */}
            <div className="flex gap-4 pt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/auth')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleAccept}
                disabled={loading || !hasReadTerms || !hasSignature}
              >
                {loading ? 'Saving...' : 'Accept and Continue'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
