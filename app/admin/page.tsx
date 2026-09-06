'use client';

import { useState, useEffect } from 'react';
import { GuestCategory, SpouseStatus, AttendanceStatus } from '@/models/Guest';

interface GuestData {
  _id?: string;
  name: string;
  slug: string;
  phone: string;
  spouse: SpouseStatus;
  category: GuestCategory;
  isGroup: boolean;
  maxPax: number | string;
  attendance: AttendanceStatus;
  groupName?: string;
}

const initialForm: GuestData = {
  name: '',
  slug: '',
  phone: '',
  spouse: 'groom',
  category: 'public',
  isGroup: false,
  maxPax: 2,
  attendance: 'uncertain',
  groupName: '',
};

export default function AdminGuestsPage() {
  const [guests, setGuests] = useState<GuestData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<GuestData>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [hasContactPicker, setHasContactPicker] = useState<boolean>(false);

  // Cek dukungan Contact Picker API di browser (misal Chrome Android)
  useEffect(() => {
    if ('contacts' in navigator && 'ContactsManager' in window) {
      setHasContactPicker(true);
    }
    fetchGuests();
  }, []);

  // Fetch semua data tamu
  const fetchGuests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/guests');
      const json = await res.json();
      if (json.success) setGuests(json.data);
    } catch (err) {
      alert('Gagal mengambil data tamu');
    } finally {
      setLoading(false);
    }
  };

  // Helper Auto-generate Slug dari Nama
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Handler Contact Picker API
  const handlePickContact = async () => {
    try {
      const props = ['name', 'tel'];
      const contacts = await (navigator as any).contacts.select(props, { multiple: false });
      
      if (contacts && contacts.length > 0) {
        const picked = contacts[0];
        const rawName = picked.name?.[0] || '';
        const rawPhone = picked.tel?.[0] || '';
        
        // Format otomatis ke format 62xxx
        const formattedPhone = rawPhone.replace(/[^0-9]/g, '').replace(/^0/, '62');

        setFormData((prev) => ({
          ...prev,
          name: rawName,
          slug: generateSlug(rawName),
          phone: formattedPhone,
        }));
      }
    } catch (err) {
      console.log('User membatalkan pilihan kontak atau error:', err);
    }
  };

  // Submit Handler (Create / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/admin/guests/${editingId}` : '/api/admin/guests';

    // Pastikan maxPax dikirim sebagai angka murni
    const payload = {
      ...formData,
      maxPax: Number(formData.maxPax) || 1,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      alert(editingId ? 'Tamu berhasil diperbarui!' : 'Tamu berhasil ditambahkan!');
      closeModal();
      fetchGuests();
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan');
    }
  };

  // Delete Handler
  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus tamu ini?')) return;
    try {
      const res = await fetch(`/api/admin/guests/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setGuests((prev) => prev.filter((g) => g._id !== id));
      }
    } catch (err) {
      alert('Gagal menghapus data');
    }
  };

  // WA Share Handler
 const handleShareWA = async (guest: GuestData) => {
  const siteUrl = window.location.origin;
  const invLink = `${siteUrl}/invitation/${guest.slug}`;

  if (guest.isGroup) {
    const targetGroup = guest.groupName || guest.name;
    const groupText = `Halo rekan-rekan ${targetGroup}, kami mengundang kalian ke acara pernikahan kami. Silakan isi konfirmasi kehadiran pada tautan berikut:\n\n${invLink}`;

    // 1. Salin nama grup ke clipboard pengguna
    try {
      await navigator.clipboard.writeText(targetGroup);
    } catch (err) {
      console.error('Gagal menyalin nama grup:', err);
    }

    // 2. Beri petunjuk singkat ke admin
    alert(`Nama grup "${targetGroup}" telah disalin!\n\nSaat WhatsApp terbuka, tekan Ctrl + V pada kolom pencarian untuk menemukan grup.`);

    // 3. Buka WhatsApp Share
    window.open(`https://wa.me/?text=${encodeURIComponent(groupText)}`, '_blank');
  } else {
    // Alur pesan personal
    const personalText = `Halo ${guest.name}, kami mengundang Anda untuk hadir di acara pernikahan kami. Mohon konfirmasi kehadiran Anda melalui tautan khusus berikut:\n\n${invLink}`;
    const targetPhone = guest.phone ? guest.phone : '';
    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(personalText)}`, '_blank');
  }
};

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (guest: GuestData) => {
    setEditingId(guest._id || null);
    setFormData(guest);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const filteredGuests = guests.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    (g.groupName && g.groupName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Tamu Undangan</h1>
          <p className="text-sm text-slate-500">Kelola daftar tamu, broadcast WhatsApp, dan tautan unik</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm flex items-center justify-center gap-2"
        >
          <span>+ Tambah Tamu</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari nama tamu / nama grup..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
        />
      </div>

      {/* Table Data */}
      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b text-slate-700 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">Tamu / Grup</th>
              <th className="px-4 py-3">Pihak</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Tipe</th>
              <th className="px-4 py-3">Kuota</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">Memuat data...</td>
              </tr>
            ) : filteredGuests.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">Belum ada data tamu</td>
              </tr>
            ) : (
              filteredGuests.map((guest) => (
                <tr key={guest._id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800">{guest.name}</div>
                    {guest.isGroup && guest.groupName && (
                      <div className="text-xs text-indigo-600">Grup: {guest.groupName}</div>
                    )}
                    <div className="text-xs text-slate-400">{guest.phone || 'Tanpa No HP'}</div>
                  </td>
                  <td className="px-4 py-3 capitalize">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${guest.spouse === 'groom' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                      {guest.spouse === 'groom' ? '👨 Pria' : '👩 Wanita'}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize">{guest.category}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${guest.isGroup ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {guest.isGroup ? 'Grup WA' : 'Personal'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{guest.maxPax} orang</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleShareWA(guest)}
                        title="Kirim Undangan WA"
                        className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        📲 WA
                      </button>
                      <button
                        onClick={() => openEditModal(guest)}
                        className="p-1.5 bg-amber-100 text-amber-700 rounded hover:bg-amber-200"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(guest._id!)}
                        className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-lg font-bold text-slate-800">
                {editingId ? 'Edit Data Tamu' : 'Tambah Tamu Baru'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Button Contact Picker */}
              {hasContactPicker && !editingId && (
                <button
                  type="button"
                  onClick={handlePickContact}
                  className="w-full py-2 px-3 bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  📱 Pilih Kontak dari HP Android
                </button>
              )}

              {/* Tipe Tamu (Personal / Grup) */}
              <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-lg border">
                <label className="text-sm font-medium text-slate-700">Tipe Undangan:</label>
                <label className="inline-flex items-center text-sm gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="isGroup"
                    checked={!formData.isGroup}
                    onChange={() => setFormData({ ...formData, isGroup: false })}
                  />
                  Personal
                </label>
                <label className="inline-flex items-center text-sm gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="isGroup"
                    checked={formData.isGroup}
                    onChange={() => setFormData({ ...formData, isGroup: true })}
                  />
                  Grup WA
                </label>
              </div>

              {/* Nama Tamu / Nama Link */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {formData.isGroup ? 'Nama Label Link Grup' : 'Nama Tamu Undangan'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={formData.isGroup ? 'misal: Alumni SMA 1' : 'misal: Budi Santoso'}
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData,
                      name,
                      slug: editingId ? formData.slug : generateSlug(name),
                    });
                  }}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Tampil Nama Grup khusus jika isGroup true */}
              {formData.isGroup && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Spesifik Grup WhatsApp</label>
                  <input
                    type="text"
                    placeholder="misal: Grup WA Angkatan 2018"
                    value={formData.groupName || ''}
                    onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              )}

              {/* Custom Slug */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">URL Slug Custom</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <span className="text-[10px] text-slate-400">Link: domain.com/invitation/{formData.slug}</span>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nomor WhatsApp (Awali 62)</label>
                <input
                  type="text"
                  placeholder="6281234567890"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Grid Option */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Pihak Mempelai</label>
                  <select
                    value={formData.spouse}
                    onChange={(e) => setFormData({ ...formData, spouse: e.target.value as SpouseStatus })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="groom">Pria</option>
                    <option value="bride">Wanita</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as GuestCategory })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="public">Umum / Public</option>
                    <option value="friend">Teman / Friend</option>
                    <option value="family">Keluarga / Family</option>
                  </select>
                </div>
              </div>

              {/* Max Pax */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Batas Maksimal Pax (Pendamping)
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={formData.maxPax}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Jika di-backspace habis, simpan string kosong ''; jika ada angka, hilangkan angka 0 di depan
                    setFormData({
                      ...formData,
                      maxPax: val === '' ? '' : parseInt(val, 10),
                    });
                  }}
                  onBlur={() => {
                    // Jika kursor keluar dan input kosong atau < 1, kembalikan otomatis ke 1
                    if (formData.maxPax === '' || Number(formData.maxPax) < 1) {
                      setFormData((prev) => ({ ...prev, maxPax: 1 }));
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-2 border-t pt-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-sm"
                >
                  {editingId ? 'Simpan Perubahan' : 'Tambah Tamu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}