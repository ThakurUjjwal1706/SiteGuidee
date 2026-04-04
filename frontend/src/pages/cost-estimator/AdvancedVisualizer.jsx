import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

/* ─── Finishing Styles ──────────────────────────────────────────── */
// Basic = muted pastel, no glass. Standard = lively colors. Premium = dark luxury style.
const STYLES = {
  basic: [
    { id: 'gf', label: 'GF', base: '#F1F5F9', roof: '#E2E8F0', accent: '#64748B', win: '#CBD5E1' },
    { id: 'f1', label: 'F1', base: '#F8FAFC', roof: '#E2E8F0', accent: '#94A3B8', win: '#CBD5E1' },
    { id: 'f2', label: 'F2', base: '#F1F5F9', roof: '#E2E8F0', accent: '#64748B', win: '#CBD5E1' },
    { id: 'f3', label: 'F3', base: '#F8FAFC', roof: '#E2E8F0', accent: '#94A3B8', win: '#CBD5E1' },
  ],
  standard: [
    { id: 'gf', label: 'GF', base: '#EFF6FF', roof: '#BFDBFE', accent: '#3B82F6', win: '#93C5FD' },
    { id: 'f1', label: 'F1', base: '#F5F3FF', roof: '#DDD6FE', accent: '#7C3AED', win: '#C4B5FD' },
    { id: 'f2', label: 'F2', base: '#FFF7ED', roof: '#FED7AA', accent: '#EA580C', win: '#FDBA74' },
    { id: 'f3', label: 'F3', base: '#ECFDF5', roof: '#A7F3D0', accent: '#059669', win: '#6EE7B7' },
  ],
  premium: [
    { id: 'gf', label: 'GF', base: '#0F172A', roof: '#1E293B', accent: '#EAB308', win: '#334155' },
    { id: 'f1', label: 'F1', base: '#1E293B', roof: '#334155', accent: '#F59E0B', win: '#475569' },
    { id: 'f2', label: 'F2', base: '#0F172A', roof: '#1E293B', accent: '#EAB308', win: '#334155' },
    { id: 'f3', label: 'F3', base: '#1E293B', roof: '#334155', accent: '#F59E0B', win: '#475569' },
  ]
};

/* ─── Single window pane ──────────────────────────────────────────── */
function WindowPane({ color, lit, isPremium }) {
  const litColor = isPremium ? '#FDE047' : color;
  return (
    <motion.div
      animate={{ 
        background: lit ? litColor : `${color}55`, 
        boxShadow: lit ? `0 0 12px ${litColor}BB` : 'none',
        borderColor: isPremium ? '#EAB30844' : color
      }}
      transition={{ duration: 0.3 }}
      className="rounded-sm"
      style={{ width: 22, height: 26, border: '1.5px solid' }}
    />
  );
}

