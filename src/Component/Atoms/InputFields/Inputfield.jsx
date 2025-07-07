import React from "react";
import classNames from "classnames";

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  name,
  placeholder,
  error,
  helperText,
  disabled = false,
  fullWidth = false,
  className = "",
  ...props
}) => {
  return (
    <div className={classNames("mb-4", { "w-full": fullWidth })}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={classNames(
          "border rounded-lg px-4 py-2 w-full focus:outline-none transition",
          {
            "border-gray-300 focus:ring-2 focus:ring-blue-500": !error,
            "border-red-500 focus:ring-2 focus:ring-red-300": error,
            "bg-gray-100 cursor-not-allowed": disabled,
          },
          className
        )}
        {...props}
      />
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {typeof error === "string" ? error : "Invalid input"}
        </p>
      )}
    </div>
  );
};

export default Input;
