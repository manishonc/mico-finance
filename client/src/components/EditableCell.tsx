import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface EditableCellProps {
  value: string | number
  displayValue?: string | number
  onSave: (newValue: string | number) => Promise<void>
  type?: 'text' | 'number' | 'date'
  className?: string
}

export function EditableCell({
  value,
  displayValue,
  onSave,
  type = 'text',
  className = '',
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Only update editValue if we're not currently editing or saving
    // This prevents the flash when the value prop updates after save
    if (!isEditing && !isSaving) {
      setEditValue(value)
    }
  }, [value, isEditing, isSaving])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = async () => {
    if (editValue !== value) {
      setIsSaving(true)
      setIsEditing(false)
      try {
        await onSave(editValue)
        // Give React a moment to process the optimistic update
        await new Promise(resolve => setTimeout(resolve, 0))
      } finally {
        setIsSaving(false)
      }
    } else {
      setIsEditing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    }
  }

  if (isEditing) {
    const inputType = type === 'number' ? 'text' : type
    const inputMode = type === 'number' ? 'decimal' : undefined

    return (
      <input
        ref={inputRef}
        type={inputType}
        inputMode={inputMode}
        size={1}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "block w-full min-w-0 appearance-none bg-input border border-border rounded shadow-sm",
          "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-md outline-none",
          "p-0 m-0 font-inherit text-inherit text-sm",
          "text-foreground placeholder:text-muted-foreground",
          className
        )}
        style={{
          lineHeight: 'inherit',
          width: '100%',
          minWidth: 0,
          maxWidth: '100%',
          boxSizing: 'border-box',
          padding: '4px 6px',
        }}
      />
    )
  }

  // While saving, show the editValue to prevent flash of old value
  // Once value prop updates (from optimistic update), it will show the new value
  const renderedValue = isSaving ? editValue : (displayValue ?? value)

  return (
    <div
      className="w-full cursor-text"
      onClick={(e) => {
        e.stopPropagation()
        setIsEditing(true)
      }}
    >
      <span className={className}>{renderedValue}</span>
    </div>
  )
}
