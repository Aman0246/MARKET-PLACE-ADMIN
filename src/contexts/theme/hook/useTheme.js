// src/contexts/theme/useTheme.js
import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";  // Named import (correct!)

export const useTheme = () => {
  const context = useContext(ThemeContext);
  return context;
};
