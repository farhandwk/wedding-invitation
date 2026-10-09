"use client";

import { useEffect, useState } from "react";
import { Cormorant_Garamond, Pinyon_Script } from "next/font/google";
import { useEnvelope } from "@/src/context/EnvelopeContext"; 

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "600", "700"] });
const script = Pinyon_Script({ subsets: ["latin"], weight: "400" });

type Phase = "closed" | "open" | "rise" | "leave" | "done";

// Palet Warna Ketat: Navy, Gold, White
const NAVY = "#2A3555";
const NAVY_DEEP = "#1F2A48";
const GOLD = "#B8975A";
const GOLD_LIGHT = "#D4B87A";
const WHITE = "#FFFFFF";

const goldText = {
  backgroundImage: `linear-gradient(120deg, #9A7B45, ${GOLD_LIGHT} 45%, ${GOLD})`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
} as const;

export default function EnvelopeIntro({
  guest,
  children,
}: {
  guest?: string;
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<Phase>("closed");
  const { setIsOpened } = useEnvelope();

  useEffect(() => {
    if (phase === "closed") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [phase]);

  useEffect(() => {
    document.body.style.overflow = phase === "done" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  const start = () => {
    if (phase !== "closed") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (reduce) {
      setPhase("done");
      setIsOpened(true); 
      return;
    }
    
    setPhase("open");
    setTimeout(() => setPhase("rise"), 900);
    setTimeout(() => setPhase("leave"), 2100);
    setTimeout(() => {
      setPhase("done");
      setIsOpened(true); 
    }, 3100);
  };

  const opened = phase !== "closed";
  const risen = phase === "rise" || phase === "leave";
  const leaving = phase === "leave";

  return (
    <>
      {children}

      {phase !== "done" && (
        <div
          className={`${serif.className} fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-white`}
          style={{
            opacity: leaving ? 0 : 1,
            transition: "opacity 900ms ease-in 100ms",
          }}
        >
          {/* HEADER: Tipografi Mewah */}
          <div className="flex flex-col items-center gap-6 mb-8 mt-[-10vh]">
            <p className="text-xs sm:text-sm tracking-[0.3em] font-semibold uppercase text-gold">
              Undangan Pernikahan
            </p>
            
            <img
              src="/floral-circle-gold.png"
              alt="Ornamen"
              className="w-[220px] sm:w-[220px] h-auto object-contain opacity-90"
            />
          </div>

          {/* NAMA TAMU */}
          <div className="flex flex-col items-center gap-2 mb-12">
            <p className="text-sm font-medium text-navy/70">
              Kepada Yth. Bapak/Ibu/Saudara/i
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-navy capitalize">
              {guest || "Tamu Undangan"}
            </p>
          </div>

          {/* AMPLOP 3D */}
          <div
            style={{
              perspective: 1000,
              transform: leaving ? "scale(4)" : "scale(1)",
              transition: "transform 1000ms cubic-bezier(.6,0,.9,.4)",
            }}
          >
            <div
              className="relative w-[70vw] max-w-[340px] h-[16vh] min-h-[190px] rounded-sm shadow-2xl"
              style={{ background: NAVY_DEEP }}
            >
              {/* Isi Kartu Undangan (Putih Bersih) */}
              <div
                className="absolute inset-x-3 top-2 flex flex-col items-center justify-center shadow-inner"
                style={{
                  height: "92%",
                  background: WHITE, // Menggunakan putih bersih
                  border: `1px solid ${GOLD}`,
                  outline: `1px solid ${GOLD_LIGHT}`,
                  outlineOffset: -6,
                  transform: risen ? "translateY(-130px)" : "translateY(0)",
                  transition: "transform 1000ms cubic-bezier(.3,.7,.2,1)",
                  zIndex: 10,
                }}
              >
                <span className={`${script.className} text-3xl`} style={goldText}>
                  Dhimas &amp; Gita
                </span>
              </div>

              {/* Potongan Kertas Depan Amplop */}
              {[
                { clip: "polygon(0 0, 100% 50%, 0 100%)", bg: NAVY },
                { clip: "polygon(100% 0, 0 50%, 100% 100%)", bg: NAVY },
                { clip: "polygon(0 100%, 50% 45%, 100% 100%)", bg: "#243050" }, // Warna bawah sedikit lebih gelap
              ].map((p, i) => (
                <div
                  key={i}
                  className="absolute inset-0 rounded-sm"
                  style={{ clipPath: p.clip, background: p.bg, zIndex: 20 }}
                />
              ))}

              {/* Garis Emas Amplop */}
              <div
                className="pointer-events-none absolute inset-2"
                style={{ border: `1px solid ${GOLD}`, opacity: 0.5, zIndex: 21 }}
              />

              {/* Tutup Amplop Atas */}
              <div
                className="absolute left-0 top-0 h-[60%] w-full"
                style={{
                  background: `linear-gradient(180deg, ${NAVY}, ${NAVY_DEEP})`,
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  transformOrigin: "top",
                  transform: opened ? "rotateX(180deg)" : "rotateX(0)",
                  transition: "transform 800ms ease-in-out 250ms",
                  zIndex: phase === "closed" || phase === "open" ? 30 : 5,
                }}
              />

              {/* Segel Lilin (Wax Seal) */}
              <button
                onClick={start}
                aria-label="Buka undangan"
                disabled={opened}
                className="absolute left-[61%] z-40 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-none transition-all"
                style={{
                  top: "60%", // Disesuaikan agar pas di ujung segitiga tutup
                  background: `radial-gradient(circle at 35% 30%, ${GOLD_LIGHT}, ${GOLD} 60%, #9A7B45)`,
                  boxShadow: "0 4px 12px rgba(0,0,0,.4)",
                  opacity: opened ? 0 : 1,
                  transform: `translateX(-50%) scale(${opened ? 0.6 : 1})`,
                  animation: phase === "closed" ? "seal-pulse 2s ease-in-out infinite" : "none",
                }}
              >
                <span className={`${script.className} text-2xl font-bold text-navy-deep drop-shadow-sm`}>
                  D&amp;G
                </span>
              </button>
            </div>
          </div>

          {/* Tombol Buka Cadangan (Lebih elegan) */}
          <button
            onClick={start}
            disabled={opened}
            className="mt-14 px-8 py-2.5 text-sm font-semibold tracking-widest uppercase transition-all duration-300 hover:bg-navy hover:text-white"
            style={{ color: NAVY, border: `1px solid ${NAVY}`, opacity: opened ? 0 : 1 }}
          >
            Buka Undangan
          </button>

          {/* Keyframes Animasi Segel */}
          <style>{`
            @keyframes seal-pulse {
              0%,100% { box-shadow: 0 4px 12px rgba(0,0,0,.4), 0 0 0 0 rgba(212,184,122,.6); }
              50% { box-shadow: 0 4px 12px rgba(0,0,0,.4), 0 0 0 12px rgba(212,184,122,0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}