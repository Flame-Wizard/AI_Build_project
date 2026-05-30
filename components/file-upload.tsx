"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Upload, X, FileText, CheckCircle, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onUploadSuccess: () => void;
}

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0])
    }
  }

  const handleFileSelection = (selectedFile: File) => {
    if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
      setStatus("error")
      setMessage("Please select a valid CSV file.")
      return
    }
    setFile(selectedFile)
    setStatus("idle")
    setMessage("")
  }

  const clearFile = () => {
    setFile(null)
    setStatus("idle")
    setMessage("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setStatus("idle")
    
    const formData = new FormData()
    formData.append("file", file)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      setStatus("success")
      setMessage(data.message || "File uploaded successfully!")
      onUploadSuccess() // Trigger refetch in parent
      
    } catch (error) {
      setStatus("error")
      setMessage("Failed to upload file. Make sure the backend server is running.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-base p-6 mb-6"
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">Data Upload</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">Upload your company's CSV data to generate real-time forecasts and insights.</p>
      </div>

      {!file ? (
        <div
          className={cn(
            "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:bg-secondary/50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".csv"
            onChange={handleFileChange}
          />
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground mb-3">
            <Upload className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-foreground">Click or drag file to this area to upload</p>
          <p className="text-xs text-muted-foreground mt-1">Support for a single or bulk CSV upload.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <button
              onClick={clearFile}
              disabled={isUploading}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-background hover:text-foreground disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {status === "success" && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                  <CheckCircle className="h-4 w-4" />
                  {message}
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-red-500">
                  <AlertTriangle className="h-4 w-4" />
                  {message}
                </div>
              )}
            </div>
            
            <button
              onClick={handleUpload}
              disabled={isUploading || status === "success"}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : status === "success" ? "Uploaded" : "Analyze Data"}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
