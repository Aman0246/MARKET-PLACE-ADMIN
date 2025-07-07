import React from "react";
import classNames from "classnames";
import { SIZES } from "./variants";
import { useTheme } from "../../../contexts/theme/hook/useTheme";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  loaderText = "Loading...",
  ...props
}) => {
  const { theme } = useTheme();

  const variantStyles = {
    primary: {
      bg: theme.colors.buttonPrimary,
      text: theme.colors.buttonTextOnPrimary,
      hoverBg: theme.colors.buttonPrimaryHover,
    },
    secondary: {
      bg: theme.colors.buttonSecondary,
      text: theme.colors.buttonTextOnSecondary,
      hoverBg: theme.colors.buttonSecondaryHover,
    },
    danger: {
      bg: theme.colors.buttonDanger,
      text: theme.colors.buttonTextOnDanger,
      hoverBg: theme.colors.buttonDangerHover,
    },
    ghost: {
      bg: theme.colors.buttonGhost, // which is "transparent"
      text: theme.colors.buttonTextOnGhost,
      hoverBg: theme.colors.buttonGhostHover,
    },
  };

  const current = variantStyles[variant] || variantStyles.primary;

  const baseStyles =
    "rounded-xl transition-colors duration-200 ease-in-out font-semibold focus:outline-none transition duration-200 active:scale-95 inline-flex items-center justify-center";

  const finalClass = classNames(baseStyles, SIZES[size], className, {
    "opacity-50 cursor-not-allowed": disabled || loading,
  });

  return (
    <button
      type={type}
      className={finalClass}
      disabled={disabled || loading}
      onClick={onClick}
      style={{
        backgroundColor: current.bg,
        color: current.text,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.backgroundColor = current.hoverBg;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.backgroundColor = current.bg;
        }
      }}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5 mr-2 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      )}
      {loading ? loaderText : children}
    </button>
  );
};

export default Button;
