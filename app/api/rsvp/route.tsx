import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Rsvp from '@/models/Rsvp';
import Guest from '@/models/Guest';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { guestId, responderName, attendanceStatus, paxCount, wishes } = body;

    if (!guestId || !responderName || !attendanceStatus) {
      return NextResponse.json(
        { success: false, message: 'Data RSVP tidak lengkap' },
        { status: 400 }
      );
    }

    // 1. Simpan dokumen RSVP baru
    const newRsvp = await Rsvp.create({
      guestId,
      responderName,
      attendanceStatus,
      paxCount: paxCount || 1,
      wishes: wishes || '',
    });

    // 2. Update status attendance utama pada entitas Guest
    await Guest.findByIdAndUpdate(guestId, {
      attendance: attendanceStatus,
    });

    return NextResponse.json(
      { success: true, message: 'RSVP berhasil disimpan', data: newRsvp },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menyimpan RSVP' },
      { status: 500 }
    );
  }
}