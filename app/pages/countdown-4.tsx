"use client";

import React, { useState, useEffect, useRef } from "react";
import { serif, serif_2 } from "@/src/lib/font"; // Sesuaikan path font Anda

const Countdown = () => {
  // State untuk menyimpan angka waktu
  const [timeLeft, setTimeLeft] = useState({
    hari: 0,
    jam: 0,
    menit: 0,
    detik: 0,
  });

  // State untuk animasi kemunculan
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Target Waktu: 1 November 2026, Pukul 11:00 WIB
  const TARGET_DATE = new Date("2026-11-01T11:00:00+07:00").getTime();

  useEffect(() => {
    // 1. Logika Animasi Observer
    const el = ref.current;
    if (el) {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            io.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      io.observe(el);
    }

    // 2. Logika Hitung Mundur
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = TARGET_DATE - now;

      // Jika waktu sudah lewat, hentikan interval
      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      // Kalkulasi Hari, Jam, Menit, Detik
      setTimeLeft({
        hari: Math.floor(distance / (1000 * 60 * 60 * 24)),
        jam: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        menit: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        detik: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000); // Diperbarui setiap 1000 milidetik (1 detik)

    return () => clearInterval(interval);
  }, []);

  // Memasukkan state ke dalam array untuk memudahkan perulangan (mapping) UI
  const timeBlocks = [
    { label: "Hari", value: timeLeft.hari },
    { label: "Jam", value: timeLeft.jam },
    { label: "Menit", value: timeLeft.menit },
    { label: "Detik", value: timeLeft.detik },
  ];

  return (
    <section 
      ref={ref} 
      className="flex flex-col items-center justify-center py-16 pt-0 px-4 bg-[#FFFFFF] overflow-hidden"
    >
      {/* JUDUL */}
      <h2 className={`${serif.className} text-2xl sm:text-3xl text-navy font-semibold mb-8 transition-all duration-[1200ms] ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
      }`}>
        Hitung Mundur Hari
      </h2>

      {/* KOTAK-KOTAK HITUNG MUNDUR */}
      <div className="flex flex-row gap-3 sm:gap-6 md:gap-8 justify-center">
        {timeBlocks.map((block, index) => (
          <div
            key={block.label}
            className={`flex flex-col items-center justify-center w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 bg-navy rounded-lg shadow-lg transition-all duration-[1000ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-75"
            }`}
            // Trik Delay: Kotak muncul berurutan (0ms, 150ms, 300ms, 450ms)
            style={{ 
              transitionDelay: `${index * 150}ms`,
              border: '1px solid rgba(212, 184, 122, 0.4)' // Border tipis warna gold
            }} 
          >
            {/* Angka (Menggunakan padStart agar selalu 2 digit, misal: '09', '12') */}
            <span className={`${serif_2.className} text-2xl sm:text-3xl md:text-4xl text-cream font-bold leading-none`}>
              {block.value.toString().padStart(2, "0")}
            </span>
            
            {/* Label Waktu */}
            <span className={`${serif.className} text-[0.65rem] sm:text-xs md:text-sm text-gold mt-1 sm:mt-2 uppercase tracking-widest`}>
              {block.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Countdown;