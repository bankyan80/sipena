/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AppProvider, useApp } from "./AppContext";
import { Splash } from "./components/Splash";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { DetailPanel } from "./components/DetailPanel";

// Tab views
import { BerandaView } from "./components/tabs/BerandaView";
import { RekapView } from "./components/tabs/RekapView";
import { LoginView } from "./components/tabs/LoginView";
import { ProfilView } from "./components/tabs/ProfilView";

const MainAppContent: React.FC = () => {
  const { splashActive, currentDetail, activeTab, state } = useApp();

  // Clock state for sidebar
  const [time, setTime] = React.useState(new Date());
  React.useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (d: Date) => {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // 1. Splash Screen Phase (Takes full viewport space)
  if (splashActive) {
    return <Splash />;
  }

  // 2. Sub-detail form rekap pages (admission, promotion, etc.)
  if (currentDetail) {
    return <DetailPanel />;
  }

  // 3. Main tab bar viewport with 3-column desktop layout
  return (
    <div className="min-h-screen bg-slate-100/70 p-0 sm:p-6 lg:p-8 flex justify-center items-center gap-8 select-none">
      
      {/* Left Sidebar - SIPENA Brand Info - hidden on mobile / desktop only */}
      <div className="hidden lg:flex flex-col justify-between w-80 xl:w-96 p-2 h-[812px] space-y-6">
        <div className="space-y-6">
          {/* Brand Row */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#0F3D91] rounded-2xl flex items-center justify-center shadow-lg shadow-[#0F3D91]/20">
              <span className="text-white font-bold text-3xl">S</span>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#0F3D91] tracking-tight leading-none">SIPENA</h1>
              <p className="text-slate-400 font-semibold text-xs mt-1.5 uppercase tracking-wider">v2.0.26 Build</p>
            </div>
          </div>

          {/* Slogan */}
          <div className="bg-white p-5 rounded-[20px] shadow-soft border border-slate-100">
            <p className="text-[#0F3D91] font-bold text-[10px] uppercase tracking-wider mb-2">Tagline Pendidikan</p>
            <p className="text-slate-600 font-medium text-sm italic leading-relaxed">
              "Satu Data Siswa, Satu Arah Perencanaan Pendidikan."
            </p>
          </div>

          {/* Quick Specifications */}
          <div className="bg-white p-5 rounded-[20px] shadow-soft border border-slate-100 space-y-3">
            <h4 className="text-slate-700 font-bold text-[11px] uppercase tracking-wider">Informasi Perekapan</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <p className="text-slate-400 font-bold uppercase text-[9px]">Tahun Pelajaran</p>
                <p className="text-[#0F3D91] font-bold mt-0.5">2026/2027</p>
              </div>
              <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-50 text-emerald-800">
                <p className="text-emerald-600/70 font-bold uppercase text-[9px]">Jenjang</p>
                <p className="font-bold mt-0.5">SD / TK / KB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Disclaimer */}
        <div className="text-[11px] text-slate-400 font-medium leading-relaxed bg-slate-100/50 p-4 rounded-xl border border-slate-200/50">
          <p className="font-bold text-slate-500 mb-1">Aplikasi Web SIPENA</p>
          Aplikasi dioptimalkan untuk perangkat mobile Android dengan fitur Progressive Web App (PWA). Nikmati performa cepat dan kemampuan akses offline.
        </div>
      </div>

      {/* Center Column: Device wrapper - absolute design matching simulation frame */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[812px] sm:max-h-[812px] bg-[#F8FAFC] flex flex-col relative overflow-hidden sm:rounded-[40px] sm:shadow-[0_22px_70px_rgba(15,61,145,0.22)] sm:border-[8px] sm:border-slate-800">
        
        {/* Dynamic Android Notch camera for visual fidelity in desktop frame */}
        <div className="hidden sm:block absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-5 bg-slate-800 rounded-b-2xl z-50 pointer-events-none" />

        {/* Sticky Blue Header */}
        <Header />

        {/* Main Tab content router */}
        <main className="flex-1 overflow-y-auto no-scrollbar bg-[#F8FAFC] pb-[70px]">
          {activeTab === "beranda" && <BerandaView />}
          {activeTab === "rekap" && <RekapView />}
          {activeTab === "login" && <LoginView />}
          {activeTab === "profil" && <ProfilView />}
        </main>

        {/* Bottom tab navigator bar */}
        <BottomNav />
      </div>

      {/* Right Sidebar - System Status & Live Clock - hidden on mobile / desktop only */}
      <div className="hidden lg:flex flex-col justify-between w-80 xl:w-96 p-2 h-[812px] space-y-6">
        <div className="space-y-6">
          {/* Live Date-Time Card */}
          <div className="bg-[#0F3D91] text-white p-6 rounded-[24px] shadow-lg shadow-[#0F3D91]/20 relative overflow-hidden flex flex-col justify-between h-40">
            {/* Ambient Background Glow */}
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="space-y-1 relative z-10">
              <span className="text-[10px] uppercase tracking-widest font-bold text-blue-200">Waktu Sistem</span>
              <h2 className="text-[13px] font-bold opacity-90 leading-tight">{formatDate(time)}</h2>
            </div>
            <div className="relative z-10 self-start mt-2">
              <span className="text-3xl font-extrabold tracking-tight font-mono">{formatTime(time)}</span>
            </div>
          </div>

          {/* System status Card */}
          <div className="bg-white p-5 rounded-[20px] shadow-soft border border-slate-100 space-y-4">
            <h4 className="text-[#0F3D91] font-bold text-xs uppercase tracking-wider">Status Sistem</h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 font-medium">Database Connection</span>
                <span className="flex items-center gap-1.5 font-bold text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Ready
                </span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 font-medium">Offline Cache Engine</span>
                <span className="flex items-center gap-1.5 font-bold text-blue-600">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 font-medium">Syncing Status</span>
                <span className="font-bold text-slate-700">Fully Synced</span>
              </div>
            </div>
          </div>

          {/* Operator Profile box */}
          <div className="bg-white p-5 rounded-[20px] shadow-soft border border-slate-100">
            <span className="text-[10px] uppercase tracking-widest font-mono text-slate-400 font-bold block mb-2">Operator Aktif</span>
            {state.currentUser ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0F3D91]/10 text-[#0F3D91] flex items-center justify-center font-bold text-sm">
                  {state.currentUser.name?.charAt(0) || "U"}
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 text-sm leading-tight">{state.currentUser.name}</h5>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{state.currentUser.role}</p>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 text-xs py-2 italic font-medium">
                Belum ada operator masuk. Silakan login pada aplikasi.
              </div>
            )}
          </div>
        </div>

        {/* Footer info/copyright */}
        <div className="text-[10px] text-slate-400 font-bold tracking-wider uppercase text-center">
          © 2026 SIPENA • All Rights Reserved
        </div>
      </div>
      
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
