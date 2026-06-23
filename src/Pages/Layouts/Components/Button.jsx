/**
 * ATOM: Button
 * Sesuai PDF — variantClasses + sizeClasses
 * className="rounded-lg transition font-medium focus:outline-none cursor-pointer"
 */
const variantClasses = {
  primary:   "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-600 hover:bg-gray-700 text-white",
  warning:   "bg-yellow-500 hover:bg-yellow-600 text-white",
  info:      "bg-cyan-600 hover:bg-cyan-700 text-white",
  danger:    "bg-red-600 hover:bg-red-700 text-white",
  ghost:     "bg-white hover:bg-gray-50 text-gray-600 border border-gray-300",
};

const sizeClasses = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2",
  lg: "px-6 py-3 text-lg",
};

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg transition font-medium focus:outline-none cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant] || variantClasses.primary}
        ${sizeClasses[size] || sizeClasses.md}
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
