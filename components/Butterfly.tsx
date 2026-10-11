// 'use client';

// import React, { useState, useEffect, useRef, useCallback } from 'react';

// interface ButterflyState {
//   x: number;
//   y: number;
//   scale: number; // Menggunakan scale menggantikan width/height demi performa
//   rotation: number;
//   tDuration: number;
//   wDuration: number;
//   isMounted: boolean;
// }

// export default function Butterfly() {
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null);

//   const [state, setState] = useState<ButterflyState>({
//     x: 0,
//     y: 0,
//     scale: 1,
//     rotation: 0,
//     tDuration: 0,
//     wDuration: 0.5,
//     isMounted: false,
//   });

//   const generateRandom = (min: number, max: number) => {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
//   };

//   const flutter = useCallback((isStartled = false) => {
//     setState((prev) => {
//       if (typeof window === 'undefined') return prev;

//       let { x, y, scale, rotation, isMounted } = prev;

//       // Mulai dari tengah layar saat pertama kali render
//       if (!isMounted) {
//         x = window.innerWidth / 2;
//         y = window.innerHeight / 2;
//       }

//       let tDuration, wDuration, nextTimer;
//       const isLévyLongJump = Math.random() < 0.15; // 15% kemungkinan terbang jauh

//       if (isStartled) {
//         // 1. MODE TERKEJUT (Diklik)
//         x += generateRandom(-300, 300);
//         y += generateRandom(-300, 300);
//         tDuration = generateRandom(3, 6) / 10; // Sangat cepat (0.3 - 0.6 detik)
//         wDuration = generateRandom(1, 2) / 10; // Kepakan panik
//         nextTimer = 800; // Cepat kembali normal
//       } else if (isLévyLongJump) {
//         // 2. LÉVY FLIGHT: Lompatan Jauh (Pindah area bunga)
//         x += generateRandom(-250, 250);
//         y += generateRandom(-250, 250);
//         tDuration = generateRandom(30, 50) / 10; // Meluncur 3-5 detik
//         wDuration = generateRandom(2, 4) / 10; // Kepakan stabil (gliding)
//         nextTimer = generateRandom(3000, 5000); 
//       } else {
//         // 3. LÉVY FLIGHT: Zigzag Pendek (Mencari nektar/Foraging)
//         x += generateRandom(-60, 60);
//         y += generateRandom(-40, 60); // Y asimetris untuk gerak organik
//         tDuration = generateRandom(10, 25) / 10; // Cepat pindah arah (1-2.5 dtk)
//         wDuration = generateRandom(4, 7) / 10; // Kepakan santai
//         nextTimer = generateRandom(1000, 2500); // Sering belok (1-2.5 dtk sekali)
//       }

//       // VEKTOR ANGIN (WIND DRIFT):
//       // Selalu ada dorongan angin lembut ke arah Kanan Atas
//       x += 15; 
//       y -= 10; 

//       // Batas Layar agar tidak hilang
//       const maxX = window.innerWidth - 100;
//       const maxY = window.innerHeight - 100;
//       x = Math.max(30, Math.min(x, maxX - 30));
//       y = Math.max(30, Math.min(y, maxY - 30));

//       // Ilusi 3D (Z-Axis): Membesar / Mengecil secara halus (0.8x hingga 1.3x)
//       scale += generateRandom(-1, 1) * 0.1;
//       scale = Math.max(0.8, Math.min(scale, 1.3));

//       // Kemiringan badan mengikuti angin/arah
//       rotation += generateRandom(-20, 20);
//       rotation = Math.max(-15, Math.min(rotation, 15));

//       if (timeoutRef.current) clearTimeout(timeoutRef.current);
//       timeoutRef.current = setTimeout(() => flutter(false), nextTimer);

//       return { x, y, scale, rotation, tDuration, wDuration, isMounted: true };
//     });
//   }, []);

//   const handleStartle = () => {
//     if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     flutter(true);
//   };

//   useEffect(() => {
//     flutter(false);
//     return () => {
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     };
//   }, [flutter]);

//   if (!state.isMounted) return null;

//   return (
//     <>
//       <style dangerouslySetInnerHTML={{ __html: `
//         /* Animasi Bobbing (Naik-Turun Gravitasi) - Diproses GPU 100% */
//         @keyframes bf_bobbing {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-12px); }
//         }
//         .bf-bobbing-wrapper {
//           width: 100%; height: 100%;
//           animation: bf_bobbing 1.5s ease-in-out infinite;
//         }

