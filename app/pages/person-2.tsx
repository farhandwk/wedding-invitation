import React from 'react'
import { serif, script, serif_2 } from '@/src/lib/font';
import Image from "next/image";

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

const Person  = () => {
    return (
        <section className={`${serif.className} h-auto min-w-[100vw] bg-[#FFFFF] flex flex-col gap-24 items-center justify-center text-center px-6 py-24 text-base`}>
            <h1 className=''>Ya Allah.. bersimpuh kami memohon ridha-Mu untuk pernikahan putra-putri kami:</h1>
            <div className='flex flex-col gap-8'>
                {persons.map((p) => (
                    <div key={p.id} className={`${serif_2.className} flex ${p.id == "1" ? "flex-row" : "flex-row-reverse"} items-center gap-4`}>
                        {p.img && (
                        <Image src={p.img} alt={p.name} className="rounded-full w-28" />
                        )}
                        <div>
                        <div className={`text-2xl font-semibold`}>{p.name}</div>
                        <div className="text-sm text-gray-600 italic">{p.id == "1" ? "Putra dari" : "Putri dari"} {p.parents.join(" & ")}</div>
                        {p.home && <div className="text-xs">{p.home}</div>}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Person;