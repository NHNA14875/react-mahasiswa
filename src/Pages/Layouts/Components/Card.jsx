/**
 * ATOM: Card
 * Sesuai PDF:
 *   className="w-full bg-white rounded-2xl shadow-lg p-8"
 *
 * Fungsi: Membungkus konten seperti form login dalam tampilan kotak
 * yang estetik (dengan rounded, shadow, dan padding).
 */
const Card = ({ children, className = "", padding = "p-8" }) => {
  return (
    <div className={`w-full bg-white rounded-2xl shadow-lg ${padding} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
