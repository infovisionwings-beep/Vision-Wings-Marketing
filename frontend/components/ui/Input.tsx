import { InputHTMLAttributes, forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    // Generate a unique ID if one isn't provided, useful for linking label and input
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor={inputId} className="text-body-sm font-medium text-navy-950">
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full px-4 py-3 bg-warm-50 rounded-sm text-body text-navy-950",
            "border border-navy-100 transition-colors duration-200",
            "focus:outline-none focus:border-transparent focus:ring-2 focus:ring-bronze-900 focus:bg-warm-100",
            "disabled:opacity-50 disabled:bg-warm-100 disabled:cursor-not-allowed",
            "placeholder:text-navy-300",
            error ? "border-red-500 focus:ring-red-500" : "",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-body-sm text-red-500 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;
