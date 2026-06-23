/**
 * ATOM: Link
 * Fungsi: Untuk menghandle elemen tautan (<a>) yang konsisten
 * dengan warna dan hover sesuai desain aplikasi.
 * Props: href, children, className
 */
const Link = ({ href = "#", children, className = "", ...props }) => {
  return (
    <a
      href={href}
      className={`text-blue-500 hover:underline ${className}`}
      {...props}
    >
      {children}
    </a>
  );
};

export default Link;
