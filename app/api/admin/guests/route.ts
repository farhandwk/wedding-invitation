import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Guest from '@/models/Guest';

// GET: Ambil Seluruh Data Tamu (Urut Terbaru)
export async function GET() {
  try {
    await dbConnect();
    const guests = await Guest.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: guests }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data tamu', error: error.message },
      { status: 500 }
    );
  }
}

// POST: Tambah Tamu Baru
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // --- TAMBAHKAN BLOK SANITASI INI ---
    if (body.phone) {
      body.phone = body.phone.replace(/[^0-9]/g, '');
      if (body.phone.startsWith('0')) {
        body.phone = '62' + body.phone.substring(1);
      }
    }
    // -----------------------------------

    // Validasi keunikan Slug
    const existingSlug = await Guest.findOne({ slug: body.slug });
    if (existingSlug) {
      return NextResponse.json(
        { success: false, message: 'Slug URL sudah terpakai, silakan ubah nama/slug' },
        { status: 400 }
      );
    }

    const newGuest = await Guest.create(body);

    return NextResponse.json(
      { success: true, message: 'Tamu berhasil ditambahkan', data: newGuest },
      { status: 201 }
    );
  } catch (error: any) {
    // TANGKAP ERROR DUPLIKAT SLUG (11000)
    if (error.code === 11000 && error.keyPattern && error.keyPattern.slug) {
      return NextResponse.json(
        { success: false, message: 'Gagal: Nama atau Slug ini sudah digunakan oleh tamu lain.' },
        { status: 400 } // Gunakan 400 Bad Request
      );
    }

    // Tangkap error validasi umum dari Mongoose
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    // Error lainnya (Server Error)
    console.error("API Guest Error:", error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server.' },
      { status: 500 }
    );
  }
}