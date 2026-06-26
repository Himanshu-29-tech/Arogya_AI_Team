import mongoose from 'mongoose';

const MedicineSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    schedule: {
      morning: { type: Boolean, default: false },
      afternoon: { type: Boolean, default: false },
      night: { type: Boolean, default: false },
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

export default mongoose.models.Medicine || mongoose.model('Medicine', MedicineSchema);
