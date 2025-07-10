import React, { createContext, useContext, useState, useCallback } from "react";
import { v4 as uuid } from "uuid";
import "./toast.css";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = useCallback((type, message, duration = 3000) => {
    const id = uuid();
    setToasts((prev) => [...prev, { id, type, message, duration }]);

    setTimeout(() => removeToast(id), duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(({ id, type, message, duration }) => (
          <div
            key={id}
            className={`
    toast
    relative overflow-hidden px-4 py-3  shadow-lg text-white 
    flex justify-between items-center min-w-[240px] max-w-xs
    ${type === "success"
                ? "bg-green-600"
                : type === "error"
                  ? "bg-red-600"
                  : type === "info"
                    ? "bg-blue-600"
                    : "bg-yellow-600"
              }
  `}
          >
            <span>{message}</span>
            <button onClick={() => removeToast(id)} className="ml-4 font-bold">
              &times;
            </button>

            <div
              className="absolute bottom-0 left-0 h-1 bg-white/70 toast-progress"
              style={{ animationDuration: `${duration}ms` }}
            ></div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToastContext = () => useContext(ToastContext);
