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
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menambahkan tamu' },
      { status: 400 }
    );
  }
}