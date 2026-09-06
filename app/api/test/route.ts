import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('sample_mflix');
    
    const guests = await db.collection('users').find({}).toArray();

    return NextResponse.json({ success: true, data: guests });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data dari database', error: String(error) },
      { status: 500 }
    );
  }
}