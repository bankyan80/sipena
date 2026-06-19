import React, { useState } from "react";
import { useApp } from "../../AppContext";
import {
  LogIn,
  ShieldAlert,
  HelpCircle,
  Building,
  Key,
  User,
  GraduationCap
} from "lucide-react";
import { UserRole } from "../../types";

export const LoginView: React.FC = () => {
  const { login, loginGoogle, logout, state } = useApp();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setLoginError("Mohon isikan akun username & kata sandi.");
      return;
    }

    setLoginError("");
    // Standard credential evaluation
    login(username);
  };

  return (
    <div className="space-y-4 px-4 pt-2 pb-24 max-w-md mx-auto">
      {/* 1. Welcoming School building illustration segment */}
      <div className="bg-white p-5 rounded-[20px] shadow-soft border border-gray-100 flex flex-col items-center text-center space-y-3">
        {/* Beautiful vector school decoration */}
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

      {/* 2. Login Form Wrapper */}
      <div className="bg-white p-5 rounded-[20px] shadow-soft border border-gray-100 space-y-4">
        {loginError && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-xs font-bold">
            {loginError}
          </div>
        )}

        {/* Action: Google auth click simulation */}
        <button
          onClick={() => loginGoogle(UserRole.ADMIN)}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border border-gray-200 h-12 rounded-xl text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer text-gray-700"
        >
          {/* Flat stylized dynamic Google G Icon */}
          <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.102-5.14 4.102-3.41 0-6.19-2.772-6.19-6.178s2.78-6.177 6.19-6.177c1.482 0 2.859.52 3.951 1.488l3.15-3.15C19.06 1.704 15.82 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c6.8 0 12.43-4.95 12.43-12.24 0-.742-.07-1.442-.2-2.115H12.24z"
            />
          </svg>
          Google Single Sign-On
        </button>

        {/* Divider matches "atau" precisely */}
        <div className="flex items-center gap-3 my-2">
          <div className="h-[1px] bg-gray-100 flex-1" />
          <span className="text-gray-400 text-[10px] font-extrabold uppercase tracking-widest">
            atau
          </span>
          <div className="h-[1px] bg-gray-100 flex-1" />
        </div>

        {/* Standard Credentials Input form */}
        <form onSubmit={handleManualLogin} className="space-y-3.5">
          {/* Username */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase pl-1 tracking-wider">
              Akun Pengguna (Username)
            </span>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="opsd / optk / opkb / admin"
                className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all shadow-2xs"
              />
              <User size={16} className="text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase pl-1 tracking-wider">
              Kata Sandi (Password)
            </span>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ketik password pengguna..."
                className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all shadow-2xs"
              />
              <Key size={16} className="text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Manual Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#0F3D91] hover:bg-[#0c3276] text-white h-12 rounded-[20px] font-bold shadow-md shadow-blue-900/10 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 mt-5 text-sm"
          >
            <LogIn size={18} /> Masuk Aplikasi
          </button>
        </form>

        {/* Help label: "Belum punya akun? Hubungi Admin Kecamatan." */}
        <p className="text-center text-[10.5px] text-gray-400 font-semibold pt-4 border-t border-dashed border-gray-100">
          Belum punya akun?{" "}
          <strong className="text-[#0F3D91] hover:underline cursor-pointer">
            Hubungi Admin Kecamatan
          </strong>
        </p>
      </div>

      {/* 3. SIMULATOR DEMO TOOLBAR: The ultimate AI Studio build standard */}
      <div className="bg-blue-50/50 border border-blue-100/50 p-4 rounded-[20px] space-y-3.5">
        <h4 className="text-[10px] font-extrabold text-[#0F3D91] uppercase tracking-widest pl-1 leading-none">
          AKSES CEPAT AKUN SIMULATOR (1 KLIK)
        </h4>
        <p className="text-[10px] text-gray-500 leading-relaxed font-medium pl-1">
          Gunakan tombol di bawah untuk masuk ke berbagai peranan rekap data secara instan tanpa memasukkan kata sandi:
        </p>

        <div className="grid grid-cols-2 gap-2">
          {/* Admin Kecamatan */}
          <button
            onClick={() => loginGoogle(UserRole.ADMIN)}
            className="bg-purple-600 hover:bg-purple-700 text-white p-2.5 rounded-xl text-[10px] font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 text-center"
          >
            <ShieldAlert size={16} />
            <span>ADMIN KECAMATAN</span>
          </button>

          {/* Operator SD */}
          <button
            onClick={() => loginGoogle(UserRole.OPERATOR, "SD_01")}
            className="bg-[#0F3D91] hover:bg-blue-800 text-white p-2.5 rounded-xl text-[10px] font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 text-center"
          >
            <Building size={16} />
            <span>OPERATOR SD N 1</span>
          </button>

          {/* Operator TK */}
          <button
            onClick={() => loginGoogle(UserRole.OPERATOR, "TK_01")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl text-[10px] font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 text-center"
          >
            <GraduationCap size={16} />
            <span>OPERATOR TK KASIH IBU</span>
          </button>

          {/* Operator KB */}
          <button
            onClick={() => loginGoogle(UserRole.OPERATOR, "KB_01")}
            className="bg-[#F97316] hover:bg-orange-600 text-white p-2.5 rounded-xl text-[10px] font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 text-center"
          >
            <User size={16} />
            <span>OPERATOR KB MELATI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
