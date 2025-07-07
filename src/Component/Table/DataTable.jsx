import React, { useState } from "react";
import { useTheme } from "../../contexts/theme/hook/useTheme";

const DataTable = ({ columns, data }) => {
  const { theme } = useTheme();
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });

  const handleMouseEnter = (e, value) => {
    if (String(value).length > 30) {
      const rect = e.target.getBoundingClientRect();
      setTooltip({
        visible: true,
        content: String(value),
        x: rect.left,
        y: rect.top - 10,
      });
    }
  };

  const handleMouseLeave = (e) => {
    const related = e.relatedTarget;
    if (!related || !related.closest(".custom-tooltip")) {
      setTooltip({ visible: false, content: "", x: 0, y: 0 });
    }
  };

  return (
    <>
      <div className="overflow-x-auto w-full">
        <table
          className="min-w-full text-sm text-left table-fixed border"
          style={{ borderColor: theme.colors.border }}
        >
          <thead style={{ backgroundColor: theme.colors.tertiary }}>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="p-2 font-medium border-b"
                  style={{
                    color: theme.colors.textPrimary,
                    borderColor: theme.colors.borderLight,
                    width: col.width || "auto",
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-opacity-75"
                style={{
                  borderBottom: `1px solid ${theme.colors.border}`,
                  backgroundColor: theme.colors.background,
                  color: theme.colors.textPrimary,
                }}
              >
                {columns.map((col) => {
                  const value = row[col.key];
                  const content = col.render
                    ? col.render(value, row)
                    : String(value);

                  return (
                    <td
                      key={col.key}
                      className="p-2 max-w-[200px] truncate align-top"
                      onMouseEnter={(e) => handleMouseEnter(e, value)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="truncate">{content}</div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tooltip with theme */}
      {tooltip.visible && (
        <div
          className="fixed z-[9999] pointer-events-auto custom-tooltip"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: "translateY(-100%)",
          }}
          onMouseEnter={() =>
            setTooltip((prev) => ({ ...prev, visible: true }))
          }
          onMouseLeave={() =>
            setTooltip({ visible: false, content: "", x: 0, y: 0 })
          }
        >
          {/* Arrow */}
          <div
            className="absolute left-3 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent"
            style={{
              borderTopColor: theme.colors.background,
            }}
          />

          {/* Tooltip Box */}
          <div
            className="text-sm p-3 break-words whitespace-normal shadow-xl max-w-xs rounded-lg"
            style={{
              backgroundColor: theme.colors.background,
              color: theme.colors.textPrimary,
              border: `1px solid ${theme.colors.borderLight}`,
              boxShadow: theme.shadows.lg,
            }}
          >
            {tooltip.content}
          </div>
        </div>
      )}
    </>
  );
};

export default DataTable;
