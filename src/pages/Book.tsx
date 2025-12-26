import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Clock, CheckCircle, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface Service {
  id: string;
  name: string;
  duration_minutes: number;
}

interface Slot {
  time: string;
  available: boolean;
}

type Step = 'service' | 'date' | 'time' | 'details' | 'confirm';

export default function BookPage() {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('service');
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState<{ cancelUrl: string; rescheduleUrl: string } | null>(null);

  // Form fields
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Fetch services on mount
  useEffect(() => {
    async function fetchServices() {
      const { data, error } = await supabase
        .from('appointment_services')
        .select('*')
        .eq('active', true)
        .order('duration_minutes', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
        toast({ title: 'Error', description: 'Failed to load services', variant: 'destructive' });
      } else {
        setServices(data || []);
      }
    }
    fetchServices();
  }, [toast]);

  // Fetch availability when date changes
  useEffect(() => {
    if (!selectedService || !selectedDate) return;

    async function fetchAvailability() {
      setLoading(true);
      try {
        const dateStr = format(selectedDate!, 'yyyy-MM-dd');
        const { data, error } = await supabase.functions.invoke('appointments-availability', {
          body: null,
          method: 'GET',
        });
        
        // Use fetch directly since we need query params
        const response = await fetch(
          `https://rqldulvkwzvrmcvwttep.supabase.co/functions/v1/appointments-availability?serviceId=${selectedService.id}&date=${dateStr}`
        );
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch availability');
        }
        
        setSlots(result.slots || []);
      } catch (error: any) {
        console.error('Error fetching availability:', error);
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    fetchAvailability();
  }, [selectedService, selectedDate, toast]);

  const handleBook = async () => {
    if (!selectedService || !selectedSlot || !clientName || !clientEmail) return;

    setBooking(true);
    try {
      const { data, error } = await supabase.functions.invoke('appointments-book', {
        body: {
          serviceId: selectedService.id,
          startTime: selectedSlot,
          clientName,
          clientEmail,
          clientPhone: clientPhone || undefined,
          notes: notes || undefined
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setBookingResult({
        cancelUrl: data.appointment.cancelUrl,
        rescheduleUrl: data.appointment.rescheduleUrl
      });
      setStep('confirm');
      toast({ title: 'Success', description: 'Your appointment has been booked!' });
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({ title: 'Booking Failed', description: error.message, variant: 'destructive' });
    } finally {
      setBooking(false);
    }
  };

  const goBack = () => {
    const stepOrder: Step[] = ['service', 'date', 'time', 'details'];
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex > 0) {
      setStep(stepOrder[currentIndex - 1]);
    }
  };

  const goNext = () => {
    const stepOrder: Step[] = ['service', 'date', 'time', 'details'];
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex < stepOrder.length - 1) {
      setStep(stepOrder[currentIndex + 1]);
    }
  };

  // Disable past dates and weekends
  const disabledDays = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = date.getDay();
    return date < today || day === 0 || day === 6;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-background to-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Book an Appointment</CardTitle>
            <CardDescription>Schedule a session with EcoNest</CardDescription>
            
            {/* Progress indicator */}
            <div className="flex justify-center gap-2 pt-4">
              {['service', 'date', 'time', 'details', 'confirm'].map((s, i) => (
                <div
                  key={s}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    step === s ? 'bg-primary' : 
                    ['service', 'date', 'time', 'details', 'confirm'].indexOf(step) > i ? 'bg-primary/50' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Select Service */}
            {step === 'service' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Select a Service</h3>
                <div className="grid gap-3">
                  {services.map(service => (
                    <Card
                      key={service.id}
                      className={`cursor-pointer transition-all hover:border-primary ${
                        selectedService?.id === service.id ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedService(service)}
                    >
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {service.duration_minutes} minutes
                          </div>
                        </div>
                        {selectedService?.id === service.id && (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Button
                  className="w-full"
                  disabled={!selectedService}
                  onClick={goNext}
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: Select Date */}
            {step === 'date' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={goBack}>
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <h3 className="font-semibold text-lg">Select a Date</h3>
                </div>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={disabledDays}
                    className="rounded-md border"
                  />
                </div>
                <Button
                  className="w-full"
                  disabled={!selectedDate}
                  onClick={goNext}
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 3: Select Time */}
            {step === 'time' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={goBack}>
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <h3 className="font-semibold text-lg">
                    Select a Time - {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
                  </h3>
                </div>
                
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {slots.filter(s => s.available).length === 0 ? (
                      <p className="col-span-full text-center text-muted-foreground py-8">
                        No available slots for this date. Please select another day.
                      </p>
                    ) : (
                      slots.map(slot => (
                        <Button
                          key={slot.time}
                          variant={selectedSlot === slot.time ? 'default' : 'outline'}
                          disabled={!slot.available}
                          className="text-sm"
                          onClick={() => setSelectedSlot(slot.time)}
                        >
                          {format(new Date(slot.time), 'h:mm a')}
                        </Button>
                      ))
                    )}
                  </div>
                )}
                
                <Button
                  className="w-full"
                  disabled={!selectedSlot}
                  onClick={goNext}
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 4: Enter Details */}
            {step === 'details' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={goBack}>
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <h3 className="font-semibold text-lg">Your Details</h3>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                  <p className="font-medium">{selectedService?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedSlot && format(new Date(selectedSlot), 'h:mm a')}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any additional information..."
                      rows={3}
                    />
                  </div>
                </div>

                <Button
                  className="w-full"
                  disabled={!clientName || !clientEmail || booking}
                  onClick={handleBook}
                >
                  {booking ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {step === 'confirm' && (
              <div className="space-y-6 text-center">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-xl text-green-600">Booking Confirmed!</h3>
                  <p className="text-muted-foreground mt-2">
                    A confirmation email has been sent to {clientEmail}
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-left">
                  <p className="font-medium">{selectedService?.name}</p>
                  <p className="text-sm">
                    {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-sm">
                    {selectedSlot && format(new Date(selectedSlot), 'h:mm a')}
                  </p>
                  <p className="text-sm">{clientName}</p>
                </div>

                <div className="flex gap-3 justify-center">
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    <a href={bookingResult?.rescheduleUrl}>Reschedule</a>
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-destructive/10 text-destructive">
                    <a href={bookingResult?.cancelUrl}>Cancel</a>
                  </Badge>
                </div>

                <Button variant="outline" onClick={() => window.location.reload()}>
                  Book Another Appointment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
