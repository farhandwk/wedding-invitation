"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Cormorant_Garamond, Pinyon_Script } from "next/font/google";
import { useEnvelope } from "@/src/context/EnvelopeContext"; 

import floralGoldCorner from "@/src/assets/floral-gold-white-corner.png"

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "600", "700"] });
const script = Pinyon_Script({ subsets: ["latin"], weight: "400" });

type Phase = "closed" | "open" | "rise" | "leave" | "done";

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
          className={`${serif.className} fixed inset-0 z-50 flex items-center justify-center bg-white overflow-hidden h-[100dvh] w-screen`}
          style={{
            opacity: leaving ? 0 : 1,
            transition: "opacity 900ms ease-in 100ms",
          }}
        >
          <div className="w-full max-w-lg h-full max-h-[800px] flex flex-col items-center justify-between px-6 pb-12 pt-16 sm:pb-14 sm:pt-20">
            
            {/* --- GRUP ATAS: HEADER, FRAME HORIZONTAL & NAMA TAMU --- */}
            <div className="flex flex-col items-center space-y-6 sm:space-y-8">
              
              {/* Judul & Frame Horizontal HTML */}
              <div className="flex flex-col items-center gap-4 sm:gap-5">
                <p className="text-[0.65rem] sm:text-xs md:text-sm tracking-[0.35em] font-semibold uppercase text-gold text-center">
                  Undangan Pernikahan
                </p>
                
                {/* 
                  ELEMEN FRAME HORIZONTAL
                  Lebar ditambah, tinggi dipangkas drastis menjadi 80px-90px
                */}
                <div className="relative flex items-center justify-center w-[240px] h-[80px] sm:w-[280px] sm:h-[90px] border border-gold/50 bg-white shadow-sm">
                  {/* Garis tepi ganda */}
                  <div className="absolute inset-1 border border-gold/20"></div>
                  
                  {/* Ornamen Floral Kiri Atas */}
                  {/* <img
                    src="/floral-corner.png" 
                    alt="Ornamen Kiri Atas"
                    className="absolute -top-4 -left-4 w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-sm pointer-events-none"
                  /> */}
                  <Image src={floralGoldCorner} alt="floral top-right corner" className="absolute -top-4 -right-4 w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-sm pointer-events-none rotate-[302deg]"/>
                  <Image src={floralGoldCorner} alt="floral bottom-left corner" className="absolute -bottom-4 -left-4 w-12 h-12 sm:w-14 sm:h-14 object-contain rotate-180 drop-shadow-sm pointer-events-none rotate-[120deg]"/>
                  
                  {/* Ornamen Floral Kanan Bawah */}
                  {/* <img
                    src="/floral-corner.png" 
                    alt="Ornamen Kanan Bawah"
                    className="absolute -bottom-4 -right-4 w-12 h-12 sm:w-14 sm:h-14 object-contain rotate-180 drop-shadow-sm pointer-events-none"
                  /> */}

                  {/* Teks Inisial/Nama Horizontal */}
                  <span className={`${script.className} text-2xl sm:text-3xl mt-1`} style={goldText}>
                    Dhimas &amp; Gita
                  </span>
                </div>
              </div>

              {/* Nama Tamu */}
              <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                <p className="text-xs sm:text-sm font-medium text-navy/70">
                  Kepada Yth. Bapak/Ibu/Saudara/i
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy capitalize text-center px-4">
                  {guest || "Tamu Undangan"}
                </p>
              </div>
            </div>

            {/* --- GRUP TENGAH: AMPLOP 3D --- */}
            <div
              style={{
                perspective: 1000,
                transform: leaving ? "scale(4)" : "scale(1)",
                transition: "transform 1000ms cubic-bezier(.6,0,.9,.4)",
              }}
            >
              <div
                className="relative w-[85vw] max-w-[400px] h-[18vh] min-h-[150px] max-h-[200px] rounded-sm shadow-2xl"
                style={{ background: NAVY_DEEP }}
              >
                <div
                  className="absolute inset-x-3 top-2 flex flex-col items-center justify-center shadow-inner"
                  style={{
                    height: "92%",
                    background: WHITE, 
                    border: `1px solid ${GOLD}`,
                    outline: `1px solid ${GOLD_LIGHT}`,
                    outlineOffset: -6,
                    transform: risen ? "translateY(-140px)" : "translateY(0)",
                    transition: "transform 1000ms cubic-bezier(.3,.7,.2,1)",
                    zIndex: 10,
                  }}
                >
                  <span className={`${script.className} text-3xl sm:text-4xl`} style={goldText}>
                    Dhimas &amp; Gita
                  </span>
                </div>

                {[
                  { clip: "polygon(0 0, 100% 50%, 0 100%)", bg: NAVY },
                  { clip: "polygon(100% 0, 0 50%, 100% 100%)", bg: NAVY },
                  { clip: "polygon(0 100%, 50% 45%, 100% 100%)", bg: "#243050" }, 
                ].map((p, i) => (
                  <div key={i} className="absolute inset-0 rounded-sm" style={{ clipPath: p.clip, background: p.bg, zIndex: 20 }} />
                ))}

                <div className="pointer-events-none absolute inset-2" style={{ border: `1px solid ${GOLD}`, opacity: 0.5, zIndex: 21 }} />

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

                <button
                  onClick={start}
                  aria-label="Buka undangan"
                  disabled={opened}
                  className="absolute left-[58%] z-40 flex h-16 w-16 sm:h-16 sm:w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-none transition-all"
                  style={{
                    top: "60%", 
                    background: `radial-gradient(circle at 35% 30%, ${GOLD_LIGHT}, ${GOLD} 60%, #9A7B45)`,
                    boxShadow: "0 4px 12px rgba(0,0,0,.4)",
                    opacity: opened ? 0 : 1,
                    transform: `translateX(-50%) scale(${opened ? 0.6 : 1})`,
                    animation: phase === "closed" ? "seal-pulse 2s ease-in-out infinite" : "none",
                  }}
                >
                  <span className={`${script.className} text-xl sm:text-2xl font-bold text-navy-deep drop-shadow-sm`}>
                    D&amp;G
                  </span>
                </button>
              </div>
            </div>

            {/* --- GRUP BAWAH: TOMBOL BUKA --- */}
            <div>
              <button
                onClick={start}
                disabled={opened}
                className="px-10 py-3 sm:px-12 sm:py-3.5 text-xs sm:text-sm font-semibold tracking-widest uppercase transition-all duration-300 hover:bg-navy hover:text-white"
                style={{ color: NAVY, border: `1px solid ${NAVY}`, opacity: opened ? 0 : 1 }}
              >
                Buka Undangan
              </button>
            </div>

          </div>

          <style>{`
            @keyframes seal-pulse {
              0%,100% { box-shadow: 0 4px 12px rgba(0,0,0,.4), 0 0 0 0 rgba(212,184,122,.6); }
              50% { box-shadow: 0 4px 12px rgba(0,0,0,.4), 0 0 0 10px rgba(212,184,122,0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}