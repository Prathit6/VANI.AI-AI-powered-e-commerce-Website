// src/components/ui/basic-ui.jsx
// Simple reusable UI wrappers (Button, Card, Badge, etc.)

import React from "react";
import clsx from "clsx";

// ✅ Button
export const Button = ({
  children,
  onClick,
  variant = "default",
  className = "",
  disabled = false,
  ...props
}) => {
  const base =
    "rounded-lg font-medium transition-all duration-200 px-4 py-2 focus:outline-none";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400",
    outline:
      "border border-gray-300 text-gray-800 hover:bg-gray-100 disabled:opacity-60",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(base, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

// ✅ Card
export const Card = ({ children, className = "" }) => (
  <div
    className={clsx(
      "bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden",
      className
    )}
  >
    {children}
  </div>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={clsx("p-4", className)}>{children}</div>
);

export const CardFooter = ({ children, className = "" }) => (
  <div className={clsx("p-4 border-t border-gray-100", className)}>
    {children}
  </div>
);

// ✅ Badge
export const Badge = ({ children, className = "" }) => (
  <span
    className={clsx(
      "inline-block text-xs font-semibold px-2 py-1 rounded-full bg-gray-200 text-gray-700",
      className
    )}
  >
    {children}
  </span>
);
