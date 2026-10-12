import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import Guest from '@/models/Guest';
import Rsvp from '@/models/Rsvp'

// GET: Ambil Detail 1 Tamu Berdasarkan ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Format ID tidak valid' }, { status: 400 });
    }

    const guest = await Guest.findById(id);
    if (!guest) {
      return NextResponse.json({ success: false, message: 'Tamu tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: guest }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil detail tamu', error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update Data Tamu
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Format ID tidak valid' }, { status: 400 });
    }

    const body = await request.json();

    // Cek jika slug diubah dan bentrok dengan tamu lain
    if (body.slug) {
      const existingSlug = await Guest.findOne({ slug: body.slug, _id: { $ne: id } });
      if (existingSlug) {
        return NextResponse.json(
          { success: false, message: 'Slug URL sudah digunakan oleh tamu lain' },
          { status: 400 }
        );
      }
    }

    const updatedGuest = await Guest.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedGuest) {
      return NextResponse.json({ success: false, message: 'Tamu tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: 'Data tamu berhasil diperbarui', data: updatedGuest },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memperbarui data tamu' },
      { status: 400 }
    );
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    // await dbConnect();
    
    // Ekstrak id dengan melakukan await pada params (sudah benar)
    const { id } = await params; 

    // 1. Hapus Data Tamu (Guest)
    const deletedGuest = await Guest.findByIdAndDelete(id);

    if (!deletedGuest) {
      return NextResponse.json(
        { success: false, message: 'Data tamu tidak ditemukan.' },
        { status: 404 }
      );
    }

    // 2. CASCADING DELETE: Hapus semua ucapan/RSVP yang terhubung dengan ID tamu tersebut
    await Rsvp.deleteMany({ guestId: id });

    return NextResponse.json(
      { success: true, message: 'Data tamu beserta data RSVP-nya berhasil dihapus permanen.' },
      { status: 200 }
    );
    
  } catch (error: any) {
    console.error("API Delete Guest Error:", error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server saat menghapus data.' },
      { status: 500 }
    );
  }
}