//         /* Detail Visual Kupu-kupu (Antena & Sayap) */
//         .bf-body-ant::before, .bf-body-ant::after {
//           content: ''; position: absolute; top: -18px; width: 1.5px; height: 22px; background: #293952; border-radius: 5px;
//         }
//         .bf-body-ant::before { left: 0px; transform: rotate(-35deg); }
//         .bf-body-ant::after { right: 0px; transform: rotate(35deg); }
        
//         .bf-wing {
//           background-color: #293952;
//           box-shadow: inset 0 0 15px rgba(255, 255, 255, 0.4), inset 0 0 5px #293952;
//           opacity: 0.92;
//           animation-iteration-count: infinite;
//           animation-direction: alternate;
//         }
        
//         .bf-upper-left {
//           border-radius: 10% 80% 0% 30%; transform-origin: 100% 50%; animation-name: bf_move_left;
//           background: radial-gradient(circle at 25% 25%, rgba(255,255,255,0.7) 1%, transparent 8%), radial-gradient(ellipse at 80% 80%, #5c83b8 0%, #293952 50%, #0d131c 100%);
//         }
//         .bf-upper-right {
//           border-radius: 80% 10% 30% 0%; transform-origin: 0% 50%; animation-name: bf_move_right;
//           background: radial-gradient(circle at 75% 25%, rgba(255,255,255,0.7) 1%, transparent 8%), radial-gradient(ellipse at 20% 80%, #5c83b8 0%, #293952 50%, #0d131c 100%);
//         }
//         .bf-lower-left {
//           border-radius: 30% 0% 80% 10%; transform-origin: 100% 50%; animation-name: bf_move_left;
//           background: radial-gradient(circle at 30% 70%, rgba(255,255,255,0.4) 2%, transparent 10%), radial-gradient(ellipse at 80% 20%, #4a6a96 0%, #293952 60%, #080c12 100%);
//         }
//         .bf-lower-right {
//           border-radius: 0% 30% 10% 80%; transform-origin: 0% 50%; animation-name: bf_move_right;
//           background: radial-gradient(circle at 70% 70%, rgba(255,255,255,0.4) 2%, transparent 10%), radial-gradient(ellipse at 20% 20%, #4a6a96 0%, #293952 60%, #080c12 100%);
//         }

//         /* Batas kepakan diturunkan jadi 65deg agar lebih banyak 'meluncur/gliding' natural */
//         @keyframes bf_move_left { from {transform: rotateY(0deg);} to {transform: rotateY(65deg);} }
//         @keyframes bf_move_right { from {transform: rotateY(0deg);} to {transform: rotateY(-65deg);} }
//       `}} />

//       {/* OUTER WRAPPER (Mengurus Posisi X, Y, Skala, dan Rotasi) */}
//       <div
//         onClick={handleStartle}
//         className="fixed top-0 left-0 cursor-pointer z-[9999] w-[50px] h-[50px]" // <--- TAMBAHKAN top-0 left-0 DI SINI
//         style={{
//           transform: `translate3d(${state.x}px, ${state.y}px, 0) rotate(${state.rotation}deg) scale(${state.scale})`,
//           transition: `transform ${state.tDuration}s ease-in-out`,
//           filter: 'drop-shadow(0px 15px 10px rgba(0,0,0,0.3))',
//         }}
//       >
//         {/* INNER WRAPPER (Mengurus Gerak Naik-Turun Gravitasi Otomatis) */}
//         <div className="bf-bobbing-wrapper relative">
          
//           {/* Badan & Antena */}
//           <div 
//             className="absolute top-[20%] left-1/2 w-[8px] h-[60%] rounded-full -translate-x-1/2 z-10 bf-body-ant"
//             style={{ background: 'linear-gradient(to right, #0d131c, #293952, #0d131c)' }}
//           />

//           {/* Sayap Kiri */}
//           <div className="absolute left-0 top-0 w-1/2 h-full">
//             <div className="relative w-full h-1/2 [perspective:200px]">
//               <div 
//                 className="absolute w-full h-full bf-wing bf-upper-left" 
//                 style={{ animationDuration: `${state.wDuration}s` }} 
//               />
//             </div>
//             <div className="relative w-full h-1/2 [perspective:200px]">
//               <div 
//                 className="absolute right-0 top-[-5px] w-[80%] h-[80%] bf-wing bf-lower-left" 
//                 style={{ animationDuration: `${state.wDuration}s` }} 
//               />
//             </div>
//           </div>

