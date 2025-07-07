export const darkTheme = {
  name: "dark",
  colors: {
    // Primary and secondary shades
    primary: "#1f2937",          // dark gray background for primary content
    secondary: "#111827",        // darker gray for secondary elements
    tertiary: "#0f172a",         // very dark for tertiary elements

    // Backgrounds
    background: "#0f172a",       // dark background color (very dark blue-gray)

    // Sidebar
    sidebarText: "#9ca3af",      // light gray for text in the sidebar
    sidebarTextHover: "#f3f4f6", // very light gray text on hover for better contrast
    sidebarActive: "#3b82f6",    // blue for active sidebar items (same as light)
    sidebarHover: "#374151",     // darker gray hover effect for sidebar items

    // Header
    headerBg: "#1f2937",         // dark gray background for header
    headerText: "#f3f4f6",       // light gray text for header
    headerBorder: "#374151",     // dark border for header

    // Text
    textPrimary: "#f3f4f6",      // light gray for main text
    textSecondary: "#d1d5db",    // medium light gray for secondary text
    textMuted: "#6b7280",        // darker gray for muted text

    // Borders
    border: "#374151",           // dark border color
    borderLight: "#4b5563",      // lighter dark border color for less prominent borders

    // Status colors
    success: "#10b981",          // green for success messages (same as light)
    warning: "#f59e0b",          // amber/orange for warning messages (same as light)
    error: "#ef4444",            // red for error messages (same as light)
    info: "#3b82f6",             // blue for informational messages (same as light)

    // Button 
    buttonGhost: "transparent",
    buttonTextOnPrimary: "#ffffff",
    buttonTextOnDanger: "#ffffff",
    buttonTextOnSecondary: "#f3f4f6",
    buttonTextOnGhost: "#f3f4f6", // light text for ghost buttons
    buttonPrimary: "#3b82f6",        // Blue-500 (same as light)
    buttonPrimaryHover: "#2563eb",  // Blue-600 (same as light)
    buttonSecondary: "#374151",      // Dark gray
    buttonSecondaryHover: "#4b5563", // Lighter dark gray
    buttonDanger: "#ef4444",         // Red-500 (same as light)
    buttonDangerHover: "#dc2626",    // Red-600 (same as light)
    buttonGhostHover: "#374151",     // Dark gray hover
    buttonBorder: "#4b5563",         // Dark border

  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.3)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  borderRadius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
  },
};