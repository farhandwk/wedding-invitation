import mongoose, { Schema, Document } from 'mongoose';

export type SpouseStatus = 'groom' | 'bride';
export type AttendanceStatus = 'attending' | 'declining' | 'uncertain';
export type GuestCategory = 'public' | 'friend' | 'family';

export interface IGuest extends Document {
  name: string;
  slug: string;
  phone?: string;
  spouse: SpouseStatus;
  category: GuestCategory;
  isGroup: boolean;
  maxPax: number;
  attendance: AttendanceStatus;
  groupName?: string; // Nama Grup WA (misal: "Alumni Angkatan 2018")
  createdAt: Date;
}

const GuestSchema: Schema = new Schema({
  name: { type: String, required: [true, 'Nama wajib diisi'] },
  slug: { type: String, required: true, unique: true },
  phone: { type: String, default: '' },
  spouse: { 
    type: String,
    enum: {
      values: ['groom', 'bride'] satisfies SpouseStatus[],
      message: 'Status Spouse {VALUE} tidak valid!'
    },
    required: true
  },
  category: { 
    type: String,
    enum: {
      values: ['public', 'friend', 'family'] satisfies GuestCategory[],
      message: 'Kategori {VALUE} tidak valid!'
    },
    required: true
  },
  isGroup: { type: Boolean, default: false },
  maxPax: { type: Number, default: 2 },
  attendance: {
    type: String,
    enum: {
      values: ['attending', 'declining', 'uncertain'] satisfies AttendanceStatus[],
      message: "Status Attendance {VALUE} tidak valid!"
    },
    required: true // PERBAIKAN: ejaan 'required'
  },
  groupName: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Guest || mongoose.model<IGuest>('Guest', GuestSchema);