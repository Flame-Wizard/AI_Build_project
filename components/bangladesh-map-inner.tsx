"use client"

import { useState, useRef, useMemo } from "react"
import { MapContainer, GeoJSON } from "react-leaflet"
import L from "leaflet"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, TrendingUp, TrendingDown, Globe, X } from "lucide-react"
import { cn } from "@/lib/utils"

import bdGeoData from './bangladesh.json'

// Forecast data for Bangladesh divisions
const baseForecastData = [
  { name: "Dhaka", demand: 15400, growth: 22.4, confidence: 95, stock: 12000 },
  { name: "Chattogram", demand: 9800, growth: 15.2, confidence: 92, stock: 8500 },
  { name: "Sylhet", demand: 4200, growth: 8.4, confidence: 88, stock: 5000 },
  { name: "Rajshahi", demand: 5600, growth: 12.1, confidence: 85, stock: 6100 },
  { name: "Khulna", demand: 6100, growth: 5.6, confidence: 89, stock: 6500 },
  { name: "Barishal", demand: 3200, growth: 4.2, confidence: 82, stock: 3800 },
  { name: "Rangpur", demand: 4100, growth: 9.8, confidence: 84, stock: 4500 },
  { name: "Mymensingh", demand: 3800, growth: 11.5, confidence: 86, stock: 3200 },
]

const bgdForecastData: Record<string, any> = {
  "Dhaka": baseForecastData[0],
  "Chattogram": baseForecastData[1],
  "Chittagong": baseForecastData[1],
  "Sylhet": baseForecastData[2],
  "Rajshahi": baseForecastData[3],
  "Khulna": baseForecastData[4],
  "Barishal": baseForecastData[5],
  "Barisal": baseForecastData[5],
  "Rangpur": baseForecastData[6],
  "Mymensingh": baseForecastData[7],
}



function getDemandColor(demand: number): string {
  if (demand >= 10000) return "#7c3aed"
  if (demand >= 7000) return "#8b5cf6"
  if (demand >= 5000) return "#a78bfa"
  if (demand >= 3000) return "#c4b5fd"
  if (demand >= 1000) return "#ddd6fe"
  return "#ede9fe"
}

function getGeoData(geo: any) {
  const props = geo.properties || {}
  const divisionName = props.division_name || props.NAME_1 || ""
  const districtName = props.district_name || props.NAME_2 || ""
  const upazilaName = props.name || props.Name || districtName || divisionName || "Unknown"

  // Try to match by division name
  const dataKey = Object.keys(bgdForecastData).find(k =>
    divisionName?.toLowerCase().includes(k.toLowerCase()) ||
    districtName?.toLowerCase().includes(k.toLowerCase()) ||
    upazilaName?.toLowerCase().includes(k.toLowerCase())
  )

  if (dataKey) {
    return { ...bgdForecastData[dataKey], name: upazilaName }
  }

  // Generate deterministic mock data for unmatched areas
  const str = upazilaName || "Unknown"
  const hash = str.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0)

  return {
    name: upazilaName,
    demand: (hash % 15) * 1000 + 1000,
    growth: parseFloat(((hash % 40) - 10).toFixed(1)),
    confidence: (hash % 20) + 75,
    stock: (hash % 10) * 1000 + 500
  }
}

