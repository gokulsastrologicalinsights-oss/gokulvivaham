"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "gold" | "outline-gold";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  fullWidth?: boolean;
  as?: "button" | "a";
  href?: string;
}

const variantClasses = {
  primary:
    "bg-gradient-to-r from-maroon-900 to-maroon-800 text-ivory-100 hover:from-maroon-800 hover:to-maroon-700 shadow-lg hover:shadow-maroon-900/30 border border-maroon-700",
  secondary:
    "bg-white text-maroon-900 border-2 border-maroon-800 hover:bg-maroon-50 hover:border-maroon-700 shadow-sm",
  ghost:
    "bg-transparent text-maroon-800 hover:bg-maroon-50 border border-transparent hover:border-maroon-200",
  gold:
    "bg-gradient-to-r from-gold-600 to-gold-500 text-white hover:from-gold-500 hover:to-gold-400 shadow-lg hover:shadow-gold-500/30 border border-gold-400",
  "outline-gold":
    "bg-transparent text-gold-600 border-2 border-gold-500 hover:bg-gold-50 hover:text-gold-700",
};

const sizeClasses = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-2.5 text-sm rounded-xl",
  lg: "px-8 py-3 text-base rounded-xl",
  xl: "px-10 py-4 text-lg rounded-2xl",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  fullWidth = false,
  className = "",
  as = "button",
  href,
  ...props
}: ButtonProps) {
  const classes = [
    "inline-flex items-center justify-center gap-2 font-semibold",
    "transition-all duration-300 ease-out",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2",
    "active:scale-[0.98] cursor-pointer",
    "select-none",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (as === "a" && href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
