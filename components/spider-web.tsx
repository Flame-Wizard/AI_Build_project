"use client"

import { motion } from "framer-motion"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts"
import { Database, Cog, Brain, HardDrive, Zap } from "lucide-react"

// Performance Radar Chart - Spider visualization for metrics
export function PerformanceRadarChart() {
  const data = [
    { metric: "Accuracy", current: 94, previous: 88, benchmark: 85 },
    { metric: "Speed", current: 87, previous: 78, benchmark: 80 },
    { metric: "Coverage", current: 92, previous: 85, benchmark: 90 },
    { metric: "Reliability", current: 96, previous: 91, benchmark: 88 },
    { metric: "Efficiency", current: 89, previous: 82, benchmark: 85 },
    { metric: "Precision", current: 91, previous: 86, benchmark: 87 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <div className="card-base p-6 flex flex-col h-full overflow-hidden">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">Performance Metrics</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">Multi-dimensional analysis</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-[var(--chart-1)]" />
              <span className="text-muted-foreground">Current</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-[var(--chart-3)]" />
              <span className="text-muted-foreground">Previous</span>
            </div>
          </div>
        </div>

        <div className="min-h-[300px] w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid stroke="var(--border)" strokeDasharray="3 3" />
              <PolarAngleAxis 
                dataKey="metric" 
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                stroke="var(--border)"
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]}
                tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
                stroke="var(--border)"
                tickCount={5}
              />
              <Radar
                name="Benchmark"
                dataKey="benchmark"
                stroke="var(--muted-foreground)"
                fill="transparent"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <Radar
                name="Previous"
                dataKey="previous"
                stroke="var(--chart-3)"
                fill="var(--chart-3)"
                strokeWidth={2}
                fillOpacity={0.3}
              />
              <Radar
                name="Current"
                dataKey="current"
                stroke="var(--chart-1)"
                fill="var(--chart-1)"
                strokeWidth={2}
                fillOpacity={0.15}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}

// Organic Pipeline with curved SVG connections
export function DataFlowVisualization() {
  const stages = [
    { id: "source", label: "Source", description: "Data Input", icon: Database, x: 80, y: 120 },
    { id: "etl", label: "ETL", description: "Transform", icon: Cog, x: 240, y: 60 },
    { id: "stream", label: "Stream", description: "Real-time", icon: Zap, x: 240, y: 180 },
    { id: "process", label: "Process", description: "ML Models", icon: Brain, x: 450, y: 120 },
    { id: "store", label: "Store", description: "Data Lake", icon: HardDrive, x: 620, y: 120 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <div className="card-base p-6 flex flex-col h-full overflow-hidden">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">Data Pipeline</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">Real-time data flow visualization</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-emerald-500">Active</span>
          </div>
        </div>

      {/* Desktop: SVG Pipeline with organic curves */}
      <div className="hidden md:block">
        <div className="relative h-[280px] w-full">
          <svg 
            viewBox="0 0 700 240" 
            className="h-full w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Animated connection paths with organic curves */}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--foreground)" stopOpacity="0.3" />
                <stop offset="50%" stopColor="var(--foreground)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="var(--foreground)" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Source to ETL - stepped up */}
            <motion.path
              d="M 120 120 L 160 120 L 160 60 L 200 60"
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.2 }}
            />
            
            {/* Source to Stream - stepped down */}
            <motion.path
              d="M 120 120 L 160 120 L 160 180 L 200 180"
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
            />
            
            {/* ETL to Process - stepped down */}
            <motion.path
              d="M 280 60 L 340 60 L 340 120 L 410 120"
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.4 }}
            />
            
            {/* Stream to Process - stepped up */}
            <motion.path
              d="M 280 180 L 340 180 L 340 120 L 410 120"
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
            
            {/* Process to Store - straight */}
            <motion.path
              d="M 490 120 L 580 120"
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.6 }}
            />

            {/* Animated particles along paths */}
            <circle r="3" fill="var(--foreground)">
              <animateMotion
                dur="3s"
                repeatCount="indefinite"
                path="M 120 120 L 160 120 L 160 60 L 200 60"
              />
            </circle>
            <circle r="3" fill="var(--foreground)">
              <animateMotion
                dur="3.5s"
                repeatCount="indefinite"
                path="M 120 120 L 160 120 L 160 180 L 200 180"
              />
            </circle>
            <circle r="2.5" fill="var(--foreground)">
              <animateMotion
                dur="2.5s"
                repeatCount="indefinite"
                path="M 280 60 L 340 60 L 340 120 L 410 120"
              />
            </circle>
            <circle r="2.5" fill="var(--foreground)">
              <animateMotion
                dur="2.8s"
                repeatCount="indefinite"
                path="M 280 180 L 340 180 L 340 120 L 410 120"
              />
            </circle>
            <circle r="3" fill="var(--foreground)">
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                path="M 490 120 L 580 120"
              />
            </circle>

            {/* Node circles with labels */}
            {stages.map((stage, index) => {
              const Icon = stage.icon
              return (
                <g key={stage.id}>
                  {/* Outer ring */}
                  <motion.circle
                    cx={stage.x}
                    cy={stage.y}
                    r="38"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="1"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                  />
                  {/* Inner filled circle */}
                  <motion.circle
                    cx={stage.x}
                    cy={stage.y}
                    r="32"
                    fill="var(--card)"
                    stroke="var(--border)"
                    strokeWidth="1.5"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.4, type: "spring" }}
                  />
                  {/* Status indicator */}
                  <circle
                    cx={stage.x + 25}
                    cy={stage.y - 25}
                    r="5"
                    fill="#22c55e"
                  />
                  {/* Label below */}
                  <text
                    x={stage.x}
                    y={stage.y + 58}
                    textAnchor="middle"
                    className="fill-foreground text-sm font-medium"
                  >
                    {stage.label}
                  </text>
                  <text
                    x={stage.x}
                    y={stage.y + 74}
                    textAnchor="middle"
                    className="fill-muted-foreground text-xs"
                  >
                    {stage.description}
                  </text>
                </g>
              )
            })}

            {/* Icons as foreignObject */}
            {stages.map((stage) => {
              const Icon = stage.icon
              return (
                <foreignObject
                  key={`icon-${stage.id}`}
                  x={stage.x - 12}
                  y={stage.y - 12}
                  width="24"
                  height="24"
                >
                  <div className="flex h-6 w-6 items-center justify-center text-muted-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                </foreignObject>
              )
            })}
          </svg>
        </div>
      </div>

      {/* Mobile: Vertical list layout */}
      <div className="md:hidden space-y-4">
        {stages.map((stage, index) => {
          const Icon = stage.icon
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card">
                  <Icon className="h-6 w-6 text-muted-foreground" />
                </div>
                <span className="absolute -right-1 -top-1 flex h-3 w-3 rounded-full bg-emerald-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground">{stage.label}</h4>
                <p className="text-xs text-muted-foreground">{stage.description}</p>
              </div>
              {index < stages.length - 1 && (
                <div className="h-8 w-px bg-border" />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Pipeline stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6 md:grid-cols-4">
        {[
          { label: "Uptime", value: "99.97%" },
          { label: "Latency", value: "124ms" },
          { label: "Throughput", value: "2.4TB/day" },
          { label: "Error Rate", value: "0.03%" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
            className="text-center md:text-left"
          >
            <p className="text-lg font-semibold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
      </div>
    </motion.div>
  )
}
