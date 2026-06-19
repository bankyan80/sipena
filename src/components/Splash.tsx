import React, { useEffect, useState } from "react";
import { useApp } from "../AppContext";
import { School, Landmark, GraduationCap, Flame } from "lucide-react";
import { motion } from "motion/react";

export const Splash: React.FC = () => {
  const { finishSplash } = useApp();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fill up loading bar dynamically
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            finishSplash();
          }, 300);
          return 100;
        }
        return prev + 4; // Increments over ~1s total for optimal fast response
      });
    }, 45);

    return () => clearInterval(interval);
  }, [finishSplash]);

  return (
    <div className="h-screen w-full bg-gradient-to-b from-[#E0F2FE] via-[#F8FAFC] to-white flex flex-col items-center justify-between p-6 text-center select-none overflow-hidden max-w-md mx-auto relative shadow-2xl">
      
      {/* Dynamic Ambient Background Sparkles */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-300/10 via-transparent to-transparent pointer-events-none" />

      {/* Top Section: App Visual Signature */}
      <div className="mt-8 flex flex-col items-center">
        {/* Animated concentric logo badge */}
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="relative mb-4 cursor-pointer"
        >
          <div className="absolute -inset-1.5 bg-[#0F3D91]/10 rounded-full blur-md animate-pulse" />
          <div className="w-24 h-24 bg-[#0F3D91] rounded-full flex items-center justify-center text-white shadow-[0_8px_25px_rgba(15,61,145,0.4)] border-4 border-white">
            <GraduationCap size={44} className="text-white transform -rotate-12 animate-bounce" />
          </div>
        </motion.div>

        {/* Text Headers */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-extrabold text-[#0F3D91] tracking-wider uppercase font-sans"
        >
          SIPENA
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xs font-bold text-gray-400 uppercase mt-0.5 tracking-widest"
        >
          Sistem Informasi Pendataan Siswa
        </motion.p>

        {/* Level Badges */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex gap-2 mt-4"
        >
          {["SD", "TK", "KB"].map((lvl) => (
            <span
              key={lvl}
              className="px-4 py-1 text-[10px] font-extrabold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full tracking-wider"
            >
              {lvl}
            </span>
          ))}
        </motion.div>

        {/* School Academic Year container */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 bg-[#22C55E] text-white px-8 py-2 rounded-[20px] shadow-soft border border-emerald-400/20 active:scale-95 transition-transform"
        >
          <p className="text-[9px] text-[#E8FBF0] font-extrabold tracking-widest leading-none">
            TAHUN PELAJARAN
          </p>
          <p className="text-lg font-bold tracking-wider leading-none mt-1">
            2026/2027
          </p>
        </motion.div>
      </div>

      {/* Center Section: Custom vector artwork representing a modern school facade and 2 seragam siswa */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="w-full flex flex-col items-center justify-center my-4 px-2"
      >
        <svg
          viewBox="0 0 400 220"
          className="w-full max-h-[180px] drop-shadow-[0_8px_16px_rgba(0,0,0,0.06)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground surface */}
          <line x1="20" y1="200" x2="380" y2="200" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
          
          {/* School Building Facade */}
          {/* Main Block */}
          <rect x="80" y="60" width="240" height="140" rx="15" fill="#0F3D91" fillOpacity="0.05" stroke="#0F3D91" strokeWidth="4" />
          {/* Center Pillar Support Frame */}
          <rect x="140" y="40" width="120" height="160" rx="10" fill="#0F3D91" fillOpacity="0.1" stroke="#0F3D91" strokeWidth="4" />
          
          {/* Triangular Roof Accent */}
          <polygon points="120,40 200,10 280,40" fill="#22C55E" stroke="#1ea750" strokeWidth="4" strokeLinejoin="round" />
          {/* Watch Clock */}
          <circle cx="200" cy="65" r="14" fill="white" stroke="#0F3D91" strokeWidth="3" />
          <line x1="200" y1="65" x2="200" y2="59" stroke="#0F3D91" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="200" y1="65" x2="206" y2="65" stroke="#0F3D91" strokeWidth="2" strokeLinecap="round" />

          {/* Windows Left and Right */}
          <rect x="95" y="80" width="25" height="35" rx="4" fill="white" stroke="#0F3D91" strokeWidth="3" />
          <rect x="95" y="130" width="25" height="35" rx="4" fill="white" stroke="#0F3D91" strokeWidth="3" />
          
          <rect x="280" y="80" width="25" height="35" rx="4" fill="white" stroke="#0F3D91" strokeWidth="3" />
          <rect x="280" y="130" width="25" height="35" rx="4" fill="white" stroke="#0F3D91" strokeWidth="3" />
          
          {/* Doors */}
          <path d="M185 200V135C185 132.239 187.239 130 190 130H210C212.761 130 215 132.239 215 135V200" fill="white" stroke="#0F3D91" strokeWidth="4" />

          {/* School flag pole */}
          <line x1="335" y1="50" x2="335" y2="200" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
          {/* Merah-Putih Flag */}
          <rect x="335" y="50" width="30" height="10" fill="#EF4444" />
          <rect x="335" y="60" width="30" height="10" fill="white" stroke="#E2E8F0" strokeWidth="1" />

          {/* SERAGAM SISWA Characters (2 Students) */}
          {/* Student 1 (Laki-laki, SD Red-White) */}
          <g transform="translate(45, 130)">
            {/* Head */}
            <circle cx="15" cy="15" r="10" fill="#FED7AA" stroke="#1E293B" strokeWidth="2" />
            <rect x="11" y="5" width="8" height="4" rx="2" fill="#1E293B" /> {/* Hair */}
            {/* Body Shirt Red-White */}
            <path d="M5 45L0 27C3 25 10 25 15 27L10 45" fill="white" stroke="#1E293B" strokeWidth="2" />
            {/* Red Pants */}
            <rect x="5" y="45" width="20" height="20" rx="3" fill="#EF4444" stroke="#1E293B" strokeWidth="2" />
            <line x1="10" y1="65" x2="10" y2="72" stroke="#1E293B" strokeWidth="2.5" />
            <line x1="20" y1="65" x2="20" y2="72" stroke="#1E293B" strokeWidth="2.5" />
            <circle cx="10" cy="72" r="3" fill="#1E293B" />
            <circle cx="20" cy="72" r="3" fill="#1E293B" />
          </g>

          {/* Student 2 (Perempuan, TK/KB Green Hijab or skirt with backpack) */}
          <g transform="translate(325, 128)">
            {/* Head with dynamic Hijab / Veil in school theme */}
            <path d="M5 15C5 7 25 7 25 15C25 21 21 28 15 28C9 28 5 21 5 15Z" fill="#22C55E" stroke="#1E293B" strokeWidth="2" />
            <circle cx="15" cy="16" r="6" fill="#FED7AA" />
            {/* Body dress / shirt */}
            <path d="M5 45L0 28C4 26 26 26 30 28L25 45" fill="white" stroke="#1E293B" strokeWidth="2" />
            {/* Green Skirt */}
            <polygon points="5,45 1,67 29,67 25,45" fill="#22C55E" stroke="#1E293B" strokeWidth="2" />
            {/* Legs */}
            <line x1="10" y1="67" x2="10" y2="74" stroke="#1E293B" strokeWidth="2.5" />
            <line x1="20" y1="67" x2="20" y2="74" stroke="#1E293B" strokeWidth="2.5" />
            <circle cx="10" cy="74" r="3" fill="#1E293B" />
            <circle cx="20" cy="74" r="3" fill="#1E293B" />
          </g>
        </svg>

        {/* Tagline text exact match: "Satu Data Siswa, Satu Arah Perencanaan Pendidikan." */}
        <p className="text-xs font-semibold text-[#0F3D91] italic px-4 mt-3 max-w-[280px] leading-relaxed text-center">
          "Satu Data Siswa, Satu Arah Perencanaan Pendidikan."
        </p>
      </motion.div>

      {/* Bottom Section: Progress loading indicator */}
      <div className="w-full max-w-[280px] mb-8 pb-4">
        <div className="bg-gray-100 h-2 w-full rounded-full overflow-hidden border border-gray-200/50">
          <motion.div
            className="h-full bg-gradient-to-r from-[#0F3D91] to-[#22C55E]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[10px] text-gray-400 font-extrabold tracking-widest mt-3 uppercase">
          Mempersiapkan Berkas... {progress}%
        </p>
      </div>
    </div>
  );
};
