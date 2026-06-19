import React, { useState } from "react";
import { Menu, Bell, Info, Shield, Github, Phone, X } from "lucide-react";
import { useApp } from "../AppContext";
import { AnimatePresence, motion } from "motion/react";

export const Header: React.FC = () => {
  const { state, pushNotifications } = useApp();
  const [infoOpen, setInfoOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Simple Notification helper
  const unreadCount = pushNotifications.length;

  return (
    <>
      <header className="bg-[#0F3D91] text-white h-[76px] px-4 flex items-center justify-between sticky top-0 z-40 shadow-[0_4px_15px_rgba(15,61,145,0.25)]">
        {/* Left: Hamburger menu */}
        <button
          id="btn-hamburger"
          onClick={() => setInfoOpen(true)}
          className="p-2 -ml-2 rounded-full hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
          aria-label="Menu Informasi"
        >
          <Menu size={24} />
        </button>

        {/* Center: App Title / Subtitle */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-lg font-bold tracking-wider leading-none text-white">
            SIPENA
          </h1>

        </div>

        {/* Right: Notifications Button */}
        <button
          id="btn-notifications"
          onClick={() => setNotifOpen(true)}
          className="p-2 -mr-2 rounded-full hover:bg-white/10 active:scale-90 transition-all relative cursor-pointer"
          aria-label="Notifikasi"
        >
          <Bell size={22} />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1 right-1 bg-[#22C55E] text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#0F3D91]"
            >
              {unreadCount}
            </motion.span>
          )}
        </button>
      </header>

      {/* Hamburger Menu Drawer (Slide up / Bottom Sheet) */}
      <AnimatePresence>
        {infoOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInfoOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs"
            />

            {/* Bottom Sheet Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[30px] z-50 px-6 pt-5 pb-8 shadow-[0_-10px_30px_rgba(0,0,0,0.15)] overflow-hidden"
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#0F3D91]">Tentang SIPENA</h3>
                  <p className="text-xs text-gray-400">Versi 1.1.0 • PWA Android</p>
                </div>
                <button
                  onClick={() => setInfoOpen(false)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all cursor-pointer"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-4 my-6 text-sm text-gray-600 font-medium leading-relaxed">
                <p>
                  <strong>SIPENA</strong> (Sistem Informasi Pendataan Siswa Jenjang SD, TK, dan KB) merupakan inovasi satu pintu untuk rekap pendataan siswa baru, rombel, alumni, serta pelacakan sirkulasi siswa di awal Tahun Pelajaran 2026/2027.
                </p>

                <div className="bg-[#F8FAFC] border border-blue-50 p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-3 text-xs">
                    <Shield size={18} className="text-[#22C55E]" />
                    <span><strong>Keamanan Data</strong>: Sistem diatur dan divalidasi berkala oleh Kecamatan.</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <Info size={18} className="text-[#F97316]" />
                    <span><strong>PWA Offline Cache</strong>: Dapat diakses & ditinjau secara luring (offline).</span>
                  </div>
                </div>

                <div className="text-xs text-gray-400 pt-2 border-t font-normal space-y-1">
                  <span className="block">Tagline: <em>"Satu Data Siswa, Satu Arah Perencanaan Pendidikan."</em></span>
                  <div className="flex items-center gap-2 mt-2">
                    <Phone size={12} />
                    <span>Kontak Admin Kecamatan: +62 812-3456-7890</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setInfoOpen(false)}
                className="w-full bg-[#0F3D91] hover:bg-[#0c3276] text-white h-12 rounded-xl font-bold shadow-md cursor-pointer transition-colors"
              >
                Tutup Informasi
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Notifications History Overlay Sheet */}
      <AnimatePresence>
        {notifOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNotifOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs"
            />

            {/* Notification Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#F8FAFC] rounded-t-[30px] z-50 px-6 pt-5 pb-8 shadow-[0_-10px_30px_rgba(0,0,0,0.15)]"
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#0F3D91]">Pemberitahuan</h3>
                  <p className="text-xs text-gray-500">Pesan realtime sistem & push notifikasi</p>
                </div>
                <button
                  onClick={() => setNotifOpen(false)}
                  className="p-2 bg-white rounded-full border shadow-xs hover:bg-gray-100 transition-all cursor-pointer"
                >
                  <X size={16} className="text-gray-500" />
                </button>
              </div>

              {/* Msg container */}
              <div className="max-h-[300px] overflow-y-auto no-scrollbar space-y-3 my-4">
                {pushNotifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-xs">
                    Tidak ada notifikasi baru untuk saat ini.
                  </div>
                ) : (
                  pushNotifications.map((val, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white border border-gray-100 p-4 rounded-xl shadow-xs flex items-start gap-3"
                    >
                      <div className="p-1.5 bg-orange-100 text-orange-500 rounded-lg mt-0.5">
                        <Info size={14} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-700 font-medium leading-relaxed">
                          {val}
                        </p>
                        <span className="text-[9px] text-gray-400 block mt-1">
                          Baru saja • Realtime
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setNotifOpen(false)}
                  className="flex-1 border border-gray-200 text-gray-600 bg-white h-12 rounded-xl text-xs font-bold shadow-xs cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  Kembali
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
