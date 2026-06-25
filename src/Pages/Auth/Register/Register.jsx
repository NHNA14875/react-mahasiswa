import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Menyimpan data ke json-server
      await axios.post('http://localhost:8000/register', formData);
      toast.success('Registrasi berhasil! Silakan login.');
      
      // Setelah sukses, langsung arahkan ke halaman utama (/) yang berisi form Login
      navigate('/'); 
    } catch (error) {
      toast.error('Registrasi gagal. Coba lagi.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      {/* Bagian Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 tracking-wide">Daftar Akun Baru</h1>
        <p className="text-gray-500 text-sm mt-2">Silakan lengkapi data diri Anda di bawah ini</p>
      </div>

      {/* Bagian Form */}
      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name}
            onChange={handleChange} 
            placeholder="Contoh: Budi Santoso" 
            required 
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange} 
            placeholder="email@kampus.ac.id" 
            required 
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password}
            onChange={handleChange} 
            placeholder="••••••••" 
            required 
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-700"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors duration-200 mt-4 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
        >
          {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
        </button>
      </form>

      {/* Teks Bawah */}
      <p className="text-center text-sm text-gray-600 mt-8">
        Sudah memiliki akun?{' '}
        {/* Link diubah menuju ke '/' agar tidak terjadi error 404 */}
        <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors">
          Login di sini
        </Link>
      </p>
    </div>
  );
};

export default Register;