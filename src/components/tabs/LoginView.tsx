import React, { useState } from "react";
import { useApp } from "../../AppContext";
import {
  LogIn,
  Building,
  Key,
} from "lucide-react";

export const LoginView: React.FC = () => {
  const { login } = useApp();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setLoginError("Mohon isikan NPSN dan kata sandi.");
      return;
    }

    setLoginError("");
    const ok = login(username.trim(), password);
    if (!ok) {
      setLoginError("NPSN atau kata sandi salah.");
    }
  };

  return (
    <div className="space-y-4 px-4 pt-2 pb-24 max-w-md mx-auto">
      <div className="bg-white p-5 rounded-[20px] shadow-soft border border-gray-100 flex flex-col items-center text-center space-y-3">
        <div className="w-24 h-24 bg-blue-100/40 rounded-full flex items-center justify-center text-[#0F3D91] shadow-2xs border">
          <Building size={48} className="text-[#0F3D91] animate-pulse" />
        </div>
        
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#0F3D91]">Login Operator</h2>
          <p className="text-xs text-gray-400 font-medium">
            Sistem Informasi Pendataan Siswa Jenjang SD/TK/KB SIPENA
          </p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-[20px] shadow-soft border border-gray-100 space-y-4">
        {loginError && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-xs font-bold">
            {loginError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3.5">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase pl-1 tracking-wider">
              NPSN Sekolah
            </span>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan NPSN sekolah"
                className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all shadow-2xs"
              />
              <Building size={16} className="text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase pl-1 tracking-wider">
              Kata Sandi
            </span>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all shadow-2xs"
              />
              <Key size={16} className="text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0F3D91] hover:bg-[#0c3276] text-white h-12 rounded-[20px] font-bold shadow-md shadow-blue-900/10 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 mt-5 text-sm"
          >
            <LogIn size={18} /> Masuk Aplikasi
          </button>
        </form>

        <p className="text-center text-[10.5px] text-gray-400 font-semibold pt-4 border-t border-dashed border-gray-100">
          Belum punya akun?{" "}
          <strong className="text-[#0F3D91] hover:underline cursor-pointer">
            Hubungi Admin Kecamatan
          </strong>
        </p>
      </div>
    </div>
  );
};
