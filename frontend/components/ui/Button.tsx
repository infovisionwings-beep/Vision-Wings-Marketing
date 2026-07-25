"use client";

import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = "relative inline-flex items-center justify-center font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-950 focus-visible:ring-offset-2 transition-colors duration-200 text-body";
  
  const variantClasses = {
    primary: "bg-bronze-500 text-warm-50 rounded-sm hover:bg-bronze-700 active:bg-bronze-900 px-8 py-4",
    secondary: "bg-transparent text-navy-950 border border-navy-950 rounded-sm hover:bg-bronze-700 hover:text-warm-50 hover:border-bronze-700 active:bg-bronze-900 px-8 py-4",
    ghost: "bg-transparent text-navy-950 rounded-sm hover:bg-navy-100 active:bg-navy-300 px-2 py-1",
  };

  return (
    <motion.button
      className={cn(baseClasses, variantClasses[variant], className, disabled || isLoading ? "opacity-40 cursor-not-allowed hover:bg-opacity-40 active:bg-opacity-40" : "")}
      whileHover={!disabled && !isLoading ? { y: -1 } : {}}
      whileTap={!disabled && !isLoading ? { y: 0 } : {}}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-t-transparent border-current rounded-full animate-spin" />
      ) : (
        children
      )}
    </motion.button>
  );
}
