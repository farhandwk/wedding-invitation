'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Tipe data untuk State kupu-kupu
interface ButterflyState {
  x: number;
  y: number;
  size: number;
  rotation: number;
  tDuration: number; // Transition Duration (Kecepatan terbang)
  wDuration: number; // Wing Animation Duration (Kecepatan kepakan sayap)
  isMounted: boolean;
}

export default function Butterfly() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [state, setState] = useState<ButterflyState>({
    x: 0,
    y: 0,
    size: 45,
    rotation: 0,
    tDuration: 0,
    wDuration: 0.5,
    isMounted: false, // Digunakan untuk menghindari Hydration Error di Next.js
  });

  const generateRandom = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const flutter = useCallback((isStartled = false) => {
    setState((prev) => {
      if (typeof window === 'undefined') return prev;

      let { x, y, size, rotation, isMounted } = prev;

      // Inisialisasi posisi awal di tengah layar jika baru pertama kali load
      if (!isMounted) {
        x = window.innerWidth / 2;
        y = window.innerHeight / 2;
      }

      let tDuration, wDuration, nextTimer;

      if (isStartled) {
        // TERKEJUT: Melompat jauh, durasi cepat, kepakan cepat
        x += generateRandom(-300, 300);
        y += generateRandom(-300, 300);
        tDuration = generateRandom(3, 8) / 10;
        wDuration = generateRandom(1, 2) / 10;
        nextTimer = 1000; // Cepat kembali santai setelah 1 detik
      } else {
        // SANTAI: Mengambang dekat, durasi lambat, kepakan anggun
        x += generateRandom(-150, 150);
        y += generateRandom(-150, 150);
        tDuration = generateRandom(60, 120) / 10;
        wDuration = generateRandom(4, 7) / 10;
        nextTimer = generateRandom(5000, 10000); // 5-10 detik melayang lambat
      }

      // Menjaga agar tidak keluar batas layar
      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 100;
      x = Math.max(30, Math.min(x, maxX - 30));
      y = Math.max(30, Math.min(y, maxY - 30));

      // Variasi ukuran agar terlihat menjauh/mendekat (3D halus)
      size += generateRandom(-5, 5);
      size = Math.max(40, Math.min(size, 55));

      // Variasi kemiringan badan
      rotation += generateRandom(-25, 25);
      rotation = Math.max(-15, Math.min(rotation, 15));

      // Atur jadwal manuver berikutnya
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => flutter(false), nextTimer);

      return { x, y, size, rotation, tDuration, wDuration, isMounted: true };
    });
  }, []);

  // Fungsi klik saat user mengagetkan kupu-kupu
  const handleStartle = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    flutter(true);
  };

  // Jalankan animasi saat komponen di-mount ke browser
  useEffect(() => {
    flutter(false);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [flutter]);

  // Hindari render di server (Hydration mismatch) sebelum posisi fix didapatkan
  if (!state.isMounted) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .bf-body-ant::before, .bf-body-ant::after {
          content: ''; position: absolute; top: -18px; width: 1.5px; height: 22px; background: #293952; border-radius: 5px;
        }
        .bf-body-ant::before { left: 0px; transform: rotate(-35deg); }
        .bf-body-ant::after { right: 0px; transform: rotate(35deg); }
        
        .bf-wing {
          background-color: #293952;
          box-shadow: inset 0 0 15px rgba(255, 255, 255, 0.4), inset 0 0 5px #293952;
          opacity: 0.92;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }
        
        .bf-upper-left {
          border-radius: 10% 80% 0% 30%; transform-origin: 100% 50%; animation-name: bf_move_left;
          background: radial-gradient(circle at 25% 25%, rgba(255,255,255,0.7) 1%, transparent 8%), radial-gradient(ellipse at 80% 80%, #5c83b8 0%, #293952 50%, #0d131c 100%);
        }
        .bf-upper-right {
          border-radius: 80% 10% 30% 0%; transform-origin: 0% 50%; animation-name: bf_move_right;
          background: radial-gradient(circle at 75% 25%, rgba(255,255,255,0.7) 1%, transparent 8%), radial-gradient(ellipse at 20% 80%, #5c83b8 0%, #293952 50%, #0d131c 100%);
        }
        .bf-lower-left {
          border-radius: 30% 0% 80% 10%; transform-origin: 100% 50%; animation-name: bf_move_left;
          background: radial-gradient(circle at 30% 70%, rgba(255,255,255,0.4) 2%, transparent 10%), radial-gradient(ellipse at 80% 20%, #4a6a96 0%, #293952 60%, #080c12 100%);
        }
        .bf-lower-right {
          border-radius: 0% 30% 10% 80%; transform-origin: 0% 50%; animation-name: bf_move_right;
          background: radial-gradient(circle at 70% 70%, rgba(255,255,255,0.4) 2%, transparent 10%), radial-gradient(ellipse at 20% 20%, #4a6a96 0%, #293952 60%, #080c12 100%);
        }

        @keyframes bf_move_left { from {transform: rotateY(0deg);} to {transform: rotateY(70deg);} }
        @keyframes bf_move_right { from {transform: rotateY(0deg);} to {transform: rotateY(-70deg);} }
      `}} />

      <div
        onClick={handleStartle}
        className="fixed cursor-pointer z-[9999]"
        style={{
          left: `${state.x}px`,
          top: `${state.y}px`,
          width: `${state.size}px`,
          height: `${state.size}px`,
          transform: `rotate(${state.rotation}deg)`,
          transition: `all ${state.tDuration}s ease-in-out`,
          filter: 'drop-shadow(0px 15px 10px rgba(0,0,0,0.3))',
        }}
      >
        {/* Badan & Antena */}
        <div 
          className="absolute top-[20%] left-1/2 w-[8px] h-[60%] rounded-full -translate-x-1/2 z-10 bf-body-ant"
          style={{ background: 'linear-gradient(to right, #0d131c, #293952, #0d131c)' }}
        />

        {/* Sayap Kiri */}
        <div className="absolute left-0 top-0 w-1/2 h-full">
          <div className="relative w-full h-1/2 [perspective:200px]">
            <div 
              className="absolute w-full h-full bf-wing bf-upper-left" 
              style={{ animationDuration: `${state.wDuration}s` }} 
            />
          </div>
          <div className="relative w-full h-1/2 [perspective:200px]">
            <div 
              className="absolute right-0 top-[-5px] w-[80%] h-[80%] bf-wing bf-lower-left" 
              style={{ animationDuration: `${state.wDuration}s` }} 
            />
          </div>
        </div>

        {/* Sayap Kanan */}
        <div className="absolute right-0 top-0 w-1/2 h-full">
          <div className="relative w-full h-1/2 [perspective:200px]">
            <div 
              className="absolute w-full h-full bf-wing bf-upper-right" 
              style={{ animationDuration: `${state.wDuration}s` }} 
            />
          </div>
          <div className="relative w-full h-1/2 [perspective:200px]">
            <div 
              className="absolute left-0 top-[-5px] w-[80%] h-[80%] bf-wing bf-lower-right" 
              style={{ animationDuration: `${state.wDuration}s` }} 
            />
          </div>
        </div>
      </div>
    </>
  );
}