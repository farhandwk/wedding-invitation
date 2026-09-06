import { notFound } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import Guest from '@/models/Guest';
import Rsvp from '@/models/Rsvp';
import RsvpForm from './RsvpForm';

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await dbConnect();

  // 1. Cari data tamu berdasarkan slug
  const guestDoc = await Guest.findOne({ slug }).lean();

  if (!guestDoc) {
    return (
      <div className="p-8 text-center max-w-md mx-auto my-12 border rounded-lg bg-red-50">
        <h1 className="text-xl font-bold text-red-600 mb-2">Undangan Tidak Ditemukan</h1>
        <p className="text-sm text-slate-600">
          Tautan/slug undangan <code className="bg-red-100 px-1">{slug}</code> tidak terdaftar di sistem.
        </p>
      </div>
    );
  }

  // 2. Ambil semua RSVP & ucapan yang pernah dikirim oleh tamu ini/grup ini
  const rsvpDocs = await Rsvp.find({ guestId: guestDoc._id })
    .sort({ createdAt: -1 })
    .lean();

  // Serialisasi data MongoDB agar aman dipassing ke Client Component
  const guest = JSON.parse(JSON.stringify(guestDoc));
  const initialRsvps = JSON.parse(JSON.stringify(rsvpDocs));

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 font-sans space-y-8 my-6">
      {/* SECTION 1: COVER UNDANGAN & NAMA TAMU */}
      <section className="border-2 border-slate-300 p-6 rounded-xl text-center space-y-3 bg-slate-50">
        <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">
          Wedding Invitation
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800">
          Romeo &amp; Juliet
        </h1>
        <p className="text-sm text-slate-500">
          Pihak Mempelai: <span className="font-semibold text-slate-700">{guest.spouse === 'groom' ? 'Groom (Pria)' : 'Bride (Wanita)'}</span>
        </p>

        <hr className="my-4" />

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-500 uppercase mb-1">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
          <h2 className="text-2xl font-bold text-slate-900">{guest.name}</h2>
          
          {guest.isGroup && guest.groupName && (
            <p className="text-xs text-indigo-600 font-medium mt-1">
              Grup: {guest.groupName}
            </p>
          )}

          <div className="mt-2 inline-block px-3 py-1 bg-slate-100 text-xs rounded-full border text-slate-600">
            {guest.isGroup ? ' Undangan Grup WA' : ' Undangan Personal'} | Batas Maksimal: {guest.maxPax} Pax
          </div>
        </div>
      </section>

      {/* SECTION 2: DETAIL ACARA */}
      <section className="border p-6 rounded-xl space-y-4 bg-white">
        <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Informasi Acara</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-3 border rounded bg-slate-50">
            <h4 className="font-bold text-slate-700">Akad Nikah</h4>
            <p className="text-slate-600"> Sabtu, 20 Oktober 2026</p>
            <p className="text-slate-600"> 08:00 - 10:00 WIB</p>
            <p className="text-slate-500 text-xs mt-2">Masjid Agung Kota, Bandung</p>
          </div>

          <div className="p-3 border rounded bg-slate-50">
            <h4 className="font-bold text-slate-700">Resepsi</h4>
            <p className="text-slate-600"> Sabtu, 20 Oktober 2026</p>
            <p className="text-slate-600"> 11:00 - 14:00 WIB</p>
            <p className="text-slate-500 text-xs mt-2">Grand Ballroom Hotel, Bandung</p>
          </div>
        </div>

        <a
          href="https://maps.google.com"
          target="_blank"
          rel="noreferrer"
          className="block w-full text-center py-2 bg-slate-800 text-white rounded text-sm font-medium hover:bg-slate-700"
        >
          📍 Buka Petunjuk Arah (Google Maps)
        </a>
      </section>

      {/* SECTION 3 & 4: FORM RSVP & WISHES FEED */}
      <RsvpForm guest={guest} initialRsvps={initialRsvps} />
    </div>
  );
}