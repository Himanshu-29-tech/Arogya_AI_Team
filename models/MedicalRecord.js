import mongoose from 'mongoose';

const BiomarkerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
  numericValue: { type: Number },
  unit: { type: String, default: '' },
  referenceRange: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['normal', 'low', 'high', 'critical', 'optimal'],
    default: 'normal' 
  },
});

const MedicalRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    default: 'medical_report.pdf',
  },
  recordType: {
    type: String,
    default: 'Blood Test',
  },
  recordDate: {
    type: Date,
    default: Date.now,
  },
  healthScore: {
    type: Number,
    default: 85,
    min: 0,
    max: 100,
  },
  summary: {
    type: String,
    required: true,
  },
  biomarkers: [BiomarkerSchema],
  anomalies: [{ type: String }],
  recommendations: [{ type: String }],
  rawText: { type: String },
}, {
  timestamps: true,
});

export default mongoose.models.MedicalRecord || mongoose.model('MedicalRecord', MedicalRecordSchema);
