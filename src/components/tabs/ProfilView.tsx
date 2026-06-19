import React from "react";
import { useApp } from "../../AppContext";
import {
  User,
  Shield,
  Smartphone,
  CheckCircle,
  LogOut,
  Bell,
  Sparkles,
  Info,
  Calendar,
  Building2,
  FileCheck2,
} from "lucide-react";
import { UserRole } from "../../types";

export const ProfilView: React.FC = () => {
  const { state, logout, triggerNotification } = useApp();
  const user = state.currentUser;

  // Aggregate numbers
  const totalSchools = state.schools.length;
  const validatedSchools = state.schools.filter((s) => s.status === "VALID").length;

  const testPushNotification = () => {
    const alertMessages = [
      "Notifikasi Pengaduan: Operator SDN 1 Merdeka baru saja memperbarui data alumni.",
      "Kecamatan: Laporan kompilasi kelulusan siap untuk dicetak.",
      "Sistem SIPENA: Sinkronisasi luring (offline) berhasil dijalankan secara realtime.",
      "Info Agenda: Sosialisasi pengawasan data TK/KB akan dihelat luring 25 Juni 2026."
    ];
    const item = alertMessages[Math.floor(Math.random() * alertMessages.length)];
    triggerNotification(item);
  };

  return (
    <div className="space-y-4 px-4 pt-4 pb-24 max-w-md mx-auto">
      {/* 1. Profile information header card */}
      <div className="bg-white p-5 rounded-[20px] shadow-soft border border-gray-100 flex flex-col items-center text-center space-y-3">
        <div className="w-20 h-20 bg-[#0F3D91] text-white rounded-full flex items-center justify-center shadow-md relative">
          <User size={36} />
          {user && (
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#22C55E] border-2 border-white" />
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-gray-800 leading-tight">
            {user ? user.name : "Tamu Umum"}
          </h3>
          <p className="text-[11px] text-gray-400 font-bold block uppercase tracking-wider">
            {user ? `@${user.username}` : "Peninjau Umum"}
          </p>
        </div>

        {/* Role badge */}
        {user ? (
          <span
            className={`px-4 py-1 text-[9px] font-extrabold rounded-full ${
              user.role === UserRole.ADMIN
                ? "bg-purple-100 text-purple-700 border border-purple-200"
                : "bg-blue-100 text-[#0F3D91] border border-blue-200"
            }`}
          >
            {user.role === UserRole.ADMIN ? "ADMIN KECAMATAN" : "OPERATOR SEKOLAH"}
          </span>
        ) : (
          <span className="px-4 py-1 text-[9px] font-extrabold text-gray-500 bg-gray-100 border rounded-full">
            PUBLIK (PENINJAU DATA)
          </span>
        )}
      </div>

      {/* 2. Associated School detail if Operator */}
      {user?.role === UserRole.OPERATOR && (
        <div className="bg-white p-4 rounded-[20px] shadow-soft border border-gray-100 space-y-3">
          <div className="flex items-center gap-2.5">
            <Building2 size={18} className="text-[#0F3D91]" />
            <span className="text-xs font-bold text-[#0F3D91] uppercase tracking-wide">
              Lembaga Tanggung Jawab Anda
            </span>
          </div>
          {(() => {
            const sch = state.schools.find((s) => s.id === user.schoolId);
            return sch ? (
              <div className="bg-gray-50 p-3 rounded-xl space-y-1 text-xs">
                <p className="font-bold text-gray-800">{sch.name}</p>
                <p className="text-gray-400 font-medium">{sch.address}</p>
                <div className="flex items-center gap-2 pt-2 text-[10px] font-extrabold">
                  <span className="text-gray-400">STATUS REKAP:</span>
                  <span className={sch.status === "VALID" ? "text-emerald-600" : "text-[#F97316]"}>
                    {sch.status}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400">Akun tidak terkait dengan sekolah manapun.</p>
            );
          })()}
        </div>
      )}

      {/* 3. PWA Interactive checks tracker */}
      <div className="bg-white p-4 rounded-[20px] shadow-soft border border-gray-100 space-y-3.5">
        <div className="flex items-center gap-2.5">
          <Smartphone size={18} className="text-[#22C55E]" />
          <span className="text-xs font-bold text-[#0F3D91] uppercase tracking-wide">
            Android PWA Platform Tracker
          </span>
        </div>

        <div className="space-y-2 text-[11px] font-bold text-gray-600">
          {[
            { label: "Splash Screen Native Android", desc: "Merespon orientasi portrait" },
            { label: "Offline Cache Penyimpanan", desc: "Mendukung operasional bebas kuota luring" },
            { label: "Installable Home Screen Shortcut", desc: "Kompatibel untuk pintasan laci Android" },
            { label: "Simulated Push Notification Engine", desc: "Instan memantau mutasi data" },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-2.5 bg-gray-50/55 p-2.5 rounded-xl border border-gray-50">
              <CheckCircle size={16} className="text-[#22C55E] shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-800 font-bold leading-tight">{item.label}</p>
                <p className="text-[9.5px] text-gray-400 font-medium leading-none mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action: Push Notification simulation trigger */}
        <button
          onClick={testPushNotification}
          className="w-full bg-[#22C55E] hover:bg-emerald-600 text-white h-11 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all mt-2"
        >
          <Bell size={15} /> Tes Simulasi Push Notification
        </button>
      </div>

      {/* 4. Log out button - only visible if logged in */}
      {user ? (
        <button
          onClick={logout}
          className="w-full bg-[#EF4444] hover:bg-red-600 text-white h-12 rounded-[20px] text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
        >
          <LogOut size={16} /> Keluar Dari Akun
        </button>
      ) : (
        <div className="bg-blue-50/40 p-4 border rounded-[20px] text-center space-y-2 text-xs">
          <Info size={18} className="text-[#0F3D91] mx-auto" />
          <p className="text-gray-500 font-medium leading-relaxed">
            Anda sedang dalam mode Peninjau Publik. Silakan masuk lewat menu login untuk merekam data.
          </p>
        </div>
      )}
    </div>
  );
};
