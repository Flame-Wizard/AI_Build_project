"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, ChevronLeft, ChevronRight, Download, Search } from "lucide-react"

export function DataExplorer({ refreshKey = 0 }: { refreshKey?: number }) {
  const [data, setData] = useState<any[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalRows, setTotalRows] = useState(0)
  const limit = 20

  useEffect(() => {
    setLoading(true)
    setError(null)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    
    fetch(`${apiUrl}/api/data/raw?page=${page}&limit=${limit}`)
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        return res.json()
      })
      .then(d => {
        if (d && d.columns) {
          setColumns(d.columns)
          setData(d.data || [])
          setTotalPages(d.total_pages || 0)
          setTotalRows(d.total_rows || 0)
        } else {
          setError("Invalid data format received.")
        }
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching raw data:", err)
        setError("Cannot connect to backend.")
        setLoading(false)
      })
  }, [refreshKey, page])

  const handleExportCSV = () => {
    if (data.length === 0 || columns.length === 0) return;
    
    // Quick CSV generator for the CURRENT PAGE (could be expanded to download full data)
    const header = columns.join(",")
    const rows = data.map(row => 
      columns.map(col => {
        let val = row[col]
        if (val === null || val === undefined) return ""
        if (typeof val === "string" && val.includes(",")) return `"${val}"`
        return val
      }).join(",")
    )
    
    const csvContent = [header, ...rows].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `data_export_page_${page}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading && data.length === 0) {
    return (
      <div className="card-base p-12 flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-4" />
        <p className="text-muted-foreground text-sm">Loading dataset...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card-base p-12 flex flex-col items-center justify-center min-h-[400px]">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-1">Unable to load data</h3>
        <p className="text-muted-foreground text-sm">{error}</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="card-base p-12 flex flex-col items-center justify-center min-h-[400px]">
        <h3 className="text-lg font-medium text-foreground mb-1">No Data Available</h3>
        <p className="text-muted-foreground text-sm">Upload a CSV file in the Overview tab to view its raw data here.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card-base flex flex-col overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-border gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Dataset Explorer</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Viewing {data.length} of {totalRows.toLocaleString()} total rows
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export Page
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-3 font-medium tracking-wider whitespace-nowrap">
                  {col.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-muted/30 transition-colors">
                {columns.map((col, colIndex) => {
                  const val = row[col]
                  // Handle different data types gracefully
                  const displayVal = val === null || val === "" 
                    ? <span className="text-muted-foreground/50 italic">null</span>
                    : typeof val === 'number' 
                      ? val.toLocaleString(undefined, { maximumFractionDigits: 2 })
                      : String(val)
                      
                  return (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-foreground">
                      {displayVal}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between p-4 border-t border-border bg-secondary/20">
        <span className="text-sm text-muted-foreground">
          Page <span className="font-medium text-foreground">{page}</span> of <span className="font-medium text-foreground">{totalPages}</span>
        </span>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="p-1.5 rounded-md text-foreground bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading || totalPages === 0}
            className="p-1.5 rounded-md text-foreground bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
