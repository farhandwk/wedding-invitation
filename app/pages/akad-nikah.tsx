"use client";

import React, { useEffect, useRef, useState } from "react";
import { serif_2, serif, script } from "@/src/lib/font";
import akadImg from "@/src/assets/akad.png";
import Image from "next/image";
import { Calendar, Clock5 } from 'lucide-react';

const AkadNikah = () => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const baseTransition = "transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.8,0.25,1)]";

  return (
    <section 
      ref={ref} 
      className={`${serif_2.className} w-full h-auto bg-[#FFFFFF] flex flex-col items-center py-20 px-6`}
    >
      {/* Bingkai Luar (Outer Frame) */}
      <div 
        className={`w-full max-w-4xl p-2 md:p-3 bg-white shadow-sm border border-navy/10
          ${baseTransition} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
      >
        {/* Bingkai Dalam (Inner Frame) dengan layout Flex */}
        <div 
          className="w-full h-full border border-gold/40 p-10 py-14 md:p-16 
            flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 relative overflow-hidden"
        >
          
          {/* Ornamen Bintang/Sparkle Abstrak di Sudut (Sangat Tipis) */}
          <div className="absolute top-4 left-4 text-gold/20 text-4xl font-serif">*</div>
          <div className="absolute bottom-4 right-4 text-gold/20 text-4xl font-serif">*</div>

          {/* --- KIRI / ATAS: Gambar Assets dengan Offset Frame --- */}
          <div 
            className={`shrink-0 flex justify-center relative ${baseTransition} delay-[200ms] 
              ${isVisible ? "opacity-100 translate-x-0 scale-100" : "opacity-0 -translate-x-8 scale-95"}`}
          >
            {/* Dekorasi Bingkai Emas di belakang gambar */}
            <div className="absolute inset-0 border border-gold/50 translate-x-3 translate-y-3 rounded-sm z-0"></div>
            
            <Image 
              src={akadImg} 
              alt="Ring and Flower" 
              className="w-[200px] sm:w-[250px] md:w-[320px] h-auto object-contain drop-shadow-md relative z-10 bg-white p-2"
            />
          </div>

          {/* --- KANAN / BAWAH: Detail Informasi --- */}
          <div 
            className={`flex flex-col items-center md:items-start w-full gap-4 
              ${baseTransition} delay-[400ms] 
              ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
          >

            <h2 className="text-4xl sm:text-5xl md:text-6xl text-navy font-bold italic text-center md:text-left">
              Akad Nikah
            </h2>
            
            {/* Garis Dekoratif Pemisah */}
            <div className="h-[1px] w-20 md:w-32 bg-gold/50 my-2 md:my-4"></div>
            
            <div className={`${serif.className} flex flex-col items-center md:items-start w-full gap-5 mt-2`}>
              
              {/* Tanggal */}
              <div className="flex items-center text-navy/90 gap-4 text-base sm:text-lg md:text-xl">
                <Calendar className="w-5 h-5 md:w-7 md:h-7 shrink-0 text-gold" strokeWidth={1.5} />
                <p className="font-medium tracking-wide">Minggu, 1 November 2026</p>
              </div>
              
              {/* Waktu */}
              <div className="flex items-center text-navy/90 gap-4 text-base sm:text-lg md:text-xl">
                <Clock5 className="w-5 h-5 md:w-7 md:h-7 shrink-0 text-gold" strokeWidth={1.5} />
                <p className="font-medium tracking-wide">Pukul 08.00 WIB</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default AkadNikah;