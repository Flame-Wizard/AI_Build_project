"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Bar,
  Area,
  Legend,
  Cell,
} from "recharts"
import { TrendingUp, Package, AlertTriangle } from "lucide-react"

const historicalData = [
  { date: "Week 1", value: 4200, trend: 4100 },
  { date: "Week 2", value: 4500, trend: 4300 },
  { date: "Week 3", value: 4100, trend: 4500 },
  { date: "Week 4", value: 4800, trend: 4700 },
  { date: "Week 5", value: 5200, trend: 4900 },
  { date: "Week 6", value: 4900, trend: 5100 },
  { date: "Week 7", value: 5500, trend: 5300 },
  { date: "Week 8", value: 5800, trend: 5500 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-border bg-card p-3 shadow-lg"
      >
        <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium text-foreground">
              {entry.value?.toLocaleString()}
            </span>
          </div>
        ))}
      </motion.div>
    )
  }
  return null
}

export function TrendAnalysis({ refreshKey = 0 }: { refreshKey?: number }) {
  const [data, setData] = useState(historicalData)
  const [trendPct, setTrendPct] = useState(12.4)
  const [avgVal, setAvgVal] = useState(0)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    fetch(`${apiUrl}/api/analytics/trend`)
      .then(res => res.json())
      .then(d => {
        if (d && d.data && d.data.length > 0) {
          setData(d.data)
          setTrendPct(d.trend_percentage)
          setAvgVal(d.average_value)
        }
      })
      .catch(err => console.error("Error fetching trend data:", err))
  }, [refreshKey])

  const averageValue = avgVal || data.reduce((acc: any, item: any) => acc + item.value, 0) / data.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="h-full"
    >
      <div className="card-base p-6 flex flex-col h-full justify-between">
        <div className="flex flex-row items-start justify-between pb-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Trend Analysis</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">8-week performance with moving average</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-500">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{trendPct >= 0 ? "+" : ""}{trendPct}%</span>
          </div>
        </div>
        <div className="min-h-[220px] w-full flex-1 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={averageValue}
                stroke="var(--muted-foreground)"
                strokeDasharray="3 3"
                label={{
                  value: "Avg",
                  position: "right",
                  fill: "var(--muted-foreground)",
                  fontSize: 11,
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                name="Actual"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={{ fill: "var(--chart-1)", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, stroke: "var(--chart-1)", strokeWidth: 2, fill: "var(--background)" }}
              />
              <Line
                type="monotone"
                dataKey="trend"
                name="Trend"
                stroke="var(--chart-4)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}

const accuracyMetrics = [
  { label: "MAPE", value: "5.8%", description: "Mean Absolute Percentage Error" },
  { label: "RMSE", value: "342", description: "Root Mean Square Error" },
  { label: "Bias", value: "-2.1%", description: "Forecast Bias" },
]

export function ForecastAccuracy() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="h-full"
    >
      <div className="card-base p-6 flex flex-col h-full justify-between">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-foreground">Forecast Accuracy</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Model performance metrics</p>
        </div>
        <div className="space-y-3">
          {accuracyMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.05 + index * 0.08, duration: 0.3 }}
            className="flex items-center justify-between rounded-xl bg-secondary p-3 transition-colors hover:bg-accent"
          >
            <div>
              <p className="text-sm font-medium text-foreground">{metric.label}</p>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </div>
            <span className="text-lg font-semibold tabular-nums text-foreground">
              {metric.value}
            </span>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.3 }}
        className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground"
      >
        <div className="h-2 w-2 rounded-full bg-emerald-500" />
        <span>All metrics within acceptable range</span>
      </motion.div>
      </div>
    </motion.div>
  )
}

const paretoData = [
  { category: "Electronics", profit: 145000 },
  { category: "Apparel", profit: 65000 },
  { category: "Home Goods", profit: 35000 },
  { category: "Sports", profit: 20000 },
  { category: "Beauty", profit: 12000 },
  { category: "Toys", profit: 8000 },
  { category: "Books", profit: 4000 },
  { category: "Others", profit: 2000 },
];

const totalProfit = paretoData.reduce((acc, curr) => acc + curr.profit, 0);
let currentSum = 0;
const processedParetoData = paretoData.map(item => {
  currentSum += item.profit;
  return {
    ...item,
    cumulativePercent: parseFloat(((currentSum / totalProfit) * 100).toFixed(1))
  };
});

const ParetoTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-border bg-card p-3 shadow-lg"
      >
        <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
        <div className="flex items-center gap-2 text-sm mb-1">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-muted-foreground">Profit:</span>
          <span className="font-medium text-foreground">${payload[0]?.value?.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground">Cumulative:</span>
          <span className="font-medium text-emerald-500">{payload[1]?.value}%</span>
        </div>
      </motion.div>
    )
  }
  return null
}

