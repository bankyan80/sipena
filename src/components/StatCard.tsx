import React, { useEffect, useState } from "react";
import { useApp } from "../AppContext";
import { motion, useMotionValue, useSpring } from "motion/react";

interface StatCardProps {
  id: string;
  title: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
  l: number;
  p: number;
  total: number;
  isRombel?: boolean;
  rombelDetails?: { sd: number; tk: number; kb: number };
  onClick?: () => void;
}

// Highly stylized Count Up animation utilizing React hooks
const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;
    const duration = 800;
    const step = end > start ? 1 : -1;
    const stepTime = Math.max(Math.floor(duration / Math.abs(end - start || 1)), 20);
    const timer = setInterval(() => {
      start += step;
      setDisplayValue(start);
      if (start === end) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue}</span>;
};

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  sub,
  icon,
  color,
  l,
  p,
  total,
  isRombel = false,
  rombelDetails,
  onClick,
}) => {
  return (
    <motion.div
      id={`card-${id}`}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-white p-3.5 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col justify-between h-[170px] select-none hover:shadow-[0_10px_25px_rgba(15,61,145,0.08)] cursor-pointer transition-all active:ring-2 active:ring-blue-100 relative overflow-hidden"
    >
      {/* Visual Accent Bar */}
      <div 
        style={{ backgroundColor: color }} 
        className="absolute top-0 left-0 right-0 h-1" 
      />

      {/* Card Header Info */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col max-w-[70%]">
          <h3 className="text-[11px] font-bold text-gray-800 leading-tight tracking-tight mt-0.5 line-clamp-2">
            {title}
          </h3>
          <p className="text-[9px] text-[#22C55E] font-semibold mt-1 uppercase tracking-wider">
            {sub}
          </p>
        </div>
        {/* Dynamic Colorful Icon badge */}
        <div 
          style={{ backgroundColor: `${color}15`, color: color }} 
          className="p-1 px-1.5 rounded-xl flex items-center justify-center shadow-2xs border border-gray-50/10"
        >
          {icon}
        </div>
      </div>

      {/* Main Total Big Number Display */}
      <div className="my-1.5 self-start">
        <span className="text-2xl font-bold tracking-tight text-gray-900">
          <AnimatedNumber value={total} />
        </span>
        {isRombel ? (
          <span className="text-[10px] text-gray-400 ml-1 font-bold">Rombel</span>
        ) : (
          <span className="text-[9px] text-gray-400 ml-1 font-bold">Siswa</span>
        )}
      </div>

      {/* Footnote details (rekap numbers) */}
      {isRombel && rombelDetails ? (
        <div className="grid grid-cols-3 gap-1 border-t border-dashed border-gray-100 pt-2 text-center text-gray-500 font-bold">
          <div>
            <p className="text-[7.5px] text-gray-400 uppercase tracking-wider font-semibold">SD</p>
            <p className="text-[10.5px] text-gray-800 font-bold">
              <AnimatedNumber value={rombelDetails.sd} />
            </p>
          </div>
          <div>
            <p className="text-[7.5px] text-gray-400 uppercase tracking-wider font-semibold">TK</p>
            <p className="text-[10.5px] text-gray-800 font-bold">
              <AnimatedNumber value={rombelDetails.tk} />
            </p>
          </div>
          <div className="bg-orange-50/70 rounded-lg py-0.5">
            <p className="text-[7.5px] text-[#F97316] uppercase tracking-wider font-semibold">KB</p>
            <p className="text-[10.5px] text-[#F97316] font-bold">
              <AnimatedNumber value={rombelDetails.kb} />
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1 border-t border-dashed border-gray-100 pt-2 text-center text-gray-500 font-bold">
          <div>
            <p className="text-[7.5px] text-blue-400 font-bold tracking-wider">LAKI-LAKI</p>
            <p className="text-[10.5px] text-gray-800 font-bold">
              <AnimatedNumber value={l} />
            </p>
          </div>
          <div>
            <p className="text-[7.5px] text-pink-400 font-bold tracking-wider">PEREMPUAN</p>
            <p className="text-[10.5px] text-gray-800 font-bold">
              <AnimatedNumber value={p} />
            </p>
          </div>
          <div className="bg-blue-50/70 rounded-lg py-0.5 flex flex-col justify-center">
            <p className="text-[7.5px] text-[#0F3D91] font-extrabold tracking-wider">TOTAL</p>
            <p className="text-[10.5px] text-[#0F3D91] font-bold">
              <AnimatedNumber value={total} />
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};
