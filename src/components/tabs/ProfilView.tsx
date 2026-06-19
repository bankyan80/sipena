import React from "react";
import { useApp } from "../../AppContext";
import {
  User,
  LogOut,
  Info,
  Building2,
} from "lucide-react";
import { UserRole } from "../../types";

export const ProfilView: React.FC = () => {
  const { state, logout } = useApp();
  const user = state.currentUser;

  // Aggregate numbers
  const totalSchools = state.schools.length;
  const validatedSchools = state.schools.filter((s) => s.status === "VALID").length;

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

      {/* 3. Log out button - only visible if logged in */}
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
