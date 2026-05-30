"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { ArrowUpRight, AlertTriangle, CheckCircle, Clock, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const forecastItems = [
  {
    id: 1,
    product: "SKU-2847",
    name: "Premium Widget A",
    currentStock: 1240,
    forecastedDemand: 2100,
    confidence: 94,
    status: "low-stock",
    trend: "increasing",
  },
  {
    id: 2,
    product: "SKU-1923",
    name: "Standard Widget B",
    currentStock: 3400,
    forecastedDemand: 2800,
    confidence: 87,
    status: "optimal",
    trend: "stable",
  },
  {
    id: 3,
    product: "SKU-3841",
    name: "Economy Widget C",
    currentStock: 890,
    forecastedDemand: 1500,
    confidence: 91,
    status: "critical",
    trend: "increasing",
  },
  {
    id: 4,
    product: "SKU-4721",
    name: "Deluxe Widget D",
    currentStock: 2100,
    forecastedDemand: 1800,
    confidence: 89,
    status: "optimal",
    trend: "decreasing",
  },
]

const statusConfig = {
  "low-stock": {
    icon: AlertTriangle,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    label: "Low Stock",
  },
  critical: {
    icon: AlertTriangle,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    label: "Critical",
  },
  optimal: {
    icon: CheckCircle,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    label: "Optimal",
  },
}

