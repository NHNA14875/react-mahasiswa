import toast from "react-hot-toast";

// ── Konfigurasi default Toast 
const toastOptions = {
  duration: 3000,
  position: "top-right",
  style: {
    borderRadius: "10px",
    fontFamily:   "inherit",
    fontSize:     "14px",
  },
};

// ══ LOGIN 

// Informasi Login berhasil
export const toastLoginSuccess = (name) =>
  toast.success(`Selamat datang, ${name}! Login berhasil.`, {
    ...toastOptions,
    style: { ...toastOptions.style, background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" },
    iconTheme: { primary: "#16a34a", secondary: "#fff" },
  });

// Informasi Login gagal
export const toastLoginFailed = (message = "Email atau password salah.") =>
  toast.error(message, {
    ...toastOptions,
    style: { ...toastOptions.style, background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" },
    iconTheme: { primary: "#dc2626", secondary: "#fff" },
  });

// ══ MAHASISWA — SIMPAN (TAMBAH) 

// Informasi tambah data berhasil
export const toastStoreSuccess = (nama) =>
  toast.success(`Data mahasiswa "${nama}" berhasil ditambahkan.`, {
    ...toastOptions,
    style: { ...toastOptions.style, background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" },
    iconTheme: { primary: "#16a34a", secondary: "#fff" },
  });

// Informasi tambah data gagal
export const toastStoreFailed = () =>
  toast.error("Gagal menambahkan data mahasiswa.", {
    ...toastOptions,
    style: { ...toastOptions.style, background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" },
    iconTheme: { primary: "#dc2626", secondary: "#fff" },
  });

// ══ MAHASISWA — UPDATE 

// Informasi update berhasil
export const toastUpdateSuccess = (nama) =>
  toast.success(`Data mahasiswa "${nama}" berhasil diperbarui.`, {
    ...toastOptions,
    style: { ...toastOptions.style, background: "#eff6ff", color: "#1e40af", border: "1px solid #bfdbfe" },
    iconTheme: { primary: "#2563eb", secondary: "#fff" },
  });

// Informasi update gagal
export const toastUpdateFailed = () =>
  toast.error("Gagal memperbarui data mahasiswa.", {
    ...toastOptions,
    style: { ...toastOptions.style, background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" },
    iconTheme: { primary: "#dc2626", secondary: "#fff" },
  });

// ══ MAHASISWA — HAPUS 

// Informasi hapus berhasil
export const toastDeleteSuccess = (nama) =>
  toast.success(`Data mahasiswa "${nama}" berhasil dihapus.`, {
    ...toastOptions,
    style: { ...toastOptions.style, background: "#fff7ed", color: "#9a3412", border: "1px solid #fed7aa" },
    iconTheme: { primary: "#ea580c", secondary: "#fff" },
  });

// Informasi hapus gagal
export const toastDeleteFailed = () =>
  toast.error("Gagal menghapus data mahasiswa.", {
    ...toastOptions,
    style: { ...toastOptions.style, background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" },
    iconTheme: { primary: "#dc2626", secondary: "#fff" },
  });
