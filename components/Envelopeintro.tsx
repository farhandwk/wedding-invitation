"use client";

import { useEffect, useState } from "react";
import { Cormorant_Garamond, Pinyon_Script } from "next/font/google";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "600"] });
const script = Pinyon_Script({ subsets: ["latin"], weight: "400" });

type Phase = "closed" | "open" | "rise" | "leave" | "done";

const NAVY = "#2A3555";
const NAVY_DEEP = "#1F2A48";
const GOLD = "#B8975A";
const GOLD_LIGHT = "#D4B87A";
const CREAM = "#F5EBDD";
const WHITE = "#FFFFFF"

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
  children: React.ReactNode; // landing page
}) {
  const [phase, setPhase] = useState<Phase>("closed");

  // Lock scroll while the intro is showing
  useEffect(() => {
    document.body.style.overflow = phase === "done" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  const start = () => {
    if (phase !== "closed") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return setPhase("done");
    setPhase("open");
    setTimeout(() => setPhase("rise"), 900);
    setTimeout(() => setPhase("leave"), 2100);
    setTimeout(() => setPhase("done"), 3100);
  };

  const opened = phase !== "closed";
  const risen = phase === "rise" || phase === "leave";
  const leaving = phase === "leave";

  return (
    <>
      {children}

      {phase !== "done" && (
        <div
          className={`${serif.className} fixed inset-0 z-50 flex flex-col items-center justify-center`}
          style={{
            background: WHITE,
            opacity: leaving ? 0 : 1,
            transition: "opacity 900ms ease-in 100ms",
          }}
        >
          <p className="mb-2 text-4xl font-black" style={{ color: NAVY, opacity: 0.75 }}>
            Undangan Pernikahan
          </p>

          <div
            className="flex items-center justify-center w-[400px] h-[300px]"
            style={{
                backgroundImage: "url('/floral-circle-gold.png')", // file ada di public/ornamen.png
                backgroundSize: "contain",              // bisa diganti "cover" sesuai kebutuhan
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
            }}
            >
            <p className={`${script.className} text-2xl`} style={{ color: GOLD }}>
                Dhimas &amp; Gita
            </p>
            </div>

          <div className="text-center text-lg" style={{ color: NAVY }}>
            <p>
                Desa Gondang RT 1C, RW 1
            </p>
            <p>
                Kecamatan Watumalang
            </p>
            <p>
                Kabupaten Wonosobo 56352
            </p>
          </div>

          <div className="flex flex-col justify-center items-center mt-8">
            <p className="text-2xl font-extrabold" style={{ color: NAVY, opacity: 0.85 }}>
                {guest ? `Kepada Yth. ${guest}` : "Kepada Yth. Bapak/Ibu/Saudara"}
            </p>
            <p className="text-xl font-bold" style={{ color: NAVY, opacity: 0.7 }}>
                di Tempat
            </p>
          </div>

          {/* Envelope */}
          <div className="mt-4"
            style={{
              perspective: 1000,
              transform: leaving ? "scale(5)" : "scale(1)",
              transition: "transform 1000ms cubic-bezier(.6,0,.9,.4)",
            }}
          >
            <div className="relative h-[200px] w-[300px]" style={{ background: NAVY_DEEP, boxShadow: "0 20px 40px rgba(31,42,72,.35)" }}>
              {/* Card sliding out */}
              <div
                className="absolute inset-x-3 top-2 flex flex-col items-center justify-center"
                style={{
                  height: "92%",
                  background: "#FBF8F3",
                  border: `1px solid ${GOLD}`,
                  outline: `1px solid ${GOLD_LIGHT}`,
                  outlineOffset: -6,
                  transform: risen ? "translateY(-120px)" : "translateY(0)",
                  transition: "transform 1000ms cubic-bezier(.3,.7,.2,1)",
                  zIndex: 10,
                }}
              >
                <span className={`${script.className} text-2xl`} style={goldText}>
                  Dhimas &amp; Gita
                </span>
              </div>

              {/* Front pocket (left, right, bottom) */}
              {[
                { clip: "polygon(0 0, 100% 50%, 0 100%)", bg: NAVY },
                { clip: "polygon(100% 0, 0 50%, 100% 100%)", bg: NAVY },
                { clip: "polygon(0 100%, 50% 42%, 100% 100%)", bg: "#243050" },
              ].map((p, i) => (
                <div
                  key={i}
                  className="absolute inset-0"
                  style={{ clipPath: p.clip, background: p.bg, zIndex: 20 }}
                />
              ))}
              {/* Gold border line on the front */}
              <div className="pointer-events-none absolute inset-2" style={{ border: `1px solid ${GOLD}`, opacity: 0.6, zIndex: 21 }} />

              {/* Flap */}
              <div
                className="absolute left-0 top-0 h-[58%] w-full"
                style={{
                  background: `linear-gradient(180deg, ${NAVY}, ${NAVY_DEEP})`,
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  transformOrigin: "top",
                  transform: opened ? "rotateX(180deg)" : "rotateX(0)",
                  transition: "transform 800ms ease-in-out 250ms",
                  zIndex: phase === "closed" || phase === "open" ? 30 : 5,
                }}
              />

              {/* Wax seal / open button */}
              <button
                onClick={start}
                aria-label="Buka undangan"
                disabled={opened}
                className="absolute left-[58.5%] z-40 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{
                  top: "58%",
                  marginTop: -28,
                  background: `radial-gradient(circle at 35% 30%, ${GOLD_LIGHT}, ${GOLD} 60%, #9A7B45)`,
                  boxShadow: "0 4px 10px rgba(0,0,0,.35)",
                  outlineColor: GOLD_LIGHT,
                  opacity: opened ? 0 : 1,
                  transform: `translateX(-50%) scale(${opened ? 0.6 : 1})`,
                  transition: "opacity 300ms, transform 300ms",
                  animation: phase === "closed" ? "seal-pulse 2s ease-in-out infinite" : undefined,
                }}
              >
                <span className={`${script.className} text-2xl`} style={{ color: NAVY_DEEP }}>
                  D&amp;G
                </span>
              </button>
            </div>
          </div>

          <button
            onClick={start}
            disabled={opened}
            className="mt-12 px-8 py-2 text-lg transition-opacity"
            style={{ color: NAVY, border: `1px solid ${GOLD}`, opacity: opened ? 0 : 1 }}
          >
            Buka Undangan
          </button>

          <style>{`
            @keyframes seal-pulse {
              0%,100% { box-shadow: 0 4px 10px rgba(0,0,0,.35), 0 0 0 0 rgba(212,184,122,.6); }
              50% { box-shadow: 0 4px 10px rgba(0,0,0,.35), 0 0 0 14px rgba(212,184,122,0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}