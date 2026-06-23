/**
 * ATOM: Form
 * Sesuai PDF — className="space-y-4"
 * Fungsi: Komponen pembungkus form agar struktur tetap seragam
 * dan mudah untuk diberikan behavior tambahan seperti onSubmit.
 */
const Form = ({ onSubmit, children, className = "", ...props }) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-4 ${className}`} {...props}>
      {children}
    </form>
  );
};

export default Form;
