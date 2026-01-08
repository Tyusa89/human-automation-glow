import { ArrowLeft, BarChart3, TrendingUp, Calendar, DollarSign, CheckCircle, Clock, User, FileText, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";

const metrics = [
  { title: "Health", value: "40", subtitle: "Needs attention", color: "text-yellow-400" },
  { title: "Revenue (week)", value: "$30.18", subtitle: "So far", color: "text-emerald-400" },
  { title: "Revenue (month)", value: "$0", subtitle: "So far", color: "text-emerald-400" },
  { title: "Activity", value: "5 days ago", subtitle: "Last update", color: "text-blue-400" }
];

const tasks = [
  { id: 1, title: "Send proposal to Marcus", priority: "high", completed: false },
  { id: 2, title: "Review contract draft", priority: "medium", completed: false },
  { id: 3, title: "Update project timeline", priority: "low", completed: true },
  { id: 4, title: "Schedule team sync", priority: "medium", completed: false }
];

const recentActivity = [
  { 
    id: 1, 
    type: "payment", 
    title: "Payment received", 
    description: "$450 from Sarah Chen", 
    time: "about 2 hours ago",
    icon: DollarSign,
    iconColor: "text-emerald-400"
  },
  { 
    id: 2, 
    type: "lead", 
    title: "New lead", 
    description: "Marcus from TechCorp submitted contact form", 
    time: "about 3 hours ago",
    icon: User,
    iconColor: "text-blue-400"
  },
  { 
    id: 3, 
    type: "appointment", 
    title: "Appointment booked", 
    description: "David Kim - Tomorrow at 3:00 PM", 
    time: "1 day ago",
    icon: CalendarIcon,
    iconColor: "text-purple-400"
  },
  { 
    id: 4, 
    type: "note", 
    title: "Note added", 
    description: "Follow up notes for Emily Rivera", 
    time: "2 days ago",
    icon: FileText,
    iconColor: "text-orange-400"
  }
];

export default function Dashboard() {
  const [chartView, setChartView] = useState<"trend" | "distribution">("trend");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-400";
      case "medium": return "bg-yellow-500/20 text-yellow-400";
      case "low": return "bg-green-500/20 text-green-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              type="button"
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-slate-400">Overview</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Customize
            </button>
            <button 
              type="button"
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="More options"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <div className="text-sm text-slate-500 mb-2">{metric.title}</div>
              <div className={`text-2xl font-bold ${metric.color} mb-1`}>{metric.value}</div>
              <div className="text-sm text-slate-400">{metric.subtitle}</div>
            </div>
          ))}
        </div>

        {/* Revenue Trend Chart */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Revenue trend</h3>
              <p className="text-sm text-slate-400">Last 7 days</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setChartView("trend")}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  chartView === "trend" 
                    ? "bg-emerald-500/20 text-emerald-400" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Trend
              </button>
              <button
                onClick={() => setChartView("distribution")}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  chartView === "distribution" 
                    ? "bg-emerald-500/20 text-emerald-400" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Distribution
              </button>
            </div>
          </div>
          
          {/* Chart Placeholder */}
          <div className="h-64 bg-slate-900/50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <p className="text-slate-400">Chart visualization would appear here</p>
              <p className="text-sm text-slate-500 mt-1">Integration with charting library needed</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Workflow Automation */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                  Active
                </span>
                <h3 className="text-lg font-semibold text-white">Workflow Automation</h3>
              </div>
              <button className="text-slate-400 hover:text-white transition-colors text-sm">
                🔗 Change
              </button>
            </div>
            <p className="text-slate-400">Automate your repetitive tasks</p>
          </div>

          {/* Tasks */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Tasks</h3>
              </div>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                {pendingTasks.length} pending
              </span>
            </div>
            
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    task.completed ? "bg-emerald-500" : "border-2 border-slate-600"
                  }`}>
                    {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`flex-1 text-sm ${
                    task.completed ? "text-slate-500 line-through" : "text-slate-300"
                  }`}>
                    {task.title}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg bg-white/5 ${activity.iconColor}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-white">{activity.title}</h4>
                      <span className="text-xs text-slate-500">{activity.time}</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{activity.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
