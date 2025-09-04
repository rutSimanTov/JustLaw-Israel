import React from "react"

type CheckboxProps = {
  id: string
  label?: string
  checked?: boolean
  disabled?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  name?: string
  value?: string
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked,
  disabled = false,
  onChange,
  name,
  value,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={id}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
      />
      {label && (
        <label htmlFor={id} className="text-sm text-gray-700">
          {label}
        </label>
      )}
    </div>
  )
}
Checkbox.displayName = "Checkbox"


