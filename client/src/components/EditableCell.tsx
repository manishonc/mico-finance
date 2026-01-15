import { useState, useRef, useEffect } from 'react'

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
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = async () => {
    if (editValue !== value) {
      await onSave(editValue)
    }
    setIsEditing(false)
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
        className={`block w-full min-w-0 appearance-none outline-none bg-transparent border-none p-0 m-0 font-inherit text-inherit ${className}`}
        style={{
          lineHeight: 'inherit',
          width: '100%',
          minWidth: 0,
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      />
    )
  }

  const renderedValue = displayValue ?? value

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