/* ─── Single floor block ──────────────────────────────────────────── */
function FloorBlock({ floor, isGround, isTop, isSelected, isHovered, onHover, onLeave, onClick, isPremium }) {
  const c = floor;
  const active = isSelected || isHovered;

  return (
    <motion.div
      layout
      key={c.id}
      initial={{ y: 90, opacity: 0, scaleX: 0.88 }}
      animate={{ y: 0, opacity: 1, scaleX: 1 }}
      exit={{ y: 90, opacity: 0, scaleX: 0.88, transition: { duration: 0.22, ease: 'easeIn' } }}
      transition={{ type: 'spring', stiffness: 260, damping: 22, mass: 0.9 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      className="relative w-full cursor-pointer"
      style={{ height: 80 }}
    >
      <motion.div
        animate={{
          background: active ? (isPremium ? '#1E293B' : `${c.accent}18`) : c.base,
          boxShadow: active
            ? `inset 0 0 30px ${c.accent}33, 0 -6px 20px ${c.accent}33`
            : isPremium ? '0 -2px 10px rgba(0,0,0,0.5)' : '0 -2px 6px rgba(0,0,0,0.05)',
        }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 mr-6"
        style={{
          borderTop: `3px solid ${c.accent}`,
          borderLeft: `1.5px solid ${c.accent}44`,
          borderRight: `1.5px solid ${c.accent}22`,
          borderBottom: isGround ? `2px solid ${c.accent}55` : 'none',
          borderRadius: isTop ? '10px 0 0 0' : '0',
        }}
      >
        <div style={{ height: 6, background: c.accent, opacity: 0.75, borderRadius: isTop ? '8px 0 0 0' : 0 }} />

        <motion.div
          animate={{
            color: active ? (isPremium ? '#0F172A' : 'white') : c.accent,
            background: active ? c.accent : `${c.accent}15`,
          }}
          transition={{ duration: 0.2 }}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black px-2 py-0.5 rounded-md uppercase"
        >
          {c.label}
        </motion.div>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2.5">
          {[0, 1, 2].map(i => <WindowPane key={i} color={c.win} lit={active} isPremium={isPremium} />)}
        </div>

        {isGround && (
          <div
            className="absolute bottom-0"
            style={{
              left: '50%', transform: 'translateX(-50%)',
              width: 28, height: 44,
              background: c.accent, opacity: 0.65,
              borderRadius: '4px 4px 0 0',
            }}
          />
        )}

        {isTop && (
          <div className="absolute -top-4 right-4 flex gap-2 items-end">
            {[16, 20, 14].map((h, i) => (
              <div key={i} style={{ width: 4, height: h, background: c.accent, opacity: 0.5, borderRadius: 2 }} />
            ))}
          </div>
        )}
      </motion.div>

      <div
        className="absolute right-0 top-0 h-full"
        style={{
          width: 24,
          background: `lineargradient(to right, ${c.accent}22, ${c.accent}55)`,
          borderTop: `3px solid ${c.accent}88`,
          borderRight: `1.5px solid ${c.accent}44`,
          borderRadius: isTop ? '0 10px 0 0' : '0',
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          backgroundColor: c.roof // fallback for gradient issue sometimes
        }}
      />
    </motion.div>
  );
}

export default function AdvancedVisualizer({ floors, finishingQuality, onFloorClick, selectedFloor, setSelectedFloor }) {
  const [hoveredFloor, setHoveredFloor] = useState(null);

  const paletteObj = STYLES[finishingQuality] || STYLES.standard;
  const activeFloors = paletteObj.slice(0, floors);
  const isPremium = finishingQuality === 'premium';

  return (
    <div className="flex flex-col items-center w-full select-none h-full justify-end">

      <div
        className="w-full rounded-2xl overflow-visible relative flex flex-col justify-end transition-colors duration-1000"
        style={{
          background: isPremium 
            ? 'linear-gradient(180deg, #0F172A 0%, #1E293B 60%, #334155 100%)' 
            : 'linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 40%, #E0F2FE 100%)',
          minHeight: 360,
          padding: '32px 32px 0 32px',
          boxShadow: isPremium ? 'inset 0 0 50px rgba(0,0,0,0.5)' : 'none'
        }}
      >
        {isPremium ? (
          <div className="absolute top-6 right-8 w-10 h-10 rounded-full bg-white opacity-80 blur-[1px] shadow-[0_0_20px_#FFF]" />
        ) : (
          <>
            <div className="absolute top-6 right-8 w-10 h-10 rounded-full bg-amber-200 opacity-70 blur-sm" />
            <div className="absolute top-7 right-9 w-8 h-8 rounded-full bg-amber-300 opacity-50" />
          </>
        )}

        {!isPremium && (
          <div className="absolute top-10 left-10 flex gap-1 opacity-60">
            {[24, 32, 24].map((w, i) => (
              <div key={i} className="bg-white rounded-full" style={{ width: w, height: 14 }} />
            ))}
          </div>
        )}

        <div className="relative flex flex-col-reverse mx-auto" style={{ width: 260 }}>
          <AnimatePresence>
            {activeFloors.map((floor, index) => (
              <FloorBlock
                key={floor.id}
                floor={floor}
                isGround={index === 0}
                isTop={index === floors - 1}
                isSelected={selectedFloor === index}
                isHovered={hoveredFloor === index}
                onHover={() => setHoveredFloor(index)}
                onLeave={() => setHoveredFloor(null)}
                onClick={() => setSelectedFloor(selectedFloor === index ? null : index)}
                isPremium={isPremium}
              />
            ))}
          </AnimatePresence>
        </div>

        <div className="mx-auto" style={{ width: 300 }}>
          <div
            className="w-full rounded-b-sm transition-colors duration-500"
            style={{ 
              height: 18, 
              background: isPremium ? 'linear-gradient(180deg, #334155, #1E293B)' : 'linear-gradient(180deg, #94A3B8, #CBD5E1)', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
            }}
          />
          <div
            className="mx-auto mt-1 rounded-full"
            style={{ height: 10, width: '85%', background: 'rgba(0,0,0,0.15)', filter: 'blur(5px)' }}
          />
        </div>
      </div>
    </div>
  );
}
