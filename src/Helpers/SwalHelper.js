import Swal from "sweetalert2";

// ── Base config Swal 
const swalBase = Swal.mixin({
  customClass: {
    confirmButton: "bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg mx-1",
    cancelButton:  "bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-5 py-2 rounded-lg mx-1",
    popup:         "rounded-xl",
  },
  buttonsStyling: false,
});

// ── Konfirmasi Logout 
export const confirmLogout = async () => {
  const result = await swalBase.fire({
    title:              "Konfirmasi Logout",
    text:               "Yakin ingin keluar dari sistem?",
    icon:               "question",
    showCancelButton:   true,
    confirmButtonText:  "Ya, Logout",
    cancelButtonText:   "Batal",
    reverseButtons:     true,
  });
  return result.isConfirmed;
};

// ── Konfirmasi Hapus Mahasiswa 
export const confirmDelete = async (nama, nim) => {
  const result = await swalBase.fire({
    title:             "Konfirmasi Hapus",
    html:              `Yakin ingin menghapus mahasiswa <strong>${nama}</strong> <br/><code>${nim}</code>?<br/><small class="text-red-500">Data tidak dapat dikembalikan.</small>`,
    icon:              "warning",
    showCancelButton:  true,
    confirmButtonText: "Ya, Hapus",
    cancelButtonText:  "Batal",
    reverseButtons:    true,
    customClass: {
      confirmButton: "bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-lg mx-1",
      cancelButton:  "bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-5 py-2 rounded-lg mx-1",
      popup:         "rounded-xl",
    },
    buttonsStyling: false,
  });
  return result.isConfirmed;
};

// ── Konfirmasi Simpan Perubahan (Update) ──
export const confirmUpdate = async (nama, nim) => {
  const result = await swalBase.fire({
    title:             "Konfirmasi Simpan Perubahan",
    html:              `Yakin ingin menyimpan perubahan data <strong>${nama}</strong> <br/><code>${nim}</code>?`,
    icon:              "question",
    showCancelButton:  true,
    confirmButtonText: "Ya, Simpan",
    cancelButtonText:  "Batal",
    reverseButtons:    true,
  });
  return result.isConfirmed;
};
