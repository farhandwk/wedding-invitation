"use client";

import { useEffect, useRef, useState } from "react";
import { useEnvelope } from "@/src/context/EnvelopeContext";

const CREAM = "#FBEEDE";
const NAVY = "#293952";

const VERSE = {
  arabic:
    "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ",
  meaning:
    "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari (jenis) dirimu sendiri, agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa cinta dan kasih sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
  coverTitle: "القرآن الكريم",
  coverSub: "Ar-Rūm · 30:21",
  names: "Fulan & Fulanah",
};

export default function QuranFlipbook() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const playedRef = useRef(false);

  const { isOpened } = useEnvelope();

  useEffect(() => {
    const el = sectionRef.current;
    
    if (!el || !isOpened) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4 && !playedRef.current) {
            playedRef.current = true;
            setFlipped(true);
          }
        });
      },
      { threshold: [0.4] }
    );

    io.observe(el);
    return () => io.disconnect();
    
  }, [isOpened]);

  return (
    <div
      ref={sectionRef}
      // Padding vertikal dikurangi (py-4) agar tidak mendorong container terlalu tinggi
      className="flex w-full flex-col items-center justify-center overflow-visible py-4 sm:py-6"
    >
      {/* 
        MENGURANGI MAX-WIDTH UNTUK MACBOOK/DESKTOP
        Mobile: 90vw | Tablet: 480px | Macbook (lg): 420px | Monitor (xl): 500px
      */}
      <div className="w-full sm:max-w-[480px] md:max-w-[560px] lg:max-w-[420px] xl:max-w-[600px] [perspective:3000px]">
        
        <div
          className="relative w-full aspect-square sm:aspect-[4/3] md:aspect-[16/10] transition-transform duration-[2600ms] ease-[cubic-bezier(.83,0,.17,1)]"
          style={{ 
            transform: flipped ? "translateX(0)" : "translateX(-25%)",
          }}
        >
          {/* HALAMAN KANAN (Dasar buku - Menampilkan Arti) */}
          <div
            className="absolute left-1/2 top-0 flex h-full w-1/2 flex-col items-center justify-center rounded-r-sm border p-[clamp(0.4rem,2.5vw,1.5rem)] text-center shadow-md"
            style={{ backgroundColor: CREAM, borderColor: "rgba(41,57,82,0.3)" }}
          >
            <p
              className="max-w-[26ch] text-balance leading-relaxed text-[clamp(0.5rem,1.8vw,0.85rem)] opacity-80"
              style={{ color: NAVY }}
            >
              {VERSE.meaning}
            </p>
            <p
              className="mt-[clamp(0.5rem,2vw,1.25rem)] font-serif text-[clamp(0.6rem,2vw,1rem)] opacity-90 font-semibold"
              style={{ color: NAVY }}
            >
              {VERSE.names}
            </p>
          </div>

          {/* GARIS TENGAH (Spine - Engsel Buku) */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 z-[5] h-full w-[2px] sm:w-[3px] -translate-x-1/2"
            style={{
              background:
                "linear-gradient(180deg, rgba(41,57,82,0.1), rgba(41,57,82,0.4), rgba(41,57,82,0.1))",
            }}
          />

          {/* HALAMAN KIRI (Cover yang bisa terbuka) */}
          <div
            className="absolute left-1/2 top-0 z-50 h-full w-1/2 [transform-origin:left_center] [transform-style:preserve-3d] transition-transform duration-[2600ms] ease-[cubic-bezier(.83,0,.17,1)]"
            style={{ transform: flipped ? "rotateY(-180deg)" : "rotateY(0deg)" }}
          >
            
            {/* SISI DEPAN (Menjadi Cover Utama - Berisi Ayat Arab) */}
            <div
              className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-r-sm border p-[clamp(0.5rem,2.5vw,1.5rem)] text-center shadow-lg [backface-visibility:hidden]"
              style={{ backgroundColor: CREAM, borderColor: "rgba(41,57,82,0.3)" }}
            >
              <p
                className="text-balance font-serif leading-[1.8] text-[clamp(0.7rem,3vw,1.4rem)] md:text-[clamp(1rem,2vw,1.5rem)]"
                dir="rtl"
                style={{ color: NAVY }}
              >
                {VERSE.arabic}
              </p>
              
              <div
                className={`absolute inset-0 ${flipped ? "animate-[glareSweep_2.6s_cubic-bezier(.83,0,.17,1)]" : ""}`}
                style={{
                  background:
                    "linear-gradient(115deg, transparent 42%, rgba(255,255,255,.6) 50%, transparent 58%)",
                }}
              />
            </div>

            {/* SISI BELAKANG (Terlihat saat buku terbuka di sebelah kiri) */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-l-sm border p-[clamp(0.5rem,2.5vw,1.5rem)] text-center shadow-inner [backface-visibility:hidden] [transform:rotateY(180deg)]"
              style={{ backgroundColor: CREAM, borderColor: "rgba(41,57,82,0.3)" }}
            >
              <p
                className="text-balance font-serif leading-[1.8] text-[clamp(0.7rem,3vw,1.4rem)] md:text-[clamp(1rem,2vw,1.5rem)]"
                dir="rtl"
                style={{ color: NAVY }}
              >
                {VERSE.arabic}
              </p>
            </div>

          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes glareSweep {
          0% { opacity: 0; }
          45% { opacity: 0.7; }
          55% { opacity: 0.7; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}