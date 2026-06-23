/**
 * ATOM: Modal
 * Matches screenshot: white box, title bar with × button, simple border.
 */
const sizeMap = { sm:'max-w-sm', md:'max-w-md', lg:'max-w-lg' };

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className={`modal-box bg-white rounded-lg shadow-xl w-full ${sizeMap[size]||sizeMap.md} overflow-hidden`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header — matches screenshot "Tambah Mahasiswa" with × */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer w-6 h-6 flex items-center justify-center"
            aria-label="Tutup"
          >
            ×
          </button>
        </div>
        {/* Body */}
        <div className="px-5 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};
export default Modal;
