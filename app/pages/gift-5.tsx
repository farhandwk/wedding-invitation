"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { serif_2 } from '@/src/lib/font';
import { Copy, Check } from 'lucide-react'; // Menambahkan ikon Check

import giftImg from "@/src/assets/gift.png"
import bniImg from "@/src/assets/bni.png"

const Gift = () => {
    const ref = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // Observer untuk mendeteksi saat komponen masuk ke layar
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

    // Fungsi untuk menyalin teks dan memicu animasi tombol
    const handleCopy = () => {
        navigator.clipboard.writeText("0750002139");
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000); // Kembali normal setelah 2 detik
    };

    const baseTransition = "transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.8,0.25,1)]";

    return (
        <section 
            ref={ref} 
            className={`${serif_2.className} px-8 flex flex-col items-center gap-4 overflow-hidden`}
        >
            {/* 1. GAMBAR KADO: Scale-up dan Float In */}
            <div className={`${baseTransition} ${
                isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-12"
            }`}>
                <Image src={giftImg} alt='Gambar Kado' className="w-[200px] sm:w-[250px] h-auto" placeholder='blur'/>
            </div>
            
            {/* 2. TEKS JUDUL & DESKRIPSI: Fade In secara berurutan */}
            <div className='w-full flex flex-col items-center gap-2'>
                <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold italic text-navy ${baseTransition} delay-[200ms] ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}>
                    Kado Hadiah
                </h1>
                
                <p className={`text-justify text-[0.85rem] sm:text-sm md:text-base lg:text-lg font-normal mb-6 w-full md:w-[70%] lg:w-[50%] opacity-90 ${baseTransition} delay-[400ms] ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}>
                    Kehadiran Anda merupakan sebuah do'a serta rasa syukur bagi kami, namun jika memberi adalah bentuk Do'a & cinta kasih bagi Anda, Anda dapat memberi kado secara cashless dan kami akan senang hati menerimanya dan tentu semakin melengkapi kebahagiaan kami. Jazakumullahu khayran
                </p>
            </div>
            
            {/* 3. KARTU REKENING (CARD): Pop-up 3D Effect */}
            <div className={`flex flex-col items-center bg-navy w-6/7 md:w-[60%] lg:w-[40%] py-6 px-4 text-white gap-4 rounded-md shadow-xl ${baseTransition} delay-[600ms] ${
                isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
            }`}>
                <Image src={bniImg} alt='Logo BNI' placeholder='blur' className='w-[150px] sm:w-[200px] h-auto mb-2'/>
                
                <div className='flex flex-col items-center gap-1 tracking-wide'>
                    <p className="text-sm sm:text-base font-medium opacity-90">a.n. Dhimas Sasmita Widada</p>
                    <p className="text-xl sm:text-2xl font-bold font-mono tracking-widest text-white">
                        0750002139
                    </p>
                </div>
                
                {/* TOMBOL SALIN INTERAKTIF */}
                <button 
                    onClick={handleCopy}
                    className={`flex items-center justify-center gap-2 px-4 py-2 mt-2 text-sm rounded-sm transition-all duration-300 shadow-md active:scale-95 ${
                        isCopied ? "bg-green-600 text-white" : "bg-gold text-white hover:bg-gold-light"
                    }`}
                >
                    {isCopied ? <Check size={20} className="animate-in zoom-in" /> : <Copy size={20} />}
                    <span className='font-bold'>
                        {isCopied ? "Tersalin!" : "Salin No Rekening"}
                    </span>
                </button>
            </div>
        </section>
    )
}

export default Gift;