export function ParetoChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="h-full"
    >
      <div className="card-base p-6 flex flex-col h-full justify-between">
        <div className="flex flex-row items-start justify-between pb-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Profit Pareto Analysis</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">80/20 Rule based on product profitability</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            <Package className="h-3.5 w-3.5" />
            <span>Top 3 = 84%</span>
          </div>
        </div>
        <div className="min-h-[260px] w-full flex-1 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={processedParetoData}
              margin={{ top: 20, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="category" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
              <YAxis yAxisId="right" orientation="right" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
              <Tooltip content={<ParetoTooltip />} />
              <ReferenceLine yAxisId="right" y={80} stroke="var(--chart-4)" strokeDasharray="4 4" label={{ value: '80% Threshold', position: 'insideTopLeft', fill: 'var(--chart-4)', fontSize: 11 }} />
              <Bar yAxisId="left" dataKey="profit" name="Profit" radius={[4, 4, 0, 0]}>
                {processedParetoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index < 3 ? 'var(--primary)' : 'var(--secondary-foreground)'} fillOpacity={index < 3 ? 1 : 0.4} />
                ))}
              </Bar>
              <Line yAxisId="right" type="monotone" dataKey="cumulativePercent" name="Cumulative %" stroke="var(--emerald-500)" strokeWidth={3} dot={{ r: 4, fill: "var(--emerald-500)", strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}

const prophetData = [
  { date: "M-3", actual: 1200, yhat: 1200, lower: 1100, upper: 1300 },
  { date: "M-2", actual: 1350, yhat: 1350, lower: 1200, upper: 1500 },
  { date: "M-1", actual: 1100, yhat: 1100, lower: 950, upper: 1250 },
  { date: "Current", actual: 1400, yhat: 1400, lower: 1250, upper: 1550 },
  { date: "M+1", actual: null, yhat: 1650, lower: 1400, upper: 1900 },
  { date: "M+2", actual: null, yhat: 1850, lower: 1500, upper: 2200 },
  { date: "M+3", actual: null, yhat: 2300, lower: 1850, upper: 2750 },
  { date: "M+4", actual: null, yhat: 2500, lower: 1900, upper: 3100 },
];

const processedProphetData = prophetData.map(item => ({
  ...item,
  uncertaintyRange: [item.lower, item.upper]
}));

const INVENTORY_CAPACITY = 2000;

const ProphetTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isFuture = data.actual === null;
    const needsRestock = data.upper > INVENTORY_CAPACITY;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-border bg-card p-3 shadow-lg"
      >
        <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
        
        {isFuture ? (
          <>
            <div className="flex justify-between gap-4 text-sm mb-1">
              <span className="text-muted-foreground flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-chart-4" />Forecast (yhat):</span>
              <span className="font-medium text-foreground">{data.yhat.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4 text-sm mb-2">
              <span className="text-muted-foreground flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-chart-4 opacity-30" />Uncertainty Interval:</span>
              <span className="font-medium text-muted-foreground">[{data.lower.toLocaleString()}, {data.upper.toLocaleString()}]</span>
            </div>
            {needsRestock && (
              <div className="mt-2 rounded bg-amber-500/10 px-2 py-1 flex items-center gap-1.5 text-xs text-amber-500 font-medium">
                <AlertTriangle className="h-3 w-3" /> Restock Recommended
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" />Actual Demand:</span>
            <span className="font-medium text-foreground">{data.actual.toLocaleString()}</span>
          </div>
        )}
      </motion.div>
    )
  }
  return null
}

export function ProphetForecastChart({ refreshKey = 0 }: { refreshKey?: number }) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    fetch(`${apiUrl}/api/forecast/prophet`)
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        return res.json()
      })
      .then(d => {
        if (d && d.data && d.data.length > 0) {
          setData(d.data.map((item: any) => ({
            ...item,
            uncertaintyRange: [item.lower, item.upper]
          })))
        } else {
          setError("No forecast data returned. Upload a CSV file first.")
        }
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching forecast data:", err)
        setError(`Cannot connect to backend. Check that NEXT_PUBLIC_API_URL is set correctly (currently: ${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"})`)
        setLoading(false)
      })
  }, [refreshKey])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="h-full"
    >
      <div className="card-base p-6 flex flex-col h-full justify-between relative overflow-hidden">
        {/* Restock Warning Badge */}
        <div className="absolute top-6 right-6">
          <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-500">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Restock by M+3</span>
          </div>
        </div>

        <div className="flex flex-row items-start justify-between pb-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Demand Forecast (Prophet)</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">Projected demand vs. inventory capacity</p>
          </div>
        </div>
        
        <div className="min-h-[260px] w-full flex-1 mt-4 flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm">Running Prophet ML forecast...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-2 text-center max-w-sm">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
              <p className="text-sm font-medium text-foreground">Backend not reachable</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-sm text-muted-foreground">Upload a CSV file to generate the Prophet forecast</p>
            </div>
          ) : (
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<ProphetTooltip />} />
              
              {/* Inventory Capacity Line */}
              <ReferenceLine y={INVENTORY_CAPACITY} stroke="var(--amber-500)" strokeDasharray="4 4" strokeWidth={2} label={{ value: 'Inventory Capacity', position: 'insideTopLeft', fill: 'var(--amber-500)', fontSize: 11 }} />
              
              {/* Uncertainty Interval */}
              <Area type="monotone" dataKey="uncertaintyRange" stroke="none" fill="var(--chart-4)" fillOpacity={0.15} activeDot={false} />
              
              {/* Historical Line */}
              <Line type="monotone" dataKey="actual" name="Actual Demand" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--primary)", strokeWidth: 0 }} activeDot={{ r: 6 }} />
              
              {/* Forecast Line */}
              <Line type="monotone" dataKey="yhat" name="Forecast" stroke="var(--chart-4)" strokeWidth={3} strokeDasharray="5 5" dot={false} activeDot={{ r: 6, fill: "var(--chart-4)" }} />
            </ComposedChart>
          </ResponsiveContainer>
          )}
        </div>
      </div>
    </motion.div>
  )
}
