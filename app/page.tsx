import EnvelopeIntro from "@/components/Envelopeintro";

const goldText = {
  backgroundImage: "linear-gradient(120deg, #9A7B45, #D4B87A 45%, #B8975A)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
} as const;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ to?: string }>;
}) {
  const { to } = await searchParams; // contoh: /?to=Bapak%20Andi
  return (
    <EnvelopeIntro guest={to}>
      <main className="min-h-screen bg-[#FBF8F3] text-[#1F2A48]">
        <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <p className="text-lg">Undangan Pernikahan</p>
          <h1 className="my-4 text-6xl sm:text-8xl" style={{ ...goldText, fontFamily: "'Pinyon Script', cursive" }}>
            Dhimas &amp; Gita
          </h1>
          <div className="my-4 h-px w-48 bg-[#B8975A]" />
          <p className="text-xl">Minggu, 1 November 2026</p>
          <p className="mt-1 opacity-70">Desa Gondang, Watumalang, Wonosobo</p>
        </section>
        {/* section berikutnya: mempelai, acara, denah, RSVP (bergantian navy/putih) */}
        <section className="min-h-screen bg-[#2A3555] px-6 py-24 text-center text-[#F4EFE6]">
          <p className="mx-auto max-w-md">Ar-Rum ayat 21 dan denah lokasi di sini.</p>
        </section>
      </main>
    </EnvelopeIntro>
  );
}