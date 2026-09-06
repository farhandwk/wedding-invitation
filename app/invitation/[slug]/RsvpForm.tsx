'use client';

import { useState } from 'react';

interface RsvpFormProps {
  guest: {
    _id: string;
    name: string;
    isGroup: boolean;
    maxPax: number;
  };
  initialRsvps: Array<{
    _id: string;
    responderName: string;
    attendanceStatus: 'attending' | 'declining' | 'uncertain';
    paxCount: number;
    wishes: string;
    createdAt: string;
  }>;
}

export default function RsvpForm({ guest, initialRsvps }: RsvpFormProps) {
  const [rsvps, setRsvps] = useState(initialRsvps);
  const [loading, setLoading] = useState(false);

  // Default nama pengisi: jika personal pakai nama tamu, jika grup dikosongkan
  const [responderName, setResponderName] = useState(guest.isGroup ? '' : guest.name);
  const [attendanceStatus, setAttendanceStatus] = useState<'attending' | 'declining' | 'uncertain'>('attending');
  const [paxCount, setPaxCount] = useState<number>(1);
  const [wishes, setWishes] = useState('');

  const handleSubmitRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responderName.trim()) {
      alert('Silakan isi nama Anda');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestId: guest._id,
          responderName,
          attendanceStatus,
          paxCount: attendanceStatus === 'attending' ? Number(paxCount) : 0,
          wishes,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      alert('Konfirmasi RSVP & Ucapan berhasil dikirim!');
      setRsvps([json.data, ...rsvps]);
      
      // Reset ucapan
      setWishes('');
      if (guest.isGroup) setResponderName('');
    } catch (err: any) {
      alert(err.message || 'Gagal mengirim RSVP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* FORM RSVP */}
      <section className="border p-6 rounded-xl space-y-4 bg-white">
        <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Konfirmasi Kehadiran (RSVP)</h3>

        <form onSubmit={handleSubmitRsvp} className="space-y-4">
          {/* Input Nama Pengisi */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Anda {guest.isGroup && '(Anggota Grup)'}
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan nama lengkap Anda..."
              value={responderName}
              onChange={(e) => setResponderName(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-slate-800 outline-none"
            />
          </div>

          {/* Opsi Kehadiran */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Konfirmasi Kehadiran</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAttendanceStatus('attending')}
                className={`py-2 text-xs font-bold border rounded ${
                  attendanceStatus === 'attending' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700'
                }`}
              >
                ✅ Hadir
              </button>
              <button
                type="button"
                onClick={() => setAttendanceStatus('uncertain')}
                className={`py-2 text-xs font-bold border rounded ${
                  attendanceStatus === 'uncertain' ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-50 text-slate-700'
                }`}
              >
                ❓ Ragu
              </button>
              <button
                type="button"
                onClick={() => setAttendanceStatus('declining')}
                className={`py-2 text-xs font-bold border rounded ${
                  attendanceStatus === 'declining' ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 text-slate-700'
                }`}
              >
                ❌ Tidak Hadir
              </button>
            </div>
          </div>

          {/* Jumlah Pax (Hanya tampil jika Hadir/Ragu) */}
          {attendanceStatus !== 'declining' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jumlah Orang / Pax (Maksimal {guest.maxPax})
              </label>
              <select
                value={paxCount}
                onChange={(e) => setPaxCount(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-slate-800 outline-none bg-white"
              >
                {Array.from({ length: guest.maxPax }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num} Orang
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Ucapan & Doa */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ucapan &amp; Doa</label>
            <textarea
              rows={3}
              placeholder="Tuliskan pesan atau doa untuk kedua mempelai..."
              value={wishes}
              onChange={(e) => setWishes(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-slate-800 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-slate-900 text-white font-bold rounded text-sm hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? 'Mengirim...' : 'Kirim RSVP'}
          </button>
        </form>
      </section>

      {/* FEED UCAPAN & DOA */}
      <section className="border p-6 rounded-xl space-y-4 bg-slate-50">
        <h3 className="text-lg font-bold text-slate-800 border-b pb-2">
          Ucapan &amp; Doa ({rsvps.length})
        </h3>

        {rsvps.length === 0 ? (
          <p className="text-sm text-slate-400 italic text-center py-4">
            Belum ada ucapan dikirim. Jadilah yang pertama!
          </p>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {rsvps.map((item) => (
              <div key={item._id} className="p-3 bg-white border rounded-lg text-sm space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">{item.responderName}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      item.attendanceStatus === 'attending'
                        ? 'bg-emerald-100 text-emerald-700'
                        : item.attendanceStatus === 'uncertain'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {item.attendanceStatus === 'attending'
                      ? `Hadir (${item.paxCount} Pax)`
                      : item.attendanceStatus === 'uncertain'
                      ? 'Ragu-ragu'
                      : 'Tidak Hadir'}
                  </span>
                </div>
                {item.wishes && <p className="text-slate-600 text-xs italic">"{item.wishes}"</p>}
                <div className="text-[10px] text-slate-400">
                  {new Date(item.createdAt).toLocaleString('id-ID')}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}