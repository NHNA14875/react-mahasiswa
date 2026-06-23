import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card    from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Form    from "@/Pages/Layouts/Components/Form";
import Label   from "@/Pages/Layouts/Components/Label";
import Input   from "@/Pages/Layouts/Components/Input";
import Button  from "@/Pages/Layouts/Components/Button";
import Link    from "@/Pages/Layouts/Components/Link";
import { dummyUser } from "@/Data/Dummy";

// ── Import Toast Helper 
import { toastLoginSuccess, toastLoginFailed } from "@/Helpers/ToastHelper";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm]         = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [error, setError]       = useState("");

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.email === dummyUser.email && form.password === dummyUser.password) {
      localStorage.setItem("user", JSON.stringify(dummyUser));
      toastLoginSuccess(dummyUser.name); // ← Toast: login berhasil
      navigate("/admin/dashboard");
    } else {
      setError("Email atau password salah.");
      toastLoginFailed("Email atau password salah."); // ← Toast: login gagal
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

        <Button type="submit" variant="primary" className="w-full">
          Login
        </Button>
      </Form>

      <p className="text-sm text-center text-gray-600 mt-4">
        Belum punya akun? <Link href="#">Daftar</Link>
      </p>
    </Card>
  );
};

export default Login;
