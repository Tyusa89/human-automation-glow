import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { supabase } from '../integrations/supabase/client';
import { useNavigate } from "react-router-dom";
import { BarChart3, CalendarDays, ChevronLeft, Download, FileText, Filter } from "lucide-react";

type SavedReport = {
  id: string;
  title: string;
  created_at: string;
  report_type: "monthly" | "weekly" | "custom";
  file_path: string;
};

export default function Reports() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState<"monthly" | "weekly" | "custom">("monthly");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Load saved reports
  useEffect(() => {
    loadSavedReports();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadSavedReports = async () => {
    if (!user) return;
    
    setLoadingReports(true);
    try {
      console.log("📊 Loading saved reports...");
      
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setSavedReports(data || []);
      console.log(`📊 Loaded ${data?.length || 0} saved reports`);
    } catch (error) {
      console.error("❌ Error loading reports:", error);
    } finally {
      setLoadingReports(false);
    }
  };

  const generateReport = async () => {
    if (!user) return;

    setGenerating(true);
    try {
      console.log("🎯 Generating report...", { selectedType, customStartDate, customEndDate });

      let reportTitle = "";
      let startDate = "";
      let endDate = "";

      const now = new Date();
      
      if (selectedType === "monthly") {
        reportTitle = `Monthly Report - ${now.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
      } else if (selectedType === "weekly") {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        reportTitle = `Weekly Report - ${weekStart.toLocaleDateString()} to ${weekEnd.toLocaleDateString()}`;
        startDate = weekStart.toISOString();
        endDate = weekEnd.toISOString();
      } else {
        if (!customStartDate || !customEndDate) {
          alert("Please select both start and end dates for custom report");
          return;
        }
        reportTitle = `Custom Report - ${customStartDate} to ${customEndDate}`;
        startDate = new Date(customStartDate).toISOString();
        endDate = new Date(customEndDate).toISOString();
      }

      // Call Edge Function to generate report
      const { data: functionData, error: functionError } = await supabase.functions.invoke("generate-report", {
        body: {
          reportType: selectedType,
          title: reportTitle,
          startDate,
          endDate
        }
      });

      if (functionError) throw functionError;

      console.log("✅ Report generated successfully:", functionData);
      
      // Reload reports to show the new one
      await loadSavedReports();
      
      alert("Report generated successfully!");
    } catch (error) {
      console.error("❌ Error generating report:", error);
      alert(`Error generating report: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setGenerating(false);
    }
  };

  const openReport = async (report: SavedReport) => {
    try {
      console.log("📖 Opening report:", report.title);
      
      // Get signed URL for the report file
      const { data, error } = await supabase.storage
        .from("reports")
        .createSignedUrl(report.file_path, 3600); // 1 hour expiry

      if (error) throw error;

      // Open in new tab
      window.open(data.signedUrl, "_blank");
    } catch (error) {
      console.error("❌ Error opening report:", error);
      alert(`Error opening report: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#050B16] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-6">
            <button
              onClick={() => navigate("/")}
              title="Go back to dashboard"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Reports</h1>
                <p className="text-white/60">Generate and view your business reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Generate New Report */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold">Generate Report</h2>
              </div>

              <div className="space-y-4">
                {/* Report Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Report Type
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "monthly", label: "Monthly Report", icon: CalendarDays },
                      { value: "weekly", label: "Weekly Report", icon: CalendarDays },
                      { value: "custom", label: "Custom Date Range", icon: Filter }
                    ].map(({ value, label, icon: Icon }) => (
                      <label key={value} className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:border-white/20 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="reportType"
                          value={value}
                          checked={selectedType === value}
                          onChange={(e) => setSelectedType(e.target.value as typeof selectedType)}
                          className="text-blue-500"
                        />
                        <Icon className="w-4 h-4 text-white/60" />
                        <span className="text-white/80">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Custom Date Inputs */}
                {selectedType === "custom" && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        aria-label="Report start date"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        aria-label="Report end date"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <button
                  onClick={generateReport}
                  disabled={generating}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Generate Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Saved Reports */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-green-400" />
                  <h2 className="text-xl font-semibold">Saved Reports</h2>
                </div>
                <button
                  onClick={loadSavedReports}
                  disabled={loadingReports}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors"
                >
                  {loadingReports ? "Loading..." : "Refresh"}
                </button>
              </div>

              {loadingReports ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/30 border-t-white"></div>
                  <span className="ml-3 text-white/60">Loading reports...</span>
                </div>
              ) : savedReports.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-white/30 mx-auto mb-4" />
                  <p className="text-white/60 mb-2">No reports generated yet</p>
                  <p className="text-white/40 text-sm">Generate your first report to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-blue-600">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{report.title}</h3>
                          <p className="text-sm text-white/60">
                            {new Date(report.created_at).toLocaleDateString()} • {report.report_type}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => openReport(report)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Open
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