export default function BangladeshMapInner() {
  const [selectedArea, setSelectedArea] = useState<any>(null)
  
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const selectedLayerRef = useRef<L.Path | null>(null)
  const selectedLayerDataRef = useRef<any>(null)

  const regionStats = useMemo(() => {
    const entries = baseForecastData
    const totalDemand = entries.reduce((sum, c) => sum + c.demand, 0)
    const totalStock = entries.reduce((sum, c) => sum + c.stock, 0)
    const avgConfidence = Math.round(entries.reduce((sum, c) => sum + c.confidence, 0) / entries.length)
    const avgGrowth = +(entries.reduce((sum, c) => sum + c.growth, 0) / entries.length).toFixed(1)
    return { totalDemand, totalStock, avgConfidence, avgGrowth, count: entries.length }
  }, [])

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const data = getGeoData(feature)
    
    layer.on({
      mouseover: (e: L.LeafletMouseEvent) => {
        const path = e.target as L.Path
        const isSelected = selectedLayerRef.current === path
        
        path.setStyle({
          fillColor: '#6d28d9',
          color: isSelected ? '#3b82f6' : 'var(--foreground)',
          weight: isSelected ? 1.5 : 1,
          fillOpacity: 1
        })
        path.bringToFront()
        if (selectedLayerRef.current && selectedLayerRef.current !== path) {
            selectedLayerRef.current.bringToFront()
        }
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        const path = e.target as L.Path
        const isSelected = selectedLayerRef.current === path
        const baseFill = getDemandColor(data.demand)
        
        path.setStyle({
          fillColor: baseFill,
          color: isSelected ? '#3b82f6' : 'var(--border)',
          weight: isSelected ? 1.5 : 0.5,
          fillOpacity: 1
        })
      },
      click: (e: L.LeafletMouseEvent) => {
        const path = e.target as L.Path
        
        if (selectedLayerRef.current && selectedLayerRef.current !== path) {
            const prevData = selectedLayerDataRef.current
            const prevBaseFill = prevData ? getDemandColor(prevData.demand) : "var(--secondary)"
            
            selectedLayerRef.current.setStyle({
                fillColor: prevBaseFill,
                weight: 0.5,
                color: 'var(--border)',
                fillOpacity: 1
            })
        }
        
        path.setStyle({
            weight: 1.5,
            color: '#3b82f6',
            fillColor: '#6d28d9',
            fillOpacity: 1
        })
        path.bringToFront()
        selectedLayerRef.current = path
        selectedLayerDataRef.current = data
        setSelectedArea(data)
        
        const map = e.target._map as L.Map
        if (map && typeof map.fitBounds === 'function' && typeof e.target.getBounds === 'function') {
            map.fitBounds(e.target.getBounds(), { padding: [50, 50], maxZoom: 8 })
        }
      }
    })
  }

  const styleFeature = (feature: any) => {
    const data = getGeoData(feature)
    const fillColor = getDemandColor(data.demand)
    
    return {
      fillColor,
      weight: 0.5,
      opacity: 1,
      color: 'var(--border)',
      fillOpacity: 1
    }
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Globe className="h-4 w-4 text-foreground" />
            Bangladesh Demand Forecast
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            District-level demand heatmap powered by Leaflet
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Demand", value: `${(regionStats.totalDemand / 1000).toFixed(1)}k`, sub: "units" },
          { label: "Total Stock", value: `${(regionStats.totalStock / 1000).toFixed(1)}k`, sub: "units" },
          { label: "Avg Confidence", value: `${regionStats.avgConfidence}%`, sub: "accuracy" },
          {
            label: "Avg Growth",
            value: `${regionStats.avgGrowth > 0 ? "+" : ""}${regionStats.avgGrowth}%`,
            sub: "vs last period",
            positive: regionStats.avgGrowth >= 0,
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
            className="rounded-xl bg-secondary/60 px-3 py-2.5"
          >
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</p>
            <p className={cn(
              "mt-0.5 text-lg font-semibold tabular-nums",
              stat.positive !== undefined
                ? stat.positive
                  ? "text-emerald-500"
                  : "text-red-500"
                : "text-foreground"
            )}>
              {stat.value}
            </p>
            <p className="text-[10px] text-muted-foreground">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Map */}
      <div 
        ref={mapContainerRef}
        className="relative overflow-hidden rounded-xl border border-border bg-secondary/30" 
        style={{ height: 500 }}
      >
        {/* Selected Area Details */}
        <AnimatePresence>
          {selectedArea && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto absolute bottom-4 left-4 right-4 z-[1000] sm:bottom-auto sm:left-auto sm:right-4 sm:top-4 sm:w-64 rounded-xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur-md"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">{selectedArea.name}</span>
                </div>
                <button 
                    onClick={() => {
                        setSelectedArea(null)
                        if (selectedLayerRef.current) {
                            const prevData = selectedLayerDataRef.current
                            const prevBaseFill = prevData ? getDemandColor(prevData.demand) : "var(--secondary)"
                            
                            selectedLayerRef.current.setStyle({
                                fillColor: prevBaseFill,
                                weight: 0.5,
                                color: 'var(--border)',
                                fillOpacity: 1
                            })
                            selectedLayerRef.current = null
                            selectedLayerDataRef.current = null
                        }
                    }}
                    className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Demand</span>
                  <span className="text-xs font-semibold tabular-nums text-foreground">
                    {selectedArea.demand.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Stock</span>
                  <span className="text-xs font-semibold tabular-nums text-foreground">
                    {selectedArea.stock.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Growth</span>
                  <span
                    className={cn(
                      "flex items-center gap-1 text-xs font-semibold tabular-nums",
                      selectedArea.growth >= 0 ? "text-emerald-500" : "text-red-500"
                    )}
                  >
                    {selectedArea.growth >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {selectedArea.growth > 0 ? "+" : ""}
                    {selectedArea.growth}%
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map SVG */}
        <MapContainer 
          center={[23.6850, 90.3563]} 
          zoom={7} 
          style={{ width: "100%", height: "100%", zIndex: 1, background: 'transparent' }}
          zoomControl={true}
          scrollWheelZoom={false}
        >
          <GeoJSON 
            data={bdGeoData as any} 
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        </MapContainer>
      </div>

      {/* Bottom: Top Markets */}
      <div className="pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Top Divisions by Forecasted Demand
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {baseForecastData
            .sort((a, b) => b.demand - a.demand)
            .slice(0, 6)
            .map((division, i) => (
              <motion.div
                key={division.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.04, duration: 0.25 }}
                className="group flex items-center justify-between rounded-xl bg-secondary/50 px-3 py-2.5 transition-colors hover:bg-secondary"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: getDemandColor(division.demand) }}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{division.name}</p>
                    <p className="text-[10px] text-muted-foreground">Bangladesh</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums text-foreground">
                    {(division.demand / 1000).toFixed(1)}k
                  </p>
                  <p
                    className={cn(
                      "flex items-center justify-end gap-0.5 text-[10px] font-medium tabular-nums",
                      division.growth >= 0 ? "text-emerald-500" : "text-red-500"
                    )}
                  >
                    {division.growth >= 0 ? (
                      <TrendingUp className="h-2.5 w-2.5" />
                    ) : (
                      <TrendingDown className="h-2.5 w-2.5" />
                    )}
                    {division.growth > 0 ? "+" : ""}
                    {division.growth}%
                  </p>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  )
}