//           {/* Sayap Kanan */}
//           <div className="absolute right-0 top-0 w-1/2 h-full">
//             <div className="relative w-full h-1/2 [perspective:200px]">
//               <div 
//                 className="absolute w-full h-full bf-wing bf-upper-right" 
//                 style={{ animationDuration: `${state.wDuration}s` }} 
//               />
//             </div>
//             <div className="relative w-full h-1/2 [perspective:200px]">
//               <div 
//                 className="absolute left-0 top-[-5px] w-[80%] h-[80%] bf-wing bf-lower-right" 
//                 style={{ animationDuration: `${state.wDuration}s` }} 
//               />
//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// }

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// 1. Tambahkan Props untuk Tema Warna
interface ButterflyProps {
  theme?: 'navy' | 'gold';
}

interface ButterflyState {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  tDuration: number;
  wDuration: number;
  isMounted: boolean;
}

export default function Butterfly({ theme = 'navy' }: ButterflyProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [state, setState] = useState<ButterflyState>({
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    tDuration: 0,
    wDuration: 0.5,
    isMounted: false,
  });

  const generateRandom = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const flutter = useCallback((isStartled = false) => {
    setState((prev) => {
      if (typeof window === 'undefined') return prev;

      let { x, y, scale, rotation, isMounted } = prev;

      // Agar kupu-kupu tidak bertumpuk di titik yang sama persis
      if (!isMounted) {
        x = (window.innerWidth / 2) + generateRandom(-150, 150);
        y = (window.innerHeight / 2) + generateRandom(-150, 150);
      }

      let tDuration, wDuration, nextTimer;
      const isLévyLongJump = Math.random() < 0.15; 

      if (isStartled) {
        x += generateRandom(-300, 300);
        y += generateRandom(-300, 300);
        tDuration = generateRandom(3, 6) / 10; 
        wDuration = generateRandom(1, 2) / 10; 
        nextTimer = 800; 
      } else if (isLévyLongJump) {
        x += generateRandom(-250, 250);
        y += generateRandom(-250, 250);
        tDuration = generateRandom(30, 50) / 10; 
        wDuration = generateRandom(2, 4) / 10; 
        nextTimer = generateRandom(3000, 5000); 
      } else {
        x += generateRandom(-60, 60);
        y += generateRandom(-40, 60); 
        tDuration = generateRandom(10, 25) / 10; 
        wDuration = generateRandom(4, 7) / 10; 
        nextTimer = generateRandom(1000, 2500); 
      }

      x += 15; 
      y -= 10; 

      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 100;
      x = Math.max(30, Math.min(x, maxX - 30));
      y = Math.max(30, Math.min(y, maxY - 30));

      scale += generateRandom(-1, 1) * 0.1;
      scale = Math.max(0.8, Math.min(scale, 1.3));

      rotation += generateRandom(-20, 20);
      rotation = Math.max(-15, Math.min(rotation, 15));

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => flutter(false), nextTimer);

      return { x, y, scale, rotation, tDuration, wDuration, isMounted: true };
    });
  }, []);

  const handleStartle = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    flutter(true);
  };

  useEffect(() => {
    flutter(false);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [flutter]);

  if (!state.isMounted) return null;

  // 2. Konfigurasi Palet Warna berdasarkan Props
  const colors = {
    navy: {
      main: '#293952',
      light: '#5c83b8',
      dark: '#0d131c',
      lowerLight: '#4a6a96'
    },
    gold: {
      main: '#B8975A',
      light: '#D4B87A',
      dark: '#3b2c15', 
      lowerLight: '#c4a771'
    }
  };

  const activeColor = colors[theme];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bf_bobbing {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .bf-bobbing-wrapper {
          width: 100%; height: 100%;
          animation: bf_bobbing 1.5s ease-in-out infinite;
        }

        /* 3. MENGGUNAKAN CSS VARIABLES */
        .bf-body-ant::before, .bf-body-ant::after {
          content: ''; position: absolute; top: -18px; width: 1.5px; height: 22px; 
          background: var(--bf-main); border-radius: 5px;
        }
        .bf-body-ant::before { left: 0px; transform: rotate(-35deg); }
        .bf-body-ant::after { right: 0px; transform: rotate(35deg); }
        
        .bf-wing {
          background-color: var(--bf-main);
          box-shadow: inset 0 0 15px rgba(255, 255, 255, 0.4), inset 0 0 5px var(--bf-main);
          opacity: 0.92;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }
        
        .bf-upper-left {
          border-radius: 10% 80% 0% 30%; transform-origin: 100% 50%; animation-name: bf_move_left;
          background: radial-gradient(circle at 25% 25%, rgba(255,255,255,0.7) 1%, transparent 8%), radial-gradient(ellipse at 80% 80%, var(--bf-light) 0%, var(--bf-main) 50%, var(--bf-dark) 100%);
        }
        .bf-upper-right {
          border-radius: 80% 10% 30% 0%; transform-origin: 0% 50%; animation-name: bf_move_right;
          background: radial-gradient(circle at 75% 25%, rgba(255,255,255,0.7) 1%, transparent 8%), radial-gradient(ellipse at 20% 80%, var(--bf-light) 0%, var(--bf-main) 50%, var(--bf-dark) 100%);
        }
        .bf-lower-left {
          border-radius: 30% 0% 80% 10%; transform-origin: 100% 50%; animation-name: bf_move_left;
          background: radial-gradient(circle at 30% 70%, rgba(255,255,255,0.4) 2%, transparent 10%), radial-gradient(ellipse at 80% 20%, var(--bf-lower-light) 0%, var(--bf-main) 60%, var(--bf-dark) 100%);
        }
        .bf-lower-right {
          border-radius: 0% 30% 10% 80%; transform-origin: 0% 50%; animation-name: bf_move_right;
          background: radial-gradient(circle at 70% 70%, rgba(255,255,255,0.4) 2%, transparent 10%), radial-gradient(ellipse at 20% 20%, var(--bf-lower-light) 0%, var(--bf-main) 60%, var(--bf-dark) 100%);
        }

        @keyframes bf_move_left { from {transform: rotateY(0deg);} to {transform: rotateY(65deg);} }
        @keyframes bf_move_right { from {transform: rotateY(0deg);} to {transform: rotateY(-65deg);} }
      `}} />

      {/* 4. INJEKSI VARIABEL WARNA KE DALAM STYLE */}
      <div
        onClick={handleStartle}
        className="fixed top-0 left-0 cursor-pointer z-[9999] w-[50px] h-[50px]" 
        style={{
          transform: `translate3d(${state.x}px, ${state.y}px, 0) rotate(${state.rotation}deg) scale(${state.scale})`,
          transition: `transform ${state.tDuration}s ease-in-out`,
          filter: 'drop-shadow(0px 15px 10px rgba(0,0,0,0.3))',
          // Set Custom Properties CSS
          '--bf-main': activeColor.main,
          '--bf-light': activeColor.light,
          '--bf-dark': activeColor.dark,
          '--bf-lower-light': activeColor.lowerLight,
        } as React.CSSProperties}
      >
        <div className="bf-bobbing-wrapper relative">
          
          <div 
            className="absolute top-[20%] left-1/2 w-[8px] h-[60%] rounded-full -translate-x-1/2 z-10 bf-body-ant"
            style={{ background: `linear-gradient(to right, ${activeColor.dark}, ${activeColor.main}, ${activeColor.dark})` }}
          />

          <div className="absolute left-0 top-0 w-1/2 h-full">
            <div className="relative w-full h-1/2 [perspective:200px]">
              <div className="absolute w-full h-full bf-wing bf-upper-left" style={{ animationDuration: `${state.wDuration}s` }} />
            </div>
            <div className="relative w-full h-1/2 [perspective:200px]">
              <div className="absolute right-0 top-[-5px] w-[80%] h-[80%] bf-wing bf-lower-left" style={{ animationDuration: `${state.wDuration}s` }} />
            </div>
          </div>

          <div className="absolute right-0 top-0 w-1/2 h-full">
            <div className="relative w-full h-1/2 [perspective:200px]">
              <div className="absolute w-full h-full bf-wing bf-upper-right" style={{ animationDuration: `${state.wDuration}s` }} />
            </div>
            <div className="relative w-full h-1/2 [perspective:200px]">
              <div className="absolute left-0 top-[-5px] w-[80%] h-[80%] bf-wing bf-lower-right" style={{ animationDuration: `${state.wDuration}s` }} />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}