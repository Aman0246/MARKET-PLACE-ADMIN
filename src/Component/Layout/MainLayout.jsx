import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import { useTheme } from "../../contexts/theme/hook/useTheme";

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useTheme();

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Auto-close sidebar on mobile by default
      if (mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
      // Auto-open sidebar on desktop if it was closed due to mobile
      else if (!mobile && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          // On desktop: apply margin based on sidebar state
          // On mobile: no margin (sidebar overlays)
          isMobile
            ? ""
            : isSidebarOpen
              ? "ml-64"
              : "ml-16"
          }`}
      >
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <main
          className="flex-1 p-6 overflow-y-auto"
          style={{
            backgroundColor: theme.colors.background,
            color: theme.colors.textPrimary,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;