"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { serif_2 } from '@/src/lib/font';
import { Copy, Check, Home, MapPin } from 'lucide-react';

import giftImg from "@/src/assets/gift.png"
import bniImg from "@/src/assets/bni.png"
import bcaImg from "@/src/assets/bca.png"

const Gift = () => {
    const ref = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

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
            { threshold: 0.15 }
        );

        io.observe(el);
        return () => io.disconnect();
    }, []);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => {
            setCopiedId(null);
        }, 2000); 
    };

    const baseTransition = "transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.8,0.25,1)]";
    
    // Variabel Alamat
    const alamatFisik = "Desa Gondang RT 1C, RW 1, Kecamatan Watumalang, Kabupaten Wonosobo, Jawa Tengah 56352";

    return (
        <section 
            ref={ref} 
            className={`${serif_2.className} px-6 sm:px-8 flex flex-col items-center gap-8 overflow-hidden w-full bg-white py-16`}
        >
            {/* 1. GAMBAR KADO */}
            <div className={`${baseTransition} ${
                isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-12"
            }`}>
                <Image src={giftImg} alt='Gambar Kado' className="w-[180px] sm:w-[220px] h-auto drop-shadow-sm" placeholder='blur'/>
            </div>
            
            {/* 2. TEKS JUDUL & DESKRIPSI */}
            <div className='w-full flex flex-col items-center gap-3'>
                <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold italic text-navy ${baseTransition} delay-[200ms] ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}>
                    Kado Hadiah
                </h1>
                
                <p className={`text-center md:text-justify text-[0.85rem] sm:text-sm md:text-base lg:text-lg font-normal mb-2 w-full md:w-[80%] lg:w-[65%] opacity-90 ${baseTransition} delay-[400ms] ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}>
                    Kehadiran Anda merupakan sebuah do'a serta rasa syukur bagi kami, namun jika memberi adalah bentuk Do'a & cinta kasih bagi Anda, Anda dapat memberi kado secara cashless ataupun mengirimkan hadiah fisik ke alamat kami. Tentu hal tersebut akan semakin melengkapi kebahagiaan kami. Jazakumullahu khayran.
                </p>
            </div>
            
            {/* 3. KONTAINER KARTU (Responsif: flex-wrap agar muat 3 kotak) */}
            <div className="flex flex-row flex-wrap items-stretch justify-center gap-6 w-full max-w-6xl mt-4">
                
                {/* --- KARTU BNI --- */}
                <div className={`flex flex-col items-center justify-between bg-navy w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-[320px] py-6 px-4 text-white gap-5 rounded-md shadow-xl ${baseTransition} delay-[600ms] ${
                    isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
                }`}>
                    <Image src={bniImg} alt='Logo BNI' placeholder='blur' className='w-[140px] h-auto mb-1'/>
                    
                    <div className='flex flex-col items-center gap-1 tracking-wide flex-grow justify-center'>
                        <p className="text-sm sm:text-base font-medium opacity-90 text-center">a.n. Dhimas Sasmita Widada</p>
                        <p className="text-xl sm:text-2xl font-bold font-mono tracking-widest text-gold-light text-center">
                            0750002139
                        </p>
                    </div>
                    
                    <button 
                        onClick={() => handleCopy("0750002139", "bni")}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 mt-2 text-sm rounded-sm transition-all duration-300 shadow-md active:scale-95 w-[95%] ${
                            copiedId === "bni" ? "bg-green-600 text-white" : "bg-gold text-white hover:bg-gold-light"
                        }`}
                    >
                        {copiedId === "bni" ? <Check size={18} className="animate-in zoom-in" /> : <Copy size={18} />}
                        <span className='font-bold'>
                            {copiedId === "bni" ? "Tersalin!" : "Salin Rekening"}
                        </span>
                    </button>
                </div>

                {/* --- KARTU BCA --- */}
                <div className={`flex flex-col items-center justify-between bg-navy w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-[320px] py-6 px-4 text-white gap-5 rounded-md shadow-xl ${baseTransition} delay-[800ms] ${
                    isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
                }`}>
                    <Image src={bcaImg} alt='Logo BCA' placeholder='blur' className='w-[140px] h-auto mb-1'/>
                    
                    <div className='flex flex-col items-center gap-1 tracking-wide flex-grow justify-center'>
                        <p className="text-sm sm:text-base font-medium opacity-90 text-center">a.n. Gita Amellia</p>
                        <p className="text-xl sm:text-2xl font-bold font-mono tracking-widest text-gold-light text-center">
                            1234567890 
                        </p>
                    </div>
                    
                    <button 
                        onClick={() => handleCopy("1234567890", "bca")}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 mt-2 text-sm rounded-sm transition-all duration-300 shadow-md active:scale-95 w-[95%] ${
                            copiedId === "bca" ? "bg-green-600 text-white" : "bg-gold text-white hover:bg-gold-light"
                        }`}
                    >
                        {copiedId === "bca" ? <Check size={18} className="animate-in zoom-in" /> : <Copy size={18} />}
                        <span className='font-bold'>
                            {copiedId === "bca" ? "Tersalin!" : "Salin Rekening"}
                        </span>
                    </button>
                </div>

                {/* --- KARTU ALAMAT FISIK --- */}
                <div className={`flex flex-col items-center justify-between bg-navy w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-[320px] py-6 px-4 text-white gap-5 rounded-md shadow-xl ${baseTransition} delay-[1000ms] ${
                    isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
                }`}>
                    <div className="flex flex-col items-center justify-center gap-2 mb-1 h-[45px]">
                        <Home size={36} className="text-gold" strokeWidth={1.5} />
                    </div>
                    
                    <div className='flex flex-col items-center gap-2 tracking-wide flex-grow justify-center'>
                        <div className="flex items-center gap-1.5 opacity-90 text-gold-light">
                            <MapPin size={16} />
                            <p className="text-sm sm:text-base font-bold">Alamat Pengiriman</p>
                        </div>
                        <p className="text-xs sm:text-sm font-normal text-center leading-relaxed text-white/90 px-2">
                            {alamatFisik}
                        </p>
                    </div>
                    
                    <button 
                        onClick={() => handleCopy(alamatFisik, "alamat")}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 mt-2 text-sm rounded-sm transition-all duration-300 shadow-md active:scale-95 w-[95%] ${
                            copiedId === "alamat" ? "bg-green-600 text-white" : "bg-gold text-white hover:bg-gold-light"
                        }`}
                    >
                        {copiedId === "alamat" ? <Check size={18} className="animate-in zoom-in" /> : <Copy size={18} />}
                        <span className='font-bold'>
                            {copiedId === "alamat" ? "Tersalin!" : "Salin Alamat"}
                        </span>
                    </button>
                </div>

            </div>
        </section>
    )
}

export default Gift;