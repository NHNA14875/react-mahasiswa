import axios from 'axios';
import { useState } from "react";
// Import Link dari react-router-dom dengan alias RouterLink agar tidak bentrok dengan Link bawaan projectmu
import { useNavigate, Link as RouterLink } from "react-router-dom"; 
import Card    from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Form    from "@/Pages/Layouts/Components/Form";
import Label   from "@/Pages/Layouts/Components/Label";
import Input   from "@/Pages/Layouts/Components/Input";
import Button  from "@/Pages/Layouts/Components/Button";
import Link    from "@/Pages/Layouts/Components/Link";

// Import Toast Helper 
import { toastLoginSuccess, toastLoginFailed } from "@/Helpers/ToastHelper";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm]         = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [error, setError]       = useState("");
  const [isLoading, setIsLoading] = useState(false); // Tambahan state loading

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Meminta json-server mencari data user yang email dan password-nya cocok
      const response = await axios.get(`http://localhost:8000/register?email=${form.email}&password=${form.password}`);
      
      // Jika data ditemukan (array hasilnya tidak kosong)
      if (response.data.length > 0) {
        const loggedInUser = response.data[0]; // Ambil data user yang cocok

        // Simpan data user ke localStorage (seperti bawaan kodemu sebelumnya)
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        
        // Memanggil Toast sukses dengan nama user yang login
        toastLoginSuccess(loggedInUser.name); 
        navigate("/admin/dashboard");
      } else {
        // Jika data tidak ditemukan
        setError("Email atau password salah.");
        toastLoginFailed("Email atau password salah."); 
      }
    } catch (err) {
      setError("Gagal terhubung ke server.");
      toastLoginFailed("Gagal terhubung ke server.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <Heading as="h2" align="center" color="text-blue-600" className="mb-6">
        Login
      </Heading>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-300 text-red-600 text-sm rounded px-3 py-2">
          {error}
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email" name="email" id="email"
            placeholder="Masukkan email"
            value={form.email} onChange={handleChange} required
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password" name="password" id="password"
            placeholder="Masukkan password"
            value={form.password} onChange={handleChange} required
          />
        </div>

        <div className="flex justify-between items-center">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" className="mr-2" checked={remember}
              onChange={(e) => setRemember(e.target.checked)} />
            <span className="text-sm text-gray-600">Ingat saya</span>
          </label>
          <Link href="#" className="text-sm">Lupa password?</Link>
        </div>

        {/* Tambahkan disable efek saat loading */}
        <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
          {isLoading ? "Memproses..." : "Login"}
        </Button>
      </Form>

      <p className="text-sm text-center text-gray-600 mt-4">
        {/* Ubah tag Link di bawah agar pindah ke halaman Register */}
        Belum punya akun? <RouterLink to="/register" className="text-blue-600 font-medium hover:underline">Daftar</RouterLink>
      </p>
    </Card>
  );
};

export default Login;