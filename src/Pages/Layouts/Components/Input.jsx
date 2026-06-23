/**
 * ATOM: Input
 * Sesuai PDF — props: type, name, required, placeholder, className
 * className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
 */
const Input = ({ type, name, required = false, placeholder, className = '', value, onChange, disabled = false, ...props }) => {
  return (
    <input
      type={type}
      name={name}
      id={name}
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
};

export default Input;
