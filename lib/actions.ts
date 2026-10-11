"use server";

import mongoose from 'mongoose';
import Rsvp from '@/models/Rsvp';     // Sesuaikan path import model Anda
import Guest from '@/models/Guest';   // Sesuaikan path import model Anda
import { revalidatePath } from 'next/cache';

// Pastikan koneksi DB (Sesuaikan dengan cara Anda mengkoneksikan DB sebelumnya)
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

export async function submitRsvp(formData: {
  guestSlug: string;
  responderName: string;
  attendanceStatus: 'attending' | 'declining';
  wishes: string;
}) {
  try {
    await connectDB();

    // 1. Cari Guest berdasarkan slug (dari parameter URL ?to=...)
    // Jika format URL menggunakan nama biasa (Bapak Andi), kita ubah jadi format slug-friendly di pencarian
    let guest = await Guest.findOne({ 
      $or: [
        { slug: formData.guestSlug },
        { name: { $regex: new RegExp(`^${formData.guestSlug}$`, 'i') } } // Fallback cari pakai nama
      ]
    });

    // Jika guest tidak ditemukan di DB, kita buatkan akun "Guest Public" otomatis
    // agar form tidak error jika diisi oleh orang yang tidak ada di database
    if (!guest) {
      guest = await Guest.create({
        name: formData.guestSlug || formData.responderName,
        slug: (formData.guestSlug || formData.responderName).toLowerCase().replace(/\s+/g, '-'),
        spouse: 'groom', // Default
        category: 'public',
        attendance: formData.attendanceStatus,
      });
    }

    // 2. Simpan Data RSVP
    await Rsvp.create({
      guestId: guest._id,
      responderName: formData.responderName,
      attendanceStatus: formData.attendanceStatus,
      wishes: formData.wishes,
    });

    // 3. Update status kehadiran di tabel Guest
    guest.attendance = formData.attendanceStatus;
    await guest.save();

    // Refresh halaman agar ucapan baru langsung muncul
    revalidatePath('/');
    
    return { success: true, message: 'RSVP berhasil dikirim!' };
  } catch (error: any) {
    console.error("Error submit RSVP:", error);
    return { success: false, message: error.message || 'Gagal mengirim RSVP' };
  }
}

export async function getWishes() {
  try {
    await connectDB();
    // Ambil semua RSVP yang memiliki ucapan, urutkan dari yang terbaru
    const rsvps = await Rsvp.find({ wishes: { $ne: '' } })
                            .sort({ createdAt: -1 })
                            .lean();

    // KUNCI PENTING: Ubah ObjectId dan Date menjadi String agar tidak kena error
    // "Only plain objects can be passed to Client Components"
    return rsvps.map((r: any) => ({
      _id: r._id.toString(),
      responderName: r.responderName,
      wishes: r.wishes,
      createdAt: r.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error get wishes:", error);
    return [];
  }
}