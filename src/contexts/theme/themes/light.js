export const lightTheme = {
  name: "light",
  colors: {
    // Primary and secondary shades
    primary: "#ffffff",          // white background for primary content
    secondary: "#f8fafc",        // very light gray for secondary elements
    tertiary: "#f1f5f9",         // off-white for tertiary elements

    // Backgrounds
    background: "#f9fafb",       // light background color (off-white)

    // Sidebar
    sidebarText: "#6b7280",      // muted gray for text in the sidebar
    sidebarTextHover: "#1f2937", // dark gray text on hover for better contrast
    sidebarActive: "#3b82f6",    // blue for active sidebar items
    sidebarHover: "#e5e7eb",     // light gray hover effect for sidebar items

    // Header
    headerBg: "#ffffff",         // white background for header
    headerText: "#1f2937",       // dark gray text for header
    headerBorder: "#e5e7eb",     // light border for header

    // Text
    textPrimary: "#1f2937",      // dark gray for main text
    textSecondary: "#4b5563",    // medium gray for secondary text
    textMuted: "#9ca3af",        // light gray for muted text

    // Borders
    border: "#e5e7eb",           // light border color
    borderLight: "#f3f4f6",     // lighter border color for less prominent borders

    // Status colors
    success: "#10b981",          // green for success messages
    warning: "#f59e0b",          // amber/orange for warning messages
    error: "#ef4444",            // red for error messages
    info: "#3b82f6",             // blue for informational messages

    // Button 
    buttonGhost: "transparent",
    buttonTextOnPrimary: "#ffffff",
    buttonTextOnDanger: "#ffffff",
    buttonTextOnSecondary: "#1f2937",
    buttonTextOnGhost: "#1f2937", // or reuse `textPrimary`
    buttonPrimary: "#3b82f6",        // Blue-500
    buttonPrimaryHover: "#2563eb",  // Blue-600
    buttonSecondary: "#e2e8f0",      // Gray-200
    buttonSecondaryHover: "#cbd5e1", // Gray-300
    buttonDanger: "#ef4444",         // Red-500
    buttonDangerHover: "#dc2626",    // Red-600
    buttonGhostHover: "#f3f4f6",     // Gray-100
    buttonBorder: "#e5e7eb",         // Optional global border

  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
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
