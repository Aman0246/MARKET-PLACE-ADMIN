export const redTheme = {
  name: "red",
  colors: {
    // Primary and secondary shades
    primary: "#fef2f2",          // very light red background for primary content
    secondary: "#fee2e2",        // light red for secondary elements
    tertiary: "#fecaca",         // soft red for tertiary elements

    // Backgrounds
    background: "#fff5f5",       // very light red background color

    // Sidebar
    sidebarText: "#7f1d1d",      // dark red for text in the sidebar
    sidebarTextHover: "#450a0a", // very dark red text on hover for better contrast
    sidebarActive: "#dc2626",    // red for active sidebar items
    sidebarHover: "#fecaca",     // light red hover effect for sidebar items

    // Header
    headerBg: "#fef2f2",         // very light red background for header
    headerText: "#7f1d1d",       // dark red text for header
    headerBorder: "#fecaca",     // light red border for header

    // Text
    textPrimary: "#450a0a",      // very dark red for main text
    textSecondary: "#7f1d1d",    // dark red for secondary text
    textMuted: "#b91c1c",        // medium red for muted text

    // Borders
    border: "#fecaca",           // light red border color
    borderLight: "#fee2e2",      // very light red border color for less prominent borders

    // Status colors
    success: "#059669",          // green for success messages (emerald)
    warning: "#d97706",          // amber/orange for warning messages
    error: "#dc2626",            // red for error messages (matches theme)
    info: "#0891b2",             // cyan for informational messages

    // Button 
    buttonGhost: "transparent",
    buttonTextOnPrimary: "#ffffff",
    buttonTextOnDanger: "#ffffff",
    buttonTextOnSecondary: "#7f1d1d",
    buttonTextOnGhost: "#7f1d1d", // dark red text for ghost buttons
    buttonPrimary: "#dc2626",        // Red-600
    buttonPrimaryHover: "#b91c1c",  // Red-700
    buttonSecondary: "#fee2e2",      // Light red
    buttonSecondaryHover: "#fecaca", // Slightly darker light red
    buttonDanger: "#991b1b",         // Dark red
    buttonDangerHover: "#7f1d1d",    // Even darker red
    buttonGhostHover: "#fee2e2",     // Light red hover
    buttonBorder: "#fecaca",         // Light red border

  },
  shadows: {
    sm: "0 1px 2px 0 rgb(220 38 38 / 0.05)",
    md: "0 4px 6px -1px rgb(220 38 38 / 0.1), 0 2px 4px -2px rgb(220 38 38 / 0.1)",
    lg: "0 10px 15px -3px rgb(220 38 38 / 0.1), 0 4px 6px -4px rgb(220 38 38 / 0.1)",
    xl: "0 20px 25px -5px rgb(220 38 38 / 0.1), 0 8px 10px -6px rgb(220 38 38 / 0.1)",
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