export const greenTheme = {
  name: "green",
  colors: {
    // Primary and secondary shades
    primary: "#f0fdf4",          // very light green background for primary content
    secondary: "#dcfce7",        // light green for secondary elements
    tertiary: "#bbf7d0",         // soft green for tertiary elements

    // Backgrounds
    background: "#f7fef8",       // very light green background color

    // Sidebar
    sidebarText: "#166534",      // dark green for text in the sidebar
    sidebarTextHover: "#14532d", // very dark green text on hover for better contrast
    sidebarActive: "#16a34a",    // green for active sidebar items
    sidebarHover: "#bbf7d0",     // light green hover effect for sidebar items

    // Header
    headerBg: "#f0fdf4",         // very light green background for header
    headerText: "#166534",       // dark green text for header
    headerBorder: "#bbf7d0",     // light green border for header

    // Text
    textPrimary: "#14532d",      // very dark green for main text
    textSecondary: "#166534",    // dark green for secondary text
    textMuted: "#16a34a",        // medium green for muted text

    // Borders
    border: "#bbf7d0",           // light green border color
    borderLight: "#dcfce7",      // very light green border color for less prominent borders

    // Status colors
    success: "#16a34a",          // green for success messages (matches theme)
    warning: "#d97706",          // amber/orange for warning messages
    error: "#dc2626",            // red for error messages
    info: "#0891b2",             // cyan for informational messages

    // Button 
    buttonGhost: "transparent",
    buttonTextOnPrimary: "#ffffff",
    buttonTextOnDanger: "#ffffff",
    buttonTextOnSecondary: "#166534",
    buttonTextOnGhost: "#166534", // dark green text for ghost buttons
    buttonPrimary: "#16a34a",        // Green-600
    buttonPrimaryHover: "#15803d",  // Green-700
    buttonSecondary: "#dcfce7",      // Light green
    buttonSecondaryHover: "#bbf7d0", // Slightly darker light green
    buttonDanger: "#dc2626",         // Red for danger
    buttonDangerHover: "#b91c1c",    // Darker red
    buttonGhostHover: "#dcfce7",     // Light green hover
    buttonBorder: "#bbf7d0",         // Light green border

  },
  shadows: {
    sm: "0 1px 2px 0 rgb(22 163 74 / 0.05)",
    md: "0 4px 6px -1px rgb(22 163 74 / 0.1), 0 2px 4px -2px rgb(22 163 74 / 0.1)",
    lg: "0 10px 15px -3px rgb(22 163 74 / 0.1), 0 4px 6px -4px rgb(22 163 74 / 0.1)",
    xl: "0 20px 25px -5px rgb(22 163 74 / 0.1), 0 8px 10px -6px rgb(22 163 74 / 0.1)",
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