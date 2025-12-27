"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  RefreshCw, 
  Copy, 
  Plus,
  Check,
  X,
  Briefcase
} from "lucide-react";

type AppointmentStatus = "booked" | "rescheduled" | "canceled";

type Appointment = {
  id: string;
  start_time: string;
  end_time: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  notes: string | null;
  status: AppointmentStatus;
  created_at: string;
  service_id: string;
  service?: {
    name: string;
    duration_minutes: number;
  };
};

type Service = {
  id: string;
  name: string;
  duration_minutes: number;
  active: boolean;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function formatTimeRange(start: string, end: string) {
  return `${formatTime(start)} - ${formatTime(end)}`;
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  if (status === "booked") {
    return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">booked</Badge>;
  }
  if (status === "rescheduled") {
    return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">rescheduled</Badge>;
  }
  return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">canceled</Badge>;
}

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filter, setFilter] = useState<"upcoming" | "past" | "all">("upcoming");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [addServiceOpen, setAddServiceOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDuration, setNewServiceDuration] = useState(30);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      let query = supabase
        .from("appointments")
        .select("*, appointment_services(name, duration_minutes)")
        .order("start_time", { ascending: true })
        .limit(100);

      const now = new Date().toISOString();
      if (filter === "upcoming") {
        query = query.gte("start_time", now);
      } else if (filter === "past") {
        query = query.lt("start_time", now);
      }

      const { data, error } = await query;
      if (error) throw error;

      const mapped = (data || []).map((a: any) => ({
        ...a,
        service: a.appointment_services
      }));
      setAppointments(mapped);
    } catch (error: any) {
      toast({
        title: "Error loading appointments",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [filter, toast]);

  const loadServices = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("appointment_services")
        .select("*")
        .eq("active", true)
        .order("name");

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      console.error("Error loading services:", error);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
    loadServices();
  }, [loadAppointments, loadServices]);

  useEffect(() => {
    loadAppointments();
  }, [filter, loadAppointments]);

  const handleConfirm = async (id: string) => {
    // Mark as booked (no change if already booked)
    toast({ title: "Appointment confirmed" });
  };

  const handleCancel = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase.functions.invoke("appointments-admin-cancel", {
        body: { id },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw error;

      setAppointments(prev =>
        prev.map(a => a.id === id ? { ...a, status: "canceled" as AppointmentStatus } : a)
      );

      toast({ title: "Appointment canceled" });
    } catch (error: any) {
      toast({
        title: "Failed to cancel",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const copyBookingLink = () => {
    const link = `${window.location.origin}/book`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast({ title: "Booking link copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddService = async () => {
    if (!newServiceName.trim()) return;

    try {
      const { error } = await supabase
        .from("appointment_services")
        .insert({
          name: newServiceName,
          duration_minutes: newServiceDuration,
          active: true,
        });

      if (error) throw error;

      toast({ title: "Service added!" });
      setNewServiceName("");
      setNewServiceDuration(30);
      setAddServiceOpen(false);
      loadServices();
    } catch (error: any) {
      toast({
        title: "Failed to add service",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Stats calculations
  const todayCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return appointments.filter(a => {
      const start = new Date(a.start_time);
      return a.status !== "canceled" && start >= today && start < tomorrow;
    }).length;
  }, [appointments]);

  const upcomingCount = useMemo(() => {
    const now = new Date();
    return appointments.filter(a => 
      a.status !== "canceled" && new Date(a.start_time) >= now
    ).length;
  }, [appointments]);

  const activeAppointments = useMemo(() => {
    return appointments.filter(a => a.status !== "canceled");
  }, [appointments]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Appointments</h1>
            <p className="text-slate-400 mt-1">Manage your bookings and availability</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={copyBookingLink}
              className="gap-2 border-slate-600 bg-slate-800/60 text-slate-200 hover:bg-slate-700 hover:text-white"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copy booking link
            </Button>
            <Dialog open={addServiceOpen} onOpenChange={setAddServiceOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4" />
                  Add service
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Service</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceName">Service Name</Label>
                    <Input
                      id="serviceName"
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      placeholder="e.g. 30-min Consultation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceDuration">Duration (minutes)</Label>
                    <Input
                      id="serviceDuration"
                      type="number"
                      value={newServiceDuration}
                      onChange={(e) => setNewServiceDuration(Number(e.target.value))}
                      min={5}
                      max={480}
                    />
                  </div>
                  <Button onClick={handleAddService} className="w-full">
                    Add Service
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-800/60 border-slate-700/50">
            <CardContent className="p-6">
              <p className="text-4xl font-bold text-white">{todayCount}</p>
              <p className="text-slate-400 text-sm mt-1">Today</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/60 border-slate-700/50">
            <CardContent className="p-6">
              <p className="text-4xl font-bold text-white">{upcomingCount}</p>
              <p className="text-slate-400 text-sm mt-1">Upcoming</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/60 border-slate-700/50">
            <CardContent className="p-6">
              <p className="text-4xl font-bold text-white">{services.length}</p>
              <p className="text-slate-400 text-sm mt-1">Services</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter and Refresh */}
        <div className="flex items-center gap-3 mb-6">
          <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
            <SelectTrigger className="w-[140px] border-slate-600 bg-slate-800/60 text-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-slate-600 bg-slate-800">
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="past">Past</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={loadAppointments} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Appointments List */}
        <Card className="bg-slate-800/60 border-slate-700/50 mb-8">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading appointments...</div>
            ) : activeAppointments.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                No appointments found
              </div>
            ) : (
              <div className="divide-y divide-slate-700/50">
                {activeAppointments.map((apt) => (
                  <div key={apt.id} className="p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <StatusBadge status={apt.status} />
                        <span className="font-semibold text-white">
                          {apt.service?.name || "Unknown Service"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(apt.start_time)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatTimeRange(apt.start_time, apt.end_time)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {apt.client_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {apt.client_email}
                        </span>
                        {apt.client_phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {apt.client_phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleConfirm(apt.id)}
                        className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCancel(apt.id)}
                        disabled={apt.status === "canceled"}
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Your Services */}
        <Card className="bg-slate-800/60 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Your Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {services.length === 0 ? (
              <p className="text-slate-400 text-sm">No services configured yet.</p>
            ) : (
              services.map((service) => (
                <div 
                  key={service.id} 
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-700/50 bg-slate-700/30"
                >
                  <div>
                    <p className="font-medium text-white">{service.name}</p>
                    <p className="text-sm text-slate-400">{service.duration_minutes} min</p>
                  </div>
                  <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
                    Active
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
