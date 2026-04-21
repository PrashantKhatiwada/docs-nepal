"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, X, User, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface PhotoUploadProps {
  value: string
  onChange: (value: string) => void
  label?: string
  helpText?: string
  className?: string
}

export function PhotoUpload({ value, onChange, label = "Photo", helpText, className }: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, GIF, etc.)",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Convert file to base64 data URL
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        onChange(dataUrl)
        setIsUploading(false)
        toast({
          title: "Photo uploaded",
          description: "Your photo has been uploaded successfully",
        })
      }
      reader.onerror = () => {
        setIsUploading(false)
        toast({
          title: "Upload failed",
          description: "Failed to upload photo. Please try again.",
          variant: "destructive",
        })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      setIsUploading(false)
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleRemovePhoto = () => {
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      {helpText && <p className="text-sm text-muted-foreground">{helpText}</p>}

      <Card className="p-4">
        {value ? (
          // Photo preview
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={value || "/placeholder.svg"}
                alt="Uploaded photo"
                className="w-32 h-32 object-cover rounded-lg border"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={handleRemovePhoto}
                title="Remove photo"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" size="sm" onClick={openFileDialog}>
                <Upload className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
            </div>
          </div>
        ) : (
          // Upload area
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
              isUploading && "opacity-50 pointer-events-none",
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <div className="space-y-2">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Uploading photo...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Upload your photo</p>
                  <p className="text-xs text-muted-foreground">Drag and drop your photo here, or click to browse</p>
                  <p className="text-xs text-muted-foreground">Supports JPG, PNG, GIF up to 5MB</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={openFileDialog}>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Photo
                </Button>
              </div>
            )}
          </div>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />
      </Card>
    </div>
  )
}
