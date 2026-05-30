"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { MetricsGrid } from "@/components/metric-card"
import { DemandForecastChart, ChannelPerformanceChart } from "@/components/charts"
import { ForecastMap } from "@/components/forecast-map"
import { BangladeshMap } from "@/components/bangladesh-map"
import { ForecastTable, BangladeshForecastTable, AIInsights } from "@/components/forecast-table"
import { TrendAnalysis, ForecastAccuracy, ParetoChart, ProphetForecastChart } from "@/components/analytics"
import { FileUpload } from "@/components/file-upload"
import { 
  RegionalDistribution, 
  RawDataTable 
} from "@/components/data-visualizations"
import { DataFlowVisualization, PerformanceRadarChart } from "@/components/spider-web"
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Users,
  LayoutGrid,
  Table2,
  BarChart3,
  GitBranch,
  Globe2,
  MapPin
} from "lucide-react"
import { cn } from "@/lib/utils"

const metrics = [
  {
    title: "Total Revenue",
    value: "$284,521",
    change: 12.5,
    changeLabel: "vs last month",
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    title: "Active Products",
    value: "1,847",
    change: 4.2,
    changeLabel: "new this month",
    icon: <Package className="h-5 w-5" />,
  },
  {
    title: "Forecast Accuracy",
    value: "94.2%",
    change: 2.1,
    changeLabel: "improvement",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    title: "Active Users",
    value: "12,489",
    change: -1.8,
    changeLabel: "vs last week",
    icon: <Users className="h-5 w-5" />,
  },
]

type TabType = "overview" | "data" | "analytics" | "pipeline" | "forecasts" | "integrations" | "raw-data"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1)
  }

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: LayoutGrid },
    { id: "forecasts" as const, label: "Forecasts", icon: Globe2 },
    { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
    { id: "pipeline" as const, label: "Data Pipeline", icon: GitBranch },
    { id: "data" as const, label: "Raw Data", icon: Table2 },
  ]

  return (
    <div className="relative flex min-h-screen bg-background">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => setActiveTab(tab as TabType)} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <main className={cn(
        "relative z-10 flex-1 transition-all duration-300",
        isCollapsed ? "lg:pl-16" : "lg:pl-64"
      )}>
        <Header />

        <div className="p-6 lg:p-8">
          {/* File Upload Zone */}
          <FileUpload onUploadSuccess={handleUploadSuccess} />

          {/* Metrics Grid */}
          <section className="mb-8">
            <MetricsGrid metrics={metrics} />
          </section>

          {/* Tab Navigation (Mobile scrollable) */}
          <div className="mb-6 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0">
            <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-card p-1 whitespace-nowrap min-w-max">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                    activeTab === tab.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tabBackground"
                      className="absolute inset-0 rounded-lg bg-secondary"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Main Charts */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <DemandForecastChart />
                  <ChannelPerformanceChart />
                </div>

                {/* Radar Chart + Regional Distribution */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <PerformanceRadarChart />
                  <RegionalDistribution />
                </div>

                {/* Global Demand Forecast Map */}
                <ForecastMap />

                {/* Bangladesh Demand Forecast Map */}
                <div className="card-base p-6">
                  <BangladeshMap />
                </div>
              </motion.div>
            )}

            {activeTab === "forecasts" && (
              <motion.div
                key="forecasts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Global Demand Forecast Map */}
                <ForecastMap />

                {/* Global Forecast Table */}
                <ForecastTable />

                {/* Bangladesh Demand Forecast Map */}
                <div className="card-base p-6">
                  <BangladeshMap />
                </div>

                {/* Bangladesh Forecast Table */}
                <BangladeshForecastTable />
              </motion.div>
            )}

            {activeTab === "pipeline" && (
              <motion.div
                key="pipeline"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <DataFlowVisualization />
                
                {/* Pipeline Stats */}
                <div className="grid gap-6 md:grid-cols-3">
                  <PipelineStatCard
                    title="Data Throughput"
                    value="2.4 TB/day"
                    description="Average daily processing volume"
                    trend={8.3}
                  />
                  <PipelineStatCard
                    title="Pipeline Latency"
                    value="124ms"
                    description="End-to-end processing time"
                    trend={-12.5}
                  />
                  <PipelineStatCard
                    title="Success Rate"
                    value="99.7%"
                    description="Pipeline execution success"
                    trend={0.3}
                  />
                </div>

                {/* Recent Pipeline Runs */}
                <PipelineRunsTable />
              </motion.div>
            )}

            {activeTab === "data" && (
              <motion.div
                key="data"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <RawDataTable />
              </motion.div>
            )}

            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <TrendAnalysis refreshKey={refreshKey} />
                  </div>
                  <div className="flex flex-col h-full gap-6">
                    <div className="shrink-0">
                      <AIInsights refreshKey={refreshKey} />
                    </div>
                    <div className="flex-1 min-h-0 *:h-full">
                      <ForecastAccuracy />
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <ParetoChart />
                  <ProphetForecastChart refreshKey={refreshKey} />
                </div>
              </motion.div>
            )}

            {activeTab === "integrations" && (
              <motion.div
                key="integrations"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex h-[60vh] flex-col items-center justify-center space-y-4"
              >
                <div className="card-base flex h-full w-full max-w-2xl flex-col items-center justify-center p-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
                    <GitBranch className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">Integrations Hub</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Connect DataBox to your favorite tools, CRMs, and data warehouses.
                  </p>
                  <div className="mt-6 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-xs font-medium text-foreground">
                    Coming Soon
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

function PipelineStatCard({ 
  title, 
  value, 
  description, 
  trend,
}: { 
  title: string
  value: string
  description: string
  trend: number
}) {
  const isPositive = trend >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="card-base glossy p-6"
    >
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      
      <div className={cn(
        "mt-3 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
        isPositive 
          ? "bg-emerald-500/10 text-emerald-500" 
          : "bg-red-500/10 text-red-500"
      )}>
        {isPositive ? "+" : ""}{trend}%
      </div>
    </motion.div>
  )
}

function PipelineRunsTable() {
  const runs = [
    { id: "RUN-001", status: "success", duration: "2m 34s", records: "1.2M", timestamp: "2 min ago" },
    { id: "RUN-002", status: "success", duration: "2m 12s", records: "1.1M", timestamp: "17 min ago" },
    { id: "RUN-003", status: "warning", duration: "4m 56s", records: "890K", timestamp: "32 min ago" },
    { id: "RUN-004", status: "success", duration: "2m 28s", records: "1.3M", timestamp: "47 min ago" },
    { id: "RUN-005", status: "error", duration: "0m 45s", records: "0", timestamp: "1h ago" },
    { id: "RUN-006", status: "success", duration: "2m 19s", records: "1.2M", timestamp: "1h 15m ago" },
  ]

  const statusStyles = {
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    error: "bg-red-500/10 text-red-500 border-red-500/20",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-base overflow-hidden"
    >
      <div className="p-6">
        <h3 className="mb-4 text-base font-semibold text-foreground">Recent Pipeline Runs</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Run ID</th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Duration</th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Records</th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {runs.map((run, i) => (
                <motion.tr 
                  key={run.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group"
                >
                  <td className="py-3 text-sm font-mono text-foreground">{run.id}</td>
                  <td className="py-3">
                    <span className={cn(
                      "inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
                      statusStyles[run.status as keyof typeof statusStyles]
                    )}>
                      {run.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">{run.duration}</td>
                  <td className="py-3 text-sm text-muted-foreground">{run.records}</td>
                  <td className="py-3 text-sm text-muted-foreground">{run.timestamp}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
