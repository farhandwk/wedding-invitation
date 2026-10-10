"use client";

import React, { useEffect, useRef, useState } from 'react'
import { serif, script, serif_2 } from '@/src/lib/font';
import Image from "next/image";
import Butterfly from '@/components/Butterfly';

import AnimatedLine from '@/components/AnimatedLine';

import brideImg from "@/src/assets/bride.png"
import groomImg from "@/src/assets/groom.png"
import { StaticImageData } from 'next/image';

type PersonItem = {
  id: string;
  name: string;
  parents: string[];
  home?: string;
  img?: string | StaticImageData;
};

const persons: PersonItem[] = [
  {
    id: "1",
    name: "Dhimas Sasmita Widada",
    parents: ["Heru Sutomo", "Emy Rezeki"],
    home: "Gondang RT 01C, RW 01, Watumalang, Wonosobo, Jawa Tengah",
    img: brideImg
  },
  {
    id: "2",
    name: "Gita Amellia",
    parents: ["Susanto", "Sartri Antini"],
    home: "Permata Garden Mangunharjo 2, Tembalang, Semarang, Jawa Tengah",
    img: groomImg
  }
];

// --- KOMPONEN BARU: Menangani animasi per-profil ---
const AnimatedProfile = ({ p }: { p: PersonItem }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          io.disconnect(); // Hentikan observasi setelah animasi berjalan 1x
        }
      },
      { threshold: 0.3 } // Terpicu ketika 30% area profil masuk ke layar
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Logika slide: ID 1 dari kiri (-translate-x), ID 2 dari kanan (+translate-x)
  const isFromLeft = p.id === "1";

  return (
    <div
      ref={ref}
      className={`${serif_2.className} flex ${isFromLeft ? "flex-row" : "flex-row-reverse"} text-center items-center gap-6 transition-all duration-[1500ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
        isVisible 
          ? "opacity-100 translate-x-0" 
          : `opacity-0 ${isFromLeft ? "-translate-x-16" : "translate-x-16"}`
      }`}
    >
      {p.img && (
        <Image src={p.img} alt={p.name} className="rounded-full w-28 sm:w-36 drop-shadow-md" />
      )}
      <div className="flex flex-col gap-1 flex-1">
        <h2 className={`text-2xl sm:text-3xl font-semibold text-gold`}>{p.name}</h2>
        <p className='text-sm mt-1'>{p.id === "1" ? "Putra dari" : "Putri dari"}:</p>
        <div className="text-base font-semibold italic text-gold">{p.parents.join(" & ")}</div>
        {p.home && <div className="text-xs sm:text-sm mt-1 opacity-80">{p.home}</div>}
      </div>
    </div>
  );
};

// --- KOMPONEN UTAMA ---
const Person  = () => {
    return (
        <section className={`${serif.className} text-navy h-auto min-w-[100vw] bg-[#FFFFF] flex flex-col gap-24 items-center justify-center text-center px-6 py-24 text-base overflow-hidden`}>
          <Butterfly/>
            <h1 className='text-[0.85rem] sm:text-sm md:text-base lg:text-2l font-normal'>Ya Allah.. bersimpuh kami memohon ridha-Mu untuk pernikahan putra-putri kami:</h1>
            <div className='flex flex-col w-full max-w-2xl'>
              {persons.map((p, index) => (
                <React.Fragment key={p.id}>
                  
                  {/* --- PROFIL MEMPELAI DIPANGGIL DI SINI --- */}
                  <AnimatedProfile p={p} />

                  {/* --- GARIS PEMISAH ANIMASI --- */}
                  {index !== persons.length - 1 && (
                    <AnimatedLine className="text-navy mt-4" />
                  )}
                  
                </React.Fragment>
              ))}
            </div>
        </section>
    )
}

export default Person;