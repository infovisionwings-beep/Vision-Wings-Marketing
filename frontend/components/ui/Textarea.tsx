import { TextareaHTMLAttributes, forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label 
            htmlFor={textareaId} 
            className="text-[11px] font-mono font-semibold uppercase tracking-wider text-navy-700 flex items-center justify-between"
          >
            <span>{label}</span>
            {props.required && <span className="text-[9px] text-bronze-600 font-mono font-normal tracking-normal">REQUIRED</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            "w-full px-4 py-3.5 bg-white/90 rounded-lg text-[16px] sm:text-body text-navy-950 min-h-[120px] resize-y shadow-[0_2px_4px_rgba(0,0,0,0.02)]",
            "border border-navy-200/80 transition-all duration-200 hover:border-navy-400",
            "focus:outline-none focus:border-bronze-500 focus:ring-4 focus:ring-bronze-500/15 focus:bg-white",
            "disabled:opacity-50 disabled:bg-warm-100 disabled:cursor-not-allowed",
            "placeholder:text-navy-400/70 font-medium",
            error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500 bg-red-50/10" : "",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
          {...props}
        />
        {helperText && !error && (
          <p id={`${textareaId}-helper`} className="text-caption text-navy-400 mt-0.5">
            {helperText}
          </p>
        )}
        {error && (
          <p id={`${textareaId}-error`} className="text-caption font-medium text-red-500 mt-0.5 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export default Textarea;
