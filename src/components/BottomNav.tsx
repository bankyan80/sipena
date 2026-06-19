import React from "react";
import { Home, FileText, LogIn, User, CircleUser } from "lucide-react";
import { useApp } from "../AppContext";

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, state } = useApp();

  const user = state.currentUser;

  const tabs = [
    {
      id: "beranda" as const,
      label: "Beranda",
      icon: <Home size={22} />,
    },
    {
      id: "rekap" as const,
      label: "Rekap",
      icon: <FileText size={22} />,
    },
    {
      id: "login" as const,
      label: user ? "Keluar" : "Login",
      icon: <LogIn size={22} />,
    },
    {
      id: "profil" as const,
      label: "Profil",
      icon: user ? <CircleUser size={22} /> : <User size={22} />,
    },
  ];

  return (
    <nav
      id="bottom-navigation"
      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md h-[70px] border-t border-gray-100 flex items-center justify-around px-4 z-40 shadow-[0_-5px_25px_rgba(0,0,0,0.03)]"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex flex-col items-center justify-center flex-1 h-full py-1 focus:outline-none cursor-pointer transition-all relative"
            aria-label={tab.label}
          >
            {/* Animated Floating active pill background */}
            <div
              className={`flex items-center justify-center p-2.5 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-[#0F3D91] text-white scale-110 shadow-md shadow-blue-900/25"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.icon}
            </div>

            {/* Tab Label Text */}
            <span
              className={`text-[9px] font-bold mt-1 tracking-wider transition-colors duration-200 ${
                isActive ? "text-[#0F3D91]" : "text-gray-400"
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