export function ForecastTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.4 }}
      className="card-base overflow-hidden"
    >
      <div className="flex flex-row items-start justify-between p-6 pb-2">
        <div>
          <h3 className="text-base font-semibold text-foreground">Inventory Forecast</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">AI-powered demand predictions for key products</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <span>View All</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </motion.button>
      </div>
      <div className="p-6 pt-2">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Product
                </th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Current Stock
                </th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Forecast (30d)
                </th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Confidence
                </th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {forecastItems.map((item, index) => {
                const status = statusConfig[item.status as keyof typeof statusConfig]
                const StatusIcon = status.icon

                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.75 + index * 0.05, duration: 0.3 }}
                    className="group transition-colors hover:bg-secondary/50"
                  >
                    <td className="py-4">
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.product}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="font-mono text-sm text-foreground">
                        {item.currentStock.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-foreground">
                          {item.forecastedDemand.toLocaleString()}
                        </span>
                        <span
                          className={cn(
                            "text-xs font-medium",
                            item.trend === "increasing"
                              ? "text-emerald-500"
                              : item.trend === "decreasing"
                              ? "text-red-500"
                              : "text-muted-foreground"
                          )}
                        >
                          {item.trend === "increasing" ? "↑" : item.trend === "decreasing" ? "↓" : "→"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                          <motion.div
                            className="h-full rounded-full bg-foreground"
                            initial={{ width: 0 }}
                            animate={{ width: `${item.confidence}%` }}
                            transition={{ delay: 0.85 + index * 0.08, duration: 0.5 }}
                          />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {item.confidence}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                          status.bg,
                          status.color,
                          status.border
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        <span>{status.label}</span>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}

const insights = [
  {
    icon: Zap,
    title: "High demand predicted",
    description: "SKU-2847 expected to see 70% increase in next 2 weeks",
    type: "warning",
  },
  {
    icon: CheckCircle,
    title: "Forecast accuracy improved",
    description: "Model accuracy increased to 94.2% this month",
    type: "success",
  },
  {
    icon: Clock,
    title: "Reorder point approaching",
    description: "3 products will need restocking within 5 days",
    type: "info",
  },
]

export function AIInsights({ refreshKey = 0 }: { refreshKey?: number }) {
  const [data, setData] = useState(insights)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    fetch(`${apiUrl}/api/insights`)
      .then(res => res.json())
      .then(d => {
        if (d && d.insights && d.insights.length > 0) {
          setData(d.insights)
        }
      })
      .catch(err => console.error("Error fetching insights:", err))
  }, [refreshKey])

  // Helper to map string icon types to Lucide components
  const getIcon = (iconName: string) => {
    if (iconName === "CheckCircle") return CheckCircle
    if (iconName === "AlertTriangle") return AlertTriangle
    if (iconName === "Clock") return Clock
    return Zap
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.4 }}
      className="card-base p-6"
    >
      <div className="mb-4">
        <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/40" />
            <div className="relative h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          AI Insights
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">Real-time analysis and recommendations</p>
      </div>
      <div className="space-y-3">
        {data.map((insight: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.85 + index * 0.08, duration: 0.3 }}
            className="group flex items-start gap-3 rounded-xl bg-secondary p-3 transition-colors hover:bg-accent"
          >
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                insight.type === "warning"
                  ? "bg-amber-500/10 text-amber-500"
                  : insight.type === "success"
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-foreground/10 text-foreground"
              )}
            >
              {(() => {
                const IconComponent = insight.icon_type ? getIcon(insight.icon_type) : insight.icon;
                if (!IconComponent) return <Zap className="h-4 w-4" />;
                return <IconComponent className="h-4 w-4" />;
              })()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{insight.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {insight.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

const bgdForecastData = [
  { id: "dhaka", name: "Dhaka", demand: 15400, stock: 12000, confidence: 95, growth: 22.4, status: "optimal" },
  { id: "ctg", name: "Chattogram", demand: 9800, stock: 8500, confidence: 92, growth: 15.2, status: "low-stock" },
  { id: "sylhet", name: "Sylhet", demand: 4200, stock: 5000, confidence: 88, growth: 8.4, status: "optimal" },
  { id: "rajshahi", name: "Rajshahi", demand: 5600, stock: 6100, confidence: 85, growth: 12.1, status: "optimal" },
  { id: "khulna", name: "Khulna", demand: 6100, stock: 6500, confidence: 89, growth: 5.6, status: "optimal" },
  { id: "barishal", name: "Barishal", demand: 3200, stock: 3800, confidence: 82, growth: 4.2, status: "optimal" },
  { id: "rangpur", name: "Rangpur", demand: 4100, stock: 4500, confidence: 84, growth: 9.8, status: "optimal" },
  { id: "mymensingh", name: "Mymensingh", demand: 3800, stock: 3200, confidence: 86, growth: 11.5, status: "low-stock" },
];

export function BangladeshForecastTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="card-base flex flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-border/50 p-6">
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
            Regional Analysis
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Detailed district-level breakdown</p>
        </div>
        <button className="group flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary">
          Export Report
          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
        </button>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        <div className="min-w-[800px] p-6 pt-0">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 font-medium">Division</th>
                <th className="pb-3 font-medium">Forecasted Demand</th>
                <th className="pb-3 font-medium">Current Stock</th>
                <th className="pb-3 font-medium">Est. Growth</th>
                <th className="pb-3 font-medium">Confidence</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {bgdForecastData.map((item, index) => {
                const status = statusConfig[item.status as keyof typeof statusConfig] || statusConfig["optimal"]
                const StatusIcon = status.icon

                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                    className="group transition-colors hover:bg-secondary/30"
                  >
                    <td className="py-4">
                      <div className="font-medium text-foreground">{item.name}</div>
                    </td>
                    <td className="py-4">
                      <div className="font-semibold tabular-nums text-foreground">
                        {item.demand.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="font-medium tabular-nums text-muted-foreground">
                        {item.stock.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5">
                        <span className={cn("font-medium tabular-nums", item.growth > 10 ? "text-emerald-500" : "text-foreground")}>
                          +{item.growth}%
                        </span>
                        <span className={cn("text-xs", item.growth > 10 ? "text-emerald-500" : "text-muted-foreground")}>
                          {item.growth > 10 ? "↑" : "→"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                          <motion.div
                            className="h-full rounded-full bg-foreground"
                            initial={{ width: 0 }}
                            animate={{ width: `${item.confidence}%` }}
                            transition={{ delay: 0.85 + index * 0.08, duration: 0.5 }}
                          />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {item.confidence}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                          status.bg,
                          status.color,
                          status.border
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        <span>{status.label}</span>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
