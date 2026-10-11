import mongoose, { Schema, Document } from 'mongoose';
import { AttendanceStatus } from './Guest';

export interface IRsvp extends Document {
  guestId: mongoose.Types.ObjectId;
  responderName: string; // Nama personal yang mengisi RSVP (Budi, Sisi, dll.)
  attendanceStatus: AttendanceStatus;
  wishes?: string;
  createdAt: Date;
}

const RsvpSchema: Schema = new Schema({
  guestId: { type: Schema.Types.ObjectId, ref: 'Guest', required: true },
  responderName: { type: String, required: [true, 'Nama pengisi RSVP wajib diisi'] },
  attendanceStatus: { 
    type: String, 
    enum: ['attending', 'declining', 'uncertain'], 
    required: true 
  },
  wishes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Rsvp || mongoose.model<IRsvp>('Rsvp', RsvpSchema);