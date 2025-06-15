"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Bold, Italic, Underline, List, ListOrdered, Type } from "lucide-react"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

// Sanitize HTML to prevent XSS attacks
function sanitizeHtml(html: string): string {
  // Create a temporary div to parse HTML
  const temp = document.createElement("div")
  temp.innerHTML = html

  // Remove all script tags and event handlers
  const scripts = temp.querySelectorAll("script")
  scripts.forEach((script) => script.remove())

  // Remove dangerous attributes
  const allElements = temp.querySelectorAll("*")
  allElements.forEach((element) => {
    // Remove event handler attributes
    Array.from(element.attributes).forEach((attr) => {
      if (attr.name.startsWith("on") || attr.name === "javascript:") {
        element.removeAttribute(attr.name)
      }
    })

    // Only allow safe tags
    const allowedTags = ["b", "strong", "i", "em", "u", "ul", "ol", "li", "br", "p", "div"]
    if (!allowedTags.includes(element.tagName.toLowerCase())) {
      // Replace with span or remove
      if (element.textContent) {
        const span = document.createElement("span")
        span.textContent = element.textContent
        element.parentNode?.replaceChild(span, element)
      } else {
        element.remove()
      }
    }
  })

  return temp.innerHTML
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter text...",
  className,
  minHeight = "120px",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      const sanitizedContent = sanitizeHtml(editorRef.current.innerHTML)
      onChange(sanitizedContent)
    }
  }

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
  }

  const isCommandActive = (command: string): boolean => {
    return document.queryCommandState(command)
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn("h-8 w-8 p-0", isCommandActive("bold") && "bg-accent")}
          onClick={() => executeCommand("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn("h-8 w-8 p-0", isCommandActive("italic") && "bg-accent")}
          onClick={() => executeCommand("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn("h-8 w-8 p-0", isCommandActive("underline") && "bg-accent")}
          onClick={() => executeCommand("underline")}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn("h-8 w-8 p-0", isCommandActive("insertUnorderedList") && "bg-accent")}
          onClick={() => executeCommand("insertUnorderedList")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn("h-8 w-8 p-0", isCommandActive("insertOrderedList") && "bg-accent")}
          onClick={() => executeCommand("insertOrderedList")}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => executeCommand("removeFormat")}
          title="Clear Formatting"
        >
          <Type className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className={cn(
          "p-3 outline-none prose prose-sm max-w-none",
          "focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
          !isFocused && !value && "text-muted-foreground",
        )}
        style={{ minHeight }}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        dangerouslySetInnerHTML={{
          __html: value || (isFocused ? "" : `<span style="color: hsl(var(--muted-foreground))">${placeholder}</span>`),
        }}
        suppressContentEditableWarning={true}
      />
    </Card>
  )
